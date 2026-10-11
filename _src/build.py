"""
Builds every HTML page of yangyeongju.com from _src/content.py.

    python _src/build.py

No extra packages needed (plain Python 3.8+).
Edit text in content.py, not in the generated .html files —
the next build overwrites them.
"""
import html
import json
import os
import struct
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from content import SITE, NAV, HOME, MEDIA, PAINTING, CV, CONTACT, ARCHIVE  # noqa: E402


def _year(item):
    digits = "".join(ch for ch in item.get("year", "") if ch.isdigit())[:4]
    return int(digits) if digits else 0


# newest first; works from the same year keep the order written in content.py
MEDIA = sorted(MEDIA, key=_year, reverse=True)
PAINTING = sorted(PAINTING, key=_year, reverse=True)

e = html.escape
URL = SITE["url"]


# ------------------------------------------------------------------ helpers
def webp_size(rel):
    """Width and height of a .webp file, read from its header (no Pillow needed)."""
    path = os.path.join(ROOT, rel)
    try:
        with open(path, "rb") as f:
            head = f.read(40)
    except OSError:
        print("  ! missing image:", rel)
        return None
    kind = head[12:16]
    if kind == b"VP8 ":
        w, h = struct.unpack("<HH", head[26:30])
        return w & 0x3FFF, h & 0x3FFF
    if kind == b"VP8L":
        b = head[21:25]
        w = 1 + (((b[1] & 0x3F) << 8) | b[0])
        h = 1 + (((b[3] & 0x0F) << 10) | (b[2] << 2) | ((b[1] & 0xC0) >> 6))
        return w, h
    if kind == b"VP8X":
        w = 1 + int.from_bytes(head[24:27], "little")
        h = 1 + int.from_bytes(head[27:30], "little")
        return w, h
    return None


def wh_attr(rel):
    s = webp_size(rel)
    return f' width="{s[0]}" height="{s[1]}"' if s else ""


def write(rel, text):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("  wrote", rel)


def strip_tags(s):
    out, skip = [], False
    for ch in s:
        if ch == "<":
            skip = True
        elif ch == ">":
            skip = False
        elif not skip:
            out.append(ch)
    return "".join(out)


# ------------------------------------------------------------------ shared parts
FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@300;400;500'
    '&family=Unbounded:wght@300;400&display=swap" rel="stylesheet">'
)


def head(title, desc, path, surface, depth, og=None, extra=""):
    r = "../" * depth
    og = og or URL + "/assets/img/site/og.jpg"
    theme = "#040506" if surface == "screen" else "#eceeec"
    return f"""<!DOCTYPE html>
<html lang="en" data-surface="{surface}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{URL}/{path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{e(SITE['name_en'])} {e(SITE['name_ko'])}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{URL}/{path}">
<meta property="og:image" content="{og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="{theme}">
<link rel="icon" type="image/png" sizes="32x32" href="{r}assets/img/site/favicon-32.png">
<link rel="apple-touch-icon" href="{r}assets/img/site/favicon-180.png">
{FONTS}
<link rel="stylesheet" href="{r}assets/css/site.css">
{extra}</head>
"""




def nav(current, depth):
    r = "../" * depth
    links = []
    for href, label in NAV:
        if href.startswith("http"):
            links.append(f'<a class="ext" href="{href}" target="_blank" rel="noopener noreferrer">{label}</a>')
        else:
            cur = ' aria-current="page"' if label == current else ""
            links.append(f'<a href="{r}{href}"{cur}>{label}</a>')
    joined = "\n    ".join(links)
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="site-nav">
  <a class="brand" href="{r or './'}"><span class="brand-en">{e(SITE['name_en'])}</span><span class="brand-ko" lang="ko">{e(SITE['name_ko'])}</span></a>
  <nav class="nav-links" aria-label="Main">
    {joined}
  </nav>
</header>
"""


def mail_link(addr, cls):
    user, domain = addr.split("@")
    return (f'<a class="{cls}" data-mail-user="{e(user)}" data-mail-domain="{e(domain)}" data-mail-fill '
            f'href="#">{e(user)} [at] {e(domain)}</a>')


def foot():
    return f"""<footer class="site-foot">
  <ul>
    <li>{mail_link(SITE['email'], 'text-link')}</li>
    <li><a class="text-link" href="{SITE['instagram']}" target="_blank" rel="noopener noreferrer">Instagram</a></li>
    <li><a class="text-link" href="{SITE['vimeo']}" target="_blank" rel="noopener noreferrer">Vimeo</a></li>
    <li><a class="text-link" href="{SITE['facebook']}" target="_blank" rel="noopener noreferrer">Facebook</a></li>
  </ul>
  <span class="muted">© {SITE['year']} {e(SITE['name_en'])} {e(SITE['name_ko'])}. All images and texts belong to the artist.</span>
