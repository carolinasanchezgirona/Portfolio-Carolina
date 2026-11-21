import importlib.util
import unittest
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

path = Path(__file__).resolve().parent.parent / "scripts" / "savings-radar-telegram.py"
spec = importlib.util.spec_from_file_location("savings_radar", path)
radar = importlib.util.module_from_spec(spec)
spec.loader.exec_module(radar)

class SavingsRadarTests(unittest.TestCase):
    def test_rotation_and_annual_examples(self):
        self.assertEqual(radar.tip_for(date(2026, 11, 22))[0], "Suscripciones")
        self.assertEqual(radar.tip_for(date(2026, 11, 29))[0], "Compra con lista")
        self.assertIn("96 €/año", radar.render(date(2026, 11, 22), radar.tip_for(date(2026, 11, 22)), []))

    def test_html_security_and_length(self):
        message = radar.render(date(2026, 11, 22), radar.tip_for(date(2026, 11, 22)), [])
        self.assertLess(len(message), 3900)
        self.assertNotIn("TELEGRAM_CHAT_ID", message)
        self.assertFalse(radar.url_safe("http://example.com"))
        self.assertFalse(radar.url_safe("https://user:pw@example.com"))
        self.assertTrue(radar.url_safe("https://www.cnmc.es/"))

    def test_feed_requires_official_source_and_freshness(self):
        now = datetime.now(timezone.utc)
        fresh = now.strftime("%a, %d %b %Y %H:%M:%S GMT")
        stale = (now - timedelta(days=22)).strftime("%a, %d %b %Y %H:%M:%S GMT")
        rss = f"""<rss><channel>
          <item><source>CNMC</source><title>Nueva tarifa de energía - CNMC</title><link>https://news.google.com/a</link><pubDate>{fresh}</pubDate></item>
          <item><source>Anuncio</source><title>Descuento espectacular</title><link>https://news.google.com/b</link><pubDate>{fresh}</pubDate></item>
          <item><source>Banco de España</source><title>Consejos de ahorro antiguos</title><link>https://news.google.com/c</link><pubDate>{stale}</pubDate></item>
        </channel></rss>"""
        found = radar.news_from_rss(rss.encode(), now)
        self.assertEqual(len(found), 1)
        self.assertEqual(found[0]["title"], "Nueva tarifa de energía")

if __name__ == "__main__":
    unittest.main()
