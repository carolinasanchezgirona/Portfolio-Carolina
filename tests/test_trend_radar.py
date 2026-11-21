import importlib.util
import unittest
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path


script = Path(__file__).resolve().parent.parent / "scripts" / "trend-radar-telegram.py"
spec = importlib.util.spec_from_file_location("trend_radar_telegram", script)
radar = importlib.util.module_from_spec(spec)
spec.loader.exec_module(radar)


class TrendRadarTests(unittest.TestCase):
    def test_parse_news_and_recent_date(self):
        day = datetime.now(timezone.utc)
        pub = day.strftime("%a, %d %b %Y %H:%M:%S GMT")
        old = (day - timedelta(days=14)).strftime("%a, %d %b %Y %H:%M:%S GMT")
        xml = (
            "<rss><channel>"
            "<item><title>Nuevo estudio sobre memoria - Revista</title><link>https://news.google.com/articles/a</link>"
            "<source>Revista</source><pubDate>" + pub + "</pubDate></item>"
            "<item><title>Vieja noticia</title><link>https://news.google.com/articles/b</link>"
            "<source>Medio</source><pubDate>" + old + "</pubDate></item>"
            "</channel></rss>"
        )
        result = radar.parse_news(xml.encode(), day)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["title"], "Nuevo estudio sobre memoria")
        self.assertEqual(len(result[0]["id"]), 18)

    def test_requires_two_independent_sources(self):
        now = datetime.now(timezone.utc)
        t = radar.THEMES[0]
        rows = [
            {"id": "1", "title": "Noticia sobre memoria A", "source": "Medio A",
             "url": "https://news.google.com/a", "date": now},
            {"id": "2", "title": "Noticia sobre memoria B", "source": "Medio A",
             "url": "https://news.google.com/b", "date": now},
        ]
        self.assertEqual(radar.score_themes({t["name"]: rows}, [], set()), [])
        rows[1]["source"] = "Medio B"
        picks = radar.score_themes({t["name"]: rows}, [], set())
        self.assertEqual(len(picks), 1)
        self.assertEqual(picks[0]["potential"], "MEDIO")
        self.assertEqual(radar.score_themes({t["name"]: rows}, [], {"1"}), [])

    def test_trends_matching(self):
        now = datetime.now(timezone.utc)
        t = radar.THEMES[0]
        rows = [
            {"id": "1", "title": "Noticia sobre memoria A", "source": "Medio A", "url": "https://news.google.com/a", "date": now},
            {"id": "2", "title": "Noticia sobre memoria B", "source": "Medio B", "url": "https://news.google.com/b", "date": now},
        ]
        picks = radar.score_themes({t["name"]: rows}, ["Alzhéimer"], set())
        # El término sin tilde del feed se contrasta con las variantes en el radar.
        self.assertEqual(len(picks), 1)
        self.assertTrue(picks[0]["trends"])
        self.assertEqual(picks[0]["potential"], "ALTO")

    def test_long_report_is_split_without_dropping_topics(self):
        now = datetime.now(timezone.utc)
        picks = []
        for i, theme in enumerate(radar.THEMES[:5]):
            long_story = {
                "id": str(i), "title": "memoria y psicología " + "novedades " * 12,
                "source": "Medio A", "url": "https://news.google.com/rss/articles/" + "x" * 460,
                "date": now,
            }
            picks.append({
                "theme": theme, "stories": [long_story, dict(long_story, source="Medio B", id="b" + str(i))],
                "publishers": 2, "trends": False, "potential": "MEDIO",
            })
        messages = radar.render_messages(now.astimezone(radar.MADRID).date(), picks, 9, True)
        self.assertGreater(len(messages), 1)
        self.assertTrue(all(len(message) < 4096 for message in messages))
        for theme in radar.THEMES[:5]:
            self.assertIn(theme["name"], "\n".join(messages))

    def test_editorial_brief_contains_source_and_scientific_warning(self):
        now = datetime.now(timezone.utc)
        theme = radar.THEMES[0]
        story = {"id": "new-id", "title": "Nuevo estudio sobre memoria",
                 "source": "Medio A", "url": "https://news.google.com/articles/news",
                 "date": now}
        pick = {"theme": theme, "stories": [story], "publishers": 2,
                "trends": False, "potential": "MEDIO"}
        report = radar.render_editorial_report(now, [pick], 9, True)
        self.assertIn("Radar editorial: oportunidades para el blog", report)
        self.assertIn("Nuevo estudio sobre memoria", report)
        self.assertIn("https://news.google.com/articles/news", report)
        self.assertIn("no evidencia clínica", report)
        self.assertIn("comprobar las fuentes científicas", report)
        self.assertIn("Actualizado:", report)

    def test_escape_html_and_safety(self):
        self.assertEqual(radar.escape_html('<b>"hola"</b>'), '&lt;b&gt;&quot;hola&quot;&lt;/b&gt;')
        self.assertIsNone(radar.safe_url('http://example.com'))
        self.assertIsNone(radar.safe_url('https://name:pass@example.com/'))
        self.assertEqual(radar.safe_url('https://news.google.com/a'), 'https://news.google.com/a')


if __name__ == "__main__":
    unittest.main()
