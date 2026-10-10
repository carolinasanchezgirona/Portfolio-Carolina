export type VisualBlock = {
  type: "image" | "table" | "chart" | "diagram" | "calendar";
  title: string;
  content?: string;
  alt?: string;
  data?: string;
};

const TYPES = new Set(["image", "table", "chart", "diagram", "calendar"]);

export function normalizeVisualBlocks(value: unknown): VisualBlock[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 14).flatMap((value): VisualBlock[] => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const obj = value as Record<string, unknown>;
    const type = String(obj.type ?? "");
    if (!TYPES.has(type)) return [];
    const title = String(obj.title ?? "").trim().slice(0, 140);
    const content = String(obj.content ?? "").trim().slice(0, 2500);
    const alt = String(obj.alt ?? "").trim().slice(0, 400);
    const data = String(obj.data ?? "");
    if (!title) return [];
    if (type === "image") {
      const safeData = /^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(data) && data.length <= 650000;
      return safeData && alt ? [{ type: "image", title, data, alt }] : [];
    }
    return content ? [{ type: type as VisualBlock["type"], title, content }] : [];
  });
}

export function matrix(block: VisualBlock): string[][] {
  return (block.content || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean).slice(0, 13)
    .map(line => line.split("|").map(x => x.trim().slice(0, 100)));
}

export function getCalendar(raw: string) {
  const lines = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const match = /^(\d{4})-(\d{2})$/.exec(lines[0] || "");
  if (!match) return null;
  const year = Number(match[1]), month = Number(match[2]);
  if (year < 1900 || year > 2100 || month < 1 || month > 12) return null;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const events = new Map<number, string>();
  for (const line of lines.slice(1, 24)) {
    const [dayText, ...parts] = line.split("|");
    const day = Number(dayText);
    if (Number.isInteger(day) && day >= 1 && day <= days && parts.length) {
      events.set(day, parts.join("|").trim().slice(0, 60));
    }
  }
  return { year, month, days, offset, events };
}

export function visualHtml(raw: unknown, escapeHtml: (value: unknown) => string, inline = false) {
  const blocks = normalizeVisualBlocks(raw);
  if (!blocks.length) return "";
  const items = blocks.map(block => {
    let content = "";
    if (block.type === "image" && block.data) {
      content = '<figure><img src="' + escapeHtml(block.data) + '" alt="' + escapeHtml(block.alt) + '" loading="lazy"><figcaption>' + escapeHtml(block.alt) + '</figcaption></figure>';
    }
    if (block.type === "table") {
      const rows = matrix(block);
      const columns = rows[0]?.length || 0;
      if (columns >= 2 && columns <= 6 && rows.length >= 2 && rows.every(row => row.length === columns)) {
        content = '<div class="visual-scroll"><table><thead><tr>' + rows[0].map(v => '<th scope="col">' + escapeHtml(v) + '</th>').join("") + '</tr></thead><tbody>' + rows.slice(1).map(row => "<tr>" + row.map(v => "<td>" + escapeHtml(v) + "</td>").join("") + "</tr>").join("") + '</tbody></table></div>';
      }
    }
    if (block.type === "chart") {
      const pairs = matrix(block).filter(row => row.length === 2 && row[0] && Number.isFinite(Number(row[1])) && Number(row[1]) >= 0 && Number(row[1]) <= 10000).slice(0, 8);
      const max = Math.max(1, ...pairs.map(row => Number(row[1])));
      content = '<div class="visual-chart">' + pairs.map(row => {
        const width = Math.round(Number(row[1]) / max * 100);
        return '<div class="visual-bar"><span>' + escapeHtml(row[0]) + '</span><div><i style="width:' + width + '%"></i></div><strong>' + escapeHtml(row[1]) + '</strong></div>';
      }).join("") + "</div>";
    }
    if (block.type === "diagram") {
      content = "<ol class=\"visual-steps\">" + (block.content || "").split(/\r?\n/).filter(Boolean).slice(0, 8).map(item => "<li>" + escapeHtml(item) + "</li>").join("") + "</ol>";
    }
    if (block.type === "calendar") {
      const cal = getCalendar(block.content || "");
      if (cal) {
        const count = Math.ceil((cal.offset + cal.days) / 7) * 7;
        const cells = Array.from({ length: count }, (_, i) => {
          const day = i - cal.offset + 1;
          return day < 1 || day > cal.days ? "<td></td>" : "<td><strong>" + day + "</strong>" + (cal.events.has(day) ? "<small>" + escapeHtml(cal.events.get(day)) + "</small>" : "") + "</td>";
        });
        const weeks = Array.from({length: count / 7}, (_,i) => "<tr>" + cells.slice(i*7,i*7+7).join("") + "</tr>").join("");
        content = '<div class="visual-scroll"><table class="visual-calendar"><thead><tr>' + ["L","M","X","J","V","S","D"].map(d => "<th>" + d + "</th>").join("") + "</tr></thead><tbody>" + weeks + "</tbody></table></div>";
      }
    }
    return content ? '<article class="visual-item"><h3>' + escapeHtml(block.title) + "</h3>" + content + "</article>" : "";
  }).join("");
  return !items ? "" : inline ? '<div class="exercise-inline-visual">' + items + "</div>" : '<section class="section visual-resources"><h2>Recursos visuales</h2>' + items + "</section>";
}