</footer>
"""


def scripts(depth):
    r = "../" * depth
    return f'<script src="{r}assets/js/ink.js" defer></script>\n<script src="{r}assets/js/site.js" defer></script>\n'


def page_end(depth):
    return foot() + scripts(depth) + "</body>\n</html>\n"


def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False) + "</script>\n"


# ------------------------------------------------------------------ home
def build_home():
    person = {
        "@context": "https://schema.org", "@type": "Person",
        "name": SITE["name_en"], "alternateName": SITE["other_names"],
        "url": URL + "/", "image": URL + "/assets/img/site/og.jpg",
        "jobTitle": SITE["role"],
        "knowsAbout": ["desire research", "trans-action", "media art", "painting"],
        "homeLocation": {"@type": "Place", "name": SITE["based_in"]},
        "sameAs": [SITE["instagram"], SITE["facebook"], SITE["vimeo"],
                   "https://www.isea-symposium-archives.org/art-events/transaction-of-desires-by-yeongju-yang/"],
    }
    desc = f"{SITE['name_en']} ({SITE['name_ko']}) — " + strip_tags(HOME["intro"])
    lead = ' class="lead"'
    stanzas = "\n".join(
        "      <p" + (lead if i == 0 else "") + ">" + s + "</p>" for i, s in enumerate(HOME["statement"])
    )
    now = ""
    if HOME["now"]:
        now = f'<p class="hero-now"><span>{e(HOME["now_label"])}</span>{HOME["now"]}</p>'
    if HOME.get("upcoming"):
        now += f'\n      <p class="hero-now"><span>{e(HOME["upcoming_label"])}</span>{HOME["upcoming"]}</p>'
    years = sorted({w["year"] for w in MEDIA})
    span = years[0] + ("–" + years[-1] if len(years) > 1 else "")
    out = head(f"{SITE['name_en']} {SITE['name_ko']} — {SITE['role'].lower()}", desc, "", "paper", 0, extra=ld(person))
    out += "<body data-ink-intro>\n" + nav("", 0) + f"""<main id="main">
  <section class="hero wrap">
    <h1 class="hero-title display"><span>{HOME['title_line_1']}</span><span class="l2">{HOME['title_line_2']}</span></h1>
    <div class="hero-text">
      <p class="hero-intro">{HOME['intro']}</p>
      {now}
    </div>
    <figure class="hero-figure">
      <video autoplay muted loop playsinline poster="assets/img/site/hero-poster.webp" aria-label="{e(HOME['hero_alt'])}">
        <source src="assets/img/site/hero.mp4" type="video/mp4">
      </video>
    </figure>
    <p class="hero-hint"><span class="hint-mouse">{HOME['hint_mouse']}</span><span class="hint-touch">{HOME['hint_touch']}</span></p>
  </section>

  <section class="statement wrap" aria-labelledby="st">
    <h2 id="st">{HOME['statement_heading']}</h2>
    <div class="statement-body">
{stanzas}
    </div>
  </section>

  <section class="doors" aria-label="Bodies of work">
    <a class="door door--screen" href="works/index.html#media" data-cursor="Enter">
      <img src="{HOME['door_media_image']}" alt="" loading="lazy" decoding="async">
      <span class="door-count">{len(MEDIA)} works, {span}</span>
      <div><h3>{HOME['door_media_title']}</h3><p>{HOME['door_media_text']}</p></div>
    </a>
    <a class="door door--paper" href="works/index.html#painting" data-cursor="Enter">
      <img src="{HOME['door_painting_image']}" alt="" loading="lazy" decoding="async">
      <span class="door-count">{len(PAINTING)} works</span>
      <div><h3>{HOME['door_painting_title']}</h3><p>{HOME['door_painting_text']}</p></div>
    </a>
  </section>
