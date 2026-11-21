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
            {"id": "1", "title": "Noticia A", "source": "Medio A",
             "url": "https://news.google.com/a", "date": now},
            {"id": "2", "title": "Noticia B", "source": "Medio A",
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
            {"id": "1", "title": "Noticia A", "source": "Medio A", "url": "https://news.google.com/a", "date": now},
            {"id": "2", "title": "Noticia B", "source": "Medio B", "url": "https://news.google.com/b", "date": now},
        ]
        picks = radar.score_themes({t["name"]: rows}, ["Alzhéimer"], set())
        # El término sin tilde del feed se contrasta con las variantes en el radar.
        self.assertEqual(len(picks), 1)
        self.assertTrue(picks[0]["trends"])
        self.assertEqual(picks[0]["potential"], "ALTO")

    def test_escape_html_and_safety(self):
        self.assertEqual(radar.escape_html('<b>"hola"</b>'), '&lt;b&gt;&quot;hola&quot;&lt;/b&gt;')
        self.assertIsNone(radar.safe_url('http://example.com'))
        self.assertIsNone(radar.safe_url('https://name:pass@example.com/'))
        self.assertEqual(radar.safe_url('https://news.google.com/a'), 'https://news.google.com/a')


if __name__ == "__main__":
    unittest.main()
