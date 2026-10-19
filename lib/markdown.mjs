// The guide renderer for app/. A deliberate subset of Markdown: the constructs the
// guides in guides/ and docs/ actually use, and nothing else. It is not a Markdown
// implementation and should not grow into one.
//
// Copied from the old app's mdToHtml (index.html) when app/ was started, with two
// additions: headings get ids, so a matchup card can link to its section, and links
// to another guide's .md open that guide in the app. When the old app is retired this
// is the only copy.

export const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// "Irelia, Blade Dancer — Calm/Chaos · LA finalist" -> "irelia-blade-dancer-calm-chaos-la-finalist"
export const slugify = (s) => String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .replace(/[*`_]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Escape first, so the source can never inject markup, then let the few marks back in.
export function mdInline(src, linkFor = null) {
  let h = esc(src);
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/\*\*([^\n]+?)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/(^|[\s(—-])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => {
    if (/^https?:\/\//.test(u)) return `<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
    const local = linkFor && linkFor(u.replace(/&amp;/g, "&"));
    return local ? `<a href="${esc(local)}">${t}</a>` : t;
  });
  return h;
}

const cells = (row) => row.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

export function mdToHtml(src, { linkFor = null } = {}) {
  const lines = src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").split(/\r?\n/);
  const out = [];
  const ids = new Set();
  let i = 0, para = [], list = null;
  const inl = (s) => mdInline(s, linkFor);
  const flushPara = () => { if (para.length) { out.push(`<p>${inl(para.join(" "))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  const flush = () => { flushPara(); flushList(); };

  while (i < lines.length) {
    const ln = lines[i];
    if (!ln.trim()) { flush(); i++; continue; }

    if (/^```/.test(ln)) {
      flush();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre>${esc(buf.join("\n"))}</pre>`);
      continue;
    }

    if (/^-{3,}\s*$/.test(ln)) { flush(); out.push("<hr>"); i++; continue; }

    const h = /^(#{1,4})\s+(.*)$/.exec(ln);
    if (h) {
      flush();
      const lvl = Math.max(2, h[1].length);
      let id = slugify(h[2]), n = 2;
      while (ids.has(id)) id = `${slugify(h[2])}-${n++}`;
      ids.add(id);
      out.push(`<h${lvl} id="${id}">${inl(h[2])}</h${lvl}>`);
      i++; continue;
    }

    if (ln.includes("|") && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1] || "")) {
      flush();
      const head = cells(ln);
      i += 2;
      const body = [];
      while (i < lines.length && lines[i].includes("|")) { body.push(cells(lines[i])); i++; }
      out.push(`<div class="tablewrap"><table><thead><tr>${head.map((c) => `<th>${inl(c)}</th>`).join("")}</tr></thead>` +
        `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inl(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    if (/^>\s?/.test(ln)) {
      flush();
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
      const items = q.filter((l) => /^[-*]\s+/.test(l));
      const lead = q.filter((l) => !/^[-*]\s+/.test(l));
      out.push(`<blockquote>${lead.map((l) => (l.trim() ? inl(l) : "")).join("<br>")}` +
        (items.length ? `<ul>${items.map((l) => `<li>${inl(l.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : "") + `</blockquote>`);
      continue;
    }

    const li = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(ln);
    if (li) {
      flushPara();
      const want = /^\d/.test(li[2]) ? "ol" : "ul";
      if (list !== want) { flushList(); out.push(`<${want}>`); list = want; }
      const item = [li[3]];
      i++;
      while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s/.test(lines[i])) { item.push(lines[i].trim()); i++; }
      out.push(`<li>${inl(item.join(" "))}</li>`);
      continue;
    }

    para.push(ln.trim());
    i++;
  }
  flush();
  return out.join("\n");
}