</main>
""" + page_end(0)
    write("index.html", out)


# ------------------------------------------------------------------ portfolio
TAB_LINE = ('<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">'
            '<path pathLength="1" d="M2 7 C 40 3, 80 10, 120 6 S 180 4, 198 7"/></svg>')


def build_portfolio():
    rows = []
    for w in MEDIA:
        thumb = f"../assets/img/media/{w['slug']}/01-s.webp"
        rows.append(f"""      <li class="work-row">
        <a href="{w['slug']}.html" data-preview="{thumb}" data-cursor="View">
          <img class="thumb" src="{thumb}" alt="" loading="lazy" decoding="async">
          <span class="yr">{w['year']}</span>
          <span class="ttl">{e(w['title'])}</span>
          <span class="info"><b>{e(w['type'].split(',')[0])}</b>{e(w['list_venue'])}</span>
        </a>
      </li>""")
    items = []
    for p in PAINTING:
        meta = ", ".join(x for x in (p["year"], p["medium"], p.get("size", "")) if x)
        first = p["images"][0][0]
        views = "|".join(f"../assets/img/painting/{f}.webp" for f, _ in p["images"])
        labels = "|".join(label for _, label in p["images"])
        size = webp_size(f"assets/img/painting/{first}-s.webp") or (4, 3)
        ratio = round(size[0] / size[1], 3)
        items.append(f"""      <figure class="paint-item" style="--r:{ratio}">
        <button type="button" data-views="{e(views)}" data-labels="{e(labels)}" data-title="{e(p['title'])}" data-meta="{e(meta)}" data-cursor="Open">
          <img src="../assets/img/painting/{first}-s.webp" alt="{e(p['title'])}, painting by {e(SITE['name_en'])}"{wh_attr(f'assets/img/painting/{first}-s.webp')} loading="lazy" decoding="async">
          <figcaption class="cap"><span>{e(p['title'])}</span><span>{e(p['year'])}</span></figcaption>
        </button>
      </figure>""")
    names = ", ".join(w["title"] for w in MEDIA[:4])
    out = head(f"Portfolio — {SITE['name_en']} {SITE['name_ko']}",
               f"Media art and painting by {SITE['name_en']} ({SITE['name_ko']}): {names} and more.",
               "works/", "screen", 1)
    out += "<body>\n" + nav("Portfolio", 1) + f"""<main id="main" class="wrap">
  <header class="page-head">
    <h1 class="display">Portfolio</h1>
    <div class="tabs" role="tablist" aria-label="Body of work">
      <button class="tab" role="tab" id="tab-media" aria-controls="media" aria-selected="true">{HOME['door_media_title']}<sup>{len(MEDIA)}</sup>{TAB_LINE}</button>
      <button class="tab" role="tab" id="tab-painting" aria-controls="painting" aria-selected="false" tabindex="-1">{HOME['door_painting_title']}<sup>{len(PAINTING)}</sup>{TAB_LINE}</button>
    </div>
  </header>

  <section class="panel" id="media" role="tabpanel" aria-labelledby="tab-media" data-surface="screen">
    <ol class="work-list">
{chr(10).join(rows)}
    </ol>
  </section>

  <section class="panel" id="painting" role="tabpanel" aria-labelledby="tab-painting" data-surface="paper" hidden>
    <div class="paint-grid">
{chr(10).join(items)}
    </div>
  </section>
</main>
<div class="preview" aria-hidden="true"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt=""></div>
<dialog class="lightbox" aria-label="Painting viewer">
  <button class="lb-close" type="button">Close</button>
  <div class="lb-stage"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt=""></div>
  <div class="lb-bar">
    <div><span class="lb-title"></span> <span class="lb-meta muted"></span> <span class="lb-label"></span></div>
    <div class="lb-ctrl"><button class="lb-prev" type="button">Previous</button><button class="lb-next" type="button">Next</button></div>
  </div>
</dialog>
""" + page_end(1)
    write("works/index.html", out)


# ------------------------------------------------------------------ work pages
def gallery(slug, title):
    figs, k = [], 2
    while True:
        rel = f"assets/img/media/{slug}/{k:02d}.webp"
        if not os.path.exists(os.path.join(ROOT, rel)):
            break
        size = webp_size(rel)
        cls = ""
        if size:
            w, h = size
            cls = "wide" if (w / h > 1.2 and w >= 1100) else ("small" if w < 900 else "")
        figs.append([cls, f'<img src="../{rel}" alt="{e(title)}, view {k}"{wh_attr(rel)} loading="lazy" decoding="async">'])
        k += 1
    halves = [i for i, f in enumerate(figs) if f[0] != "wide"]
    if len(halves) % 2 == 1:
        figs[halves[-1]][0] = "solo"
    return "\n".join(f'      <figure class="{c}">{img}</figure>' for c, img in figs)


def build_work(i, w):
    slug, nxt = w["slug"], MEDIA[(i + 1) % len(MEDIA)]
    shown = "".join(f"<dd>{e(a)}, {b}</dd>" for a, b in w["shown"])
    facts = f"<div><dt>Shown at</dt>{shown}</div><div><dt>Materials</dt><dd>{e(w['materials'])}</dd></div>"
    if w["with"]:
        facts += f"<div><dt>In collaboration with</dt><dd>{e(w['with'])}</dd></div>"
    links = "".join(f'<a class="text-link" href="{u}" target="_blank" rel="noopener noreferrer">{e(t)}</a>' for t, u in w["links"])
    links_html = f'<div class="work-links">{links}</div>' if links else ""
    note = f'<p class="note">{w["note"]}</p>' if w["note"] else ""
    cover = f"assets/img/media/{slug}/01.webp"
    art = {"@context": "https://schema.org", "@type": "VisualArtwork", "name": w["title"], "dateCreated": w["year"],
           "artform": w["type"].split(",")[0],
           "creator": {"@type": "Person", "name": SITE["name_en"], "alternateName": SITE["name_ko"], "url": URL + "/"},
           "image": f"{URL}/{cover}", "description": w["summary"]}
    if w["note"]:
        art["alternateName"] = strip_tags(w["note"]).split("title ")[-1].rstrip(".")
    body = "\n".join(f"      <p>{p}</p>" for p in w["body"])
    out = head(f"{w['title']} ({w['year']}) — {SITE['name_en']} {SITE['name_ko']}", w["summary"],
               f"works/{slug}.html", "screen", 1, og=f"{URL}/{cover}", extra=ld(art))
    out += "<body>\n" + nav("Portfolio", 1) + f"""<main id="main">
  <header class="work-head wrap">
    <a class="back" href="index.html#media">Back to portfolio</a>
    <h1 class="display">{e(w['title'])}</h1>
    <p class="sub">{e(w['type'])}, {w['year']}</p>
    {note}
    <dl class="facts">{facts}</dl>
  </header>
  <figure class="work-cover"><img src="../{cover}" alt="{e(w['title'])}, main view"{wh_attr(cover)} fetchpriority="high" decoding="async"></figure>
  <section class="work-body wrap">
    <div class="copy">
{body}
      {links_html}
    </div>
  </section>
  <section class="gallery wrap" aria-label="Views of the work">
{gallery(slug, w['title'])}
  </section>
  <div class="wrap">
    <a class="next-work" href="{nxt['slug']}.html"><span>Next work</span><strong>{e(nxt['title'])}</strong></a>
  </div>
</main>
""" + page_end(1)
    write(f"works/{slug}.html", out)


# ------------------------------------------------------------------ cv
def build_cv():
    secs = []
    for name, entries in CV["sections"]:
        lis = "\n".join(f'      <li><span class="yr">{y}</span><span>{t}</span></li>' for show, y, t in entries if show)
        if lis:
            secs.append(f'  <section class="cv-section" aria-label="{e(name)}">\n    <h2>{e(name)}</h2>\n'
                        f'    <ol class="cv-list" reversed>\n{lis}\n    </ol>\n  </section>\n')
    note = f'<p class="cv-note muted">{CV["note"]}</p>' if CV["note"] else ""
    out = head(f"CV — {SITE['name_en']} {SITE['name_ko']}",
               f"Selected exhibitions, projects and publications of {SITE['name_en']} ({SITE['name_ko']}), {SITE['role'].lower()}.",
               "cv.html", "paper", 0)
    out += "<body>\n" + nav("CV", 0) + f"""<main id="main" class="wrap">
  <header class="page-head">
    <h1 class="display">CV</h1>
    <p class="cv-intro">{CV['intro']}</p>
    {note}
  </header>
{''.join(secs)}</main>
""" + page_end(0)
    write("cv.html", out)


# ------------------------------------------------------------------ contact
def build_contact():
    c = CONTACT
    out = head(f"Contact — {SITE['name_en']} {SITE['name_ko']}",
               f"Contact {SITE['name_en']} ({SITE['name_ko']}), {SITE['role'].lower()} based in {SITE['based_in']}, for exhibitions, commissions and collaborations.",
               "contact.html", "paper", 0)
    out += "<body>\n" + nav("Contact", 0) + f"""<main id="main" class="wrap">
  <header class="page-head"><h1 class="display">Contact</h1></header>
  <section class="contact">
    <ul class="contact-list">
      <li><span class="k">{c['label_email']}</span>{mail_link(SITE['email'], 'v')}</li>
      <li><span class="k">{c['label_lab']}</span>{mail_link(SITE['email_lab'], 'v')}</li>
      <li><span class="k">{c['label_dm']}</span><a class="v" href="{SITE['instagram']}" target="_blank" rel="noopener noreferrer">{e(SITE['instagram_handle'])}</a></li>
      <li><span class="k">{c['label_based']}</span><span class="v">{e(SITE['based_in'])}</span></li>
    </ul>
    <figure class="contact-figure"><img src="assets/img/site/heads-s.webp" alt=""{wh_attr('assets/img/site/heads-s.webp')} loading="lazy" decoding="async"></figure>
  </section>
</main>
""" + page_end(0)
    write("contact.html", out)


# ------------------------------------------------------------------ archive
def build_archive():
    a = ARCHIVE
    with open(os.path.join(HERE, "archive.js"), encoding="utf-8") as f:
        js = f.read()
    out = head(f"{a['title']} — {SITE['name_en']} {SITE['name_ko']}",
               f"{a['title']}: an ongoing participatory archive of desires by {SITE['name_en']} ({SITE['name_ko']}).",
               "archive.html", "screen", 0)
    out += "<body>\n" + nav("Archive", 0) + f"""<main id="main">
  <section class="wish">
    <div>
      <h1 class="display">{e(a['title'])}</h1>
      <img src="assets/img/site/wishtower.webp" alt="A pagoda made of tiny written wishes"{wh_attr('assets/img/site/wishtower.webp')}>
      <form class="wish-form" id="wish-form" autocomplete="off">
        <label class="sr-only" for="text-input">{e(a['question'])}</label>
        <input type="text" id="text-input" maxlength="120" placeholder="{e(a['question'])}" lang="ko">
        <button id="add-button" type="submit">{e(a['button'])}</button>
      </form>
      <p class="wish-status" id="wish-status" role="status" data-empty="{e(a['empty'])}" data-saved="{e(a['saved'])}" data-error="{e(a['error'])}"></p>
      <p>{a['caption']}</p>
    </div>
  </section>
</main>
<div id="floating-text-container" aria-hidden="true"></div>
<script type="module">
{js}</script>
""" + scripts(0) + "</body>\n</html>\n"
    write("archive.html", out)


# ------------------------------------------------------------------ redirects, 404, sitemap
REDIRECTS = {
    # old address : new address   (keeps links people already shared working)
    "portfolio_manu.html": "works/index.html#media",
    "portfolio.html": "works/index.html#media",
    "artwork_list/transaction_of_desires.html": "works/transactions-of-desire.html",
    "artwork_list/Fragments of Desire_MutatingObjects.html": "works/fragments-of-desire.html",
    "artwork_list/Fragments of Desire_MutatingObjects.html.html": "works/fragments-of-desire.html",
    "artwork_list/infected desires.html": "works/infected-desires.html",
    "artwork_list/Flow_and _Shield.html": "works/flow-and-shield.html",
    "artwork_list/Viruses_and_Their_Desires.html": "works/viruses-and-their-desires.html",
}


def build_redirects():
    for old, new in REDIRECTS.items():
        target = "../" * old.count("/") + new
        write(old, f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Moved</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="{URL}/{new.split('#')[0]}">
<meta http-equiv="refresh" content="0; url={target}">
<script>location.replace({json.dumps(target)});</script>
</head><body><p>This page has moved: <a href="{target}">{e(new)}</a></p></body></html>
""")


def build_404():
    out = head(f"Not found — {SITE['name_en']} {SITE['name_ko']}", "Page not found.", "404.html", "paper", 0)
    out = out.replace('href="assets/', 'href="/assets/')
    navhtml = nav("", 0).replace('href="', 'href="/').replace('href="/https', 'href="https').replace('href="/#', 'href="#')
    out += "<body>\n" + navhtml + """<main id="main" class="wrap">
  <header class="page-head"><h1 class="display">This page has dissolved.</h1>
  <p class="cv-intro">The address may have changed when the site was reorganised. Go to the <a class="text-link" href="/works/index.html">portfolio</a> or the <a class="text-link" href="/">home page</a>.</p></header>
</main>
<script src="/assets/js/ink.js" defer></script>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
"""
    write("404.html", out)


def build_sitemap():
    urls = ["", "works/", "cv.html", "contact.html", "archive.html"] + [f"works/{w['slug']}.html" for w in MEDIA]
    write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
          + "".join(f"  <url><loc>{URL}/{u}</loc></url>\n" for u in urls) + "</urlset>\n")
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {URL}/sitemap.xml\n")


if __name__ == "__main__":
    print("Building", ROOT)
    build_home()
    build_portfolio()
    for i, w in enumerate(MEDIA):
        build_work(i, w)
    build_cv()
    build_contact()
    build_archive()
    build_redirects()
    build_404()
    build_sitemap()
    print("Done.")
