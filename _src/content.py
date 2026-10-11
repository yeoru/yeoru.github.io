# =====================================================================
#  yangyeongju.com — 사이트의 모든 글자와 작품 정보
#
#  이 파일만 고치고, 저장소 폴더에서 아래 명령을 실행하면
#  모든 HTML 페이지가 다시 만들어집니다.
#
#      python _src/build.py
#
#  규칙
#  - 글자는 따옴표 "..." 안에서만 고칩니다. 쉼표(,)와 괄호는 지우지 마세요.
#  - 기울임은 <i>제목</i>, 굵게는 <b>이름</b> 처럼 HTML 태그를 그대로 쓸 수 있습니다.
#  - 줄 앞의 # 는 설명(주석)이라 사이트에 나오지 않습니다.
#  - "_src" 폴더는 밑줄로 시작해서 GitHub Pages 에 공개되지 않습니다.
# =====================================================================

SITE = {
    "url": "https://yangyeongju.com",
    "name_en": "Yeongju Yang",
    "name_ko": "양영주",
    # 검색엔진에 '같은 사람'이라고 알려 주는 다른 표기들
    "other_names": ["양영주", "Yang Yeongju", "Yang YeongJu"],
    "role": "Painter and media artist",
    "based_in": "Seoul, South Korea",
    "email": "yeongju.yvonne@gmail.com",
    "email_lab": "transaction.artlab@gmail.com",
    "lab_name": "Trans-action Art Lab",
    "instagram": "https://www.instagram.com/yang_yeong/",
    "instagram_handle": "@yang_yeong",
    "facebook": "https://www.facebook.com/0Yangyeong",
    "vimeo": "https://vimeo.com/user72799161",
    "blog": "https://quasar-spatula-6e6.notion.site/CHAOSMOS-WORK_LY-NOTE-02afb47158824e898ce5d19620dcc407",
    "year": 2026,   # 맨 아래 © 연도
}

# ---------------------------------------------------------------------
#  메뉴 (위에서부터 순서대로 표시)
#  ("주소", "이름") — 숨기려면 줄 앞에 # 를 붙이면 됩니다. 페이지 파일은 그대로 남아요.
# ---------------------------------------------------------------------
NAV = [
    ("cv.html", "CV"),
    ("works/index.html", "Portfolio"),
    # ("archive.html", "Archive"),      # 잠시 숨김 — Wish Tower 페이지는 그대로 있어요
    ("wish_water.html", "Wish Water"),
    (SITE["blog"], "Blog"),
    ("contact.html", "Contact"),
]

# ---------------------------------------------------------------------
#  HOME
# ---------------------------------------------------------------------
HOME = {
    "title_line_1": "Hello",
    "title_line_2": "chaosmos.",
    # 첫 화면 소개 문장 (가장 많이 읽히는 한 문장)
    "intro": "Yeongju Yang is a painter and media artist researching desire and <i>trans-action</i>: the energy that passes between humans, technology and the environment, and changes each of them on the way.",
    # 지금 하고 있는 연구 한 줄 (비우려면 "" 로)
    # 첫 화면 전시 안내 두 줄 (비우려면 "" 로)
    "now_label": "Now",
    "now": "“Silver Egg: The Eros of Media Art”, ZKM, Karlsruhe, until 21 February 2027.",
    "upcoming_label": "Upcoming",
    "upcoming": "“Human Becoming”, Shinbuldang Art Center, Cheonan, 5–14 December 2026.",
    "hint_mouse": "Move to leave ink. Click to press a stamp.",
    "hint_touch": "Drag to leave ink. Tap to press a stamp.",
    "hero_alt": "An ink painting slowly turning into a head",
    "statement_heading": "Statement",
    # 스테이트먼트: 연(stanza)마다 하나의 "..." , 줄바꿈은 <br>
    "statement": [
        "Through painting and media-based practice,<br>I express the invisible flows of energy that arise from interactions between organic and digital systems.<br>Inspired by cybernetics, posthumanism, and the life sciences,<br>I visualize energy in abstract, fluid forms.",
        "We no longer simply consume information—<br>we generate it, replicate it, mutate it.<br>Desire, too, is no longer a private, silent thing.<br>It is broadcast, amplified, accelerated by systems we created and can no longer fully control.",
        "I’ve been exploring <i>chaosmos</i> through painting since 2017.<br>In 2023, this project began with a question:<br>Where does desire come from?<br>And how does it transform when it spreads—like a virus—across networks of people and media?",
        "I was drawn to the behavior of viruses:<br>their capacity to mutate, to resist, to pass invisibly from one host to another.<br>I wondered whether desire behaves the same way—changing shape as it travels,<br>always contagious, never still.",
        "To express this, I turned to both analog and digital materials.<br>With analog stamps, I explored how repetition can contain variation.<br>Even with the same stamp, no two impressions are identical.<br>Each mark holds a mutation, however slight.<br>And in that imperfection, I saw the texture of desire.",
        # TODO: 이 연은 앞부분이 빠져 있어요 ("and AI, became ..."). 원래 문장으로 고쳐 주세요.
        "and AI, became a space of retranslation.<br>It doesn’t merely copy analog forms—it absorbs their logic, distorts them, reimagines them.<br>The outputs are not simulations, but hybrids—<br>somewhere between memory and machine,<br>between the bodily and the coded.",
        "I believe this in-between space—where analog textures and digital systems collide—<br>is where something new emerges.<br>Not reproduction, but transformation.<br>Not repetition, but entropy made visible.",
        "Desire, like gravity or atoms, is unseen.<br>But it moves us.<br>It binds people, drives choices, alters systems.<br>It is smaller than language, but larger than logic.",
        "Lately I sort desire into sixteen types,<br>then mix them to see which new desires appear.<br>And I am exploring a new question:<br>technology has made the resolution of our screens ever higher.<br>In which direction, then, is human resolution moving?<br>How are our senses and our desires working now?",
        "And so I continue to follow it.<br>Not to define it,<br>but to observe its traces—<br>in form, in media,<br>in what we click, in what we choose,<br>and in what remains unseen.",
    ],
    "door_media_title": "Media art",
    "door_media_text": "Interactive installations, video and narrative systems that follow desire as a viral force.",
    "door_media_image": "assets/img/media/transactions-of-desire/01.webp",
    "door_painting_title": "Painting & Print",
    "door_painting_text": "Where the chaosmos began: paintings on canvas and digital prints.",
    "door_painting_image": "assets/img/painting/projections-1-s.webp",
}

# ---------------------------------------------------------------------
#  MEDIA ART  (위에서부터 순서대로 표시)
#  slug  = 파일 이름 (works/<slug>.html, 이미지 폴더 assets/img/media/<slug>/)
#  이미지: 01.webp 가 대표 이미지, 02.webp 부터 아래 갤러리
# ---------------------------------------------------------------------
MEDIA = [
    {
        "slug": "transactions-of-desire",
        "title": "Transactions of Desire",
        "note": "Shown at ISEA2025 under the title <i>Transaction of Desires</i>.",
        "year": "2025",
        "type": "Interactive installation",
        "list_venue": "ZKM, Karlsruhe · ISEA2025, Seoul",
        "shown": [
            ("“Silver Egg: The Eros of Media Art”, ZKM, Karlsruhe", "2026–2027"),
            ("ISEA2025 “Dong-Dong: Creator’s Universe”, Seoul Arts Center, Seoul", "2025.05"),
        ],
        "materials": "PC, monitor, projection, pedestal, live image generation and screening, interpretation card, 2-channel sound, variable dimensions",
        "with": "Philip Liu (sound)",
        "links": [("View on the ISEA archive", "https://www.isea-symposium-archives.org/art-events/transaction-of-desires-by-yeongju-yang/")],
        "summary": "An interactive installation in which audience input is classified into 16 categories of desire and visualised as mutating images and sound.",
        "body": [
            "<i>Transactions of Desire</i> is an interactive installation that explores desire as a viral and mutating force. The work combines analog stamp-based painting with digital retranslation, creating hybrid images that shift between physical textures and machine logic.",
            "In real time, audience input is processed through the YangYeong model, classifying it into 16 categories of desire using natural language processing. The results are instantly visualised as dynamic images and sounds, while a live YouTube API connection integrates streaming data, amplifying the collective ecosystem of desires.",
            "The installation turns the exhibition space into a living field where personal impulses spread, transform, and collide with others.",
        ],
    },
    {
        "slug": "fragments-of-desire",
        "title": "Fragments of Desire: Mutating Objects",
        "note": "",
        "year": "2025",
        "type": "Video art, 1080×1920, 3:03",
        "list_venue": "Grand Palais Immersif, Paris",
        "shown": [("“Artificial Dreams II: Visions of the Future”, Grand Palais Immersif, Paris", "2025.06")],
        "materials": "Single-channel video, AI-generated music, dance performance",
        "with": "",
        "links": [("Watch a preview", "https://www.facebook.com/reel/1454835032210865")],
        "summary": "A video work in which stamp-art imagery, generated through a proprietary AI model, mutates with metadata harvested from YouTube.",
        "body": [
            "<i>Fragments of Desire: Mutating Objects</i> is a video art piece exploring the evolution of desire within digital networks. By synthesising stamp art imagery—generated through a proprietary AI model—with metadata harvested from YouTube, the work presents mutating visual forms that rhythmically traverse the boundary between organic memory and machine logic.",
            "In this work, mutated viral fragments born of generative algorithms transform evolving digital traces into fluid, quasi-biological structures. The continuous reconstruction of imagery, interspersed with fragments of text, visualises how desire fragments and evolves amidst the landscapes of late capitalism and posthumanism.",
            "Conceived in 2025—at a time of soaring AI stocks and a burgeoning sense of diminished human agency—this video work pairs AI-generated music with an immersive dance performance. It poses an intuitive inquiry into desire: a contagious, ever-shifting force existing between the bodily and the coded, a power that ultimately transcends the scale of the individual.",
        ],
    },
    {
        "slug": "infected-desires",
        "title": "Infected Desires",
        "note": "",
        "year": "2024",
        "type": "Interactive installation",
        "list_venue": "Artience Daejeon × KRIBB",
        "shown": [("Artience Daejeon 2024, Daejeon Culture and Arts Foundation × KRIBB, Daejeon", "2024.10")],
        "materials": "PC, monitors, pedestal, live image generation and screening, interpretation card, sound, variable dimensions",
        "with": "Dr. Jihyun Yang, Dr. Doojin Kim (KRIBB)",
        "links": [("Watch the exhibition video", "https://vimeo.com/1203966170")],
        "summary": "Visitors choose a desire from fictional news articles written with virologists; it becomes a live-generated entity moving through an artificial immune system.",
        "body": [
            "<i>Infected Desires</i> is an interactive installation that explores desire as a viral force spreading through media environments, digital networks, and collective imagination.",
            "Based on fictional news articles developed with virology researchers, participants select a desire from article-like thumbnails. The selected desire is transformed through a live image-generation process and projected as a new visual entity.",
            "These entities move through a dynamic field resembling an artificial immune system, continuously seeking new paths of transmission.",
        ],
    },
    {
        "slug": "flow-and-shield",
        "title": "Flow and Shield",
        "note": "",
        "year": "2024",
        "type": "Interactive installation",
        "list_venue": "Artience Daejeon × KRIBB",
        "shown": [("Artience Daejeon 2024, Daejeon Culture and Arts Foundation × KRIBB, Daejeon", "2024.10")],
        "materials": "PC, projector, Kinect sensor, rotating wooden installation, live screening, sound, variable dimensions",
        "with": "Hyun Seung-cheol (technology), Philip Liu (sound), BAUMHAND (woodwork)",
        "links": [("Watch the exhibition video", "https://vimeo.com/1204126972/eba7fad0c5")],
        "summary": "Visitors push and pull a rotating wooden structure to generate, protect or release virus-like digital forms in real time.",
        "body": [
            "<i>Flow and Shield</i> is an interactive installation that explores themes of viruses and immunity, where desire is understood as a force that spreads, transforms, and mutates across bodies, media environments, and collective imagination.",
            "Visitors physically interact with a rotating wooden structure, pushing and pulling it with their bodies to generate virus-like digital forms in real time. The structure also functions as a system of defence and release: participants can either protect their desire-objects by controlling the structure, or let them re-enter the field of contagion.",
            "The projected entities on the floor recognise multiple participants at once. The most dominant entity gradually absorbs and transforms the others through a process of viral assimilation; weaker entities are drawn into its influence and partially integrated. At times a single dominant entity remains on the surface, shaped by continuous competition and adaptation within the system.",
            "When a participant is detected by the camera, corresponding sounds are triggered, creating a responsive environment where movement, image, sound, and bodily interaction continuously affect one another.",
        ],
    },
    {
        "slug": "viruses-and-their-desires",
        "title": "Viruses and Their Desires",
        "note": "",
        "year": "2024",
        "type": "Narrative installation",
        "list_venue": "Artience Daejeon × KRIBB",
        "shown": [("Artience Daejeon 2024, Daejeon Culture and Arts Foundation × KRIBB, Daejeon", "2024.10")],
        "materials": "9 speculative multi-agent narratives, AI-generated text (ChatGPT), diagrams and drawings, variable dimensions",
        "with": "Dr. Jihyun Yang (KRIBB)",
        "links": [],
        "summary": "Nine speculative multi-voiced narratives, developed with KRIBB and AI, in which viruses speak about the desires that keep them alive.",
        "body": [
            "Nine speculative short-form narratives operating as a multi-voiced narrative system in a dialogic, speaker-labelled format. Structured as an internet-article–based ecosystem, these texts form a conceptual framework for real-time digital interaction. Developed with KRIBB and AI, they function as a bridge between speculative fiction and the <i>Infected Desires</i> installation.",
            "Each entry is constructed as a multi-agent narrative in which non-human voices co-produce discourse through a structured utterance system. Rather than traditional storytelling, the work operates as a narrative interface where scientific observation merges with fictional imagination, producing a hybrid language of virology and speculative discourse.",
            "Within this framework, desire becomes a mode of survival and perception: just as humans construct “safe assets” through concepts like secure real estate investment, viruses—prior to the emergence of COVID-19 antimicrobial films—perceived surfaces such as elevator buttons as stable nodes of transmission, akin to ecological safe zones.",
            "At the end of each narrative, the trajectory of desire is documented through diagrammatic graphs and hand-drawn scribbles.",
        ],
    },
    {
        "slug": "the-sign",
        "title": "The Sign",
        "note": "Supported by Gyeonggi Cultural Foundation.",
        "year": "2020",
        "type": "Digital art with COVID-19 data, 1920 × 1080 px",
        "list_venue": "Gyeonggi Cultural Foundation, online",
        "shown": [("“The Sign: 2020 COVID-19 by South Korea Data”, online exhibition, Gyeonggi Cultural Foundation", "2020")],
        "materials": "COVID-19 public data (CSV), Processing, OSC, TouchDesigner, Maya",
        "with": "Kim Ho-nam & Hyun Seung-cheol (technical support), Hong Gwang-min (sound)",
        "links": [("Watch the video", "https://vimeo.com/457277084")],
        "summary": "Early COVID-19 case data from South Korea drives the motion of a 3D virus form, sent from Processing to TouchDesigner over OSC.",
        "body": [
            "<i>The Sign</i> visualises South Korea’s COVID-19 case data from the first confirmed case through roughly the first six months of the pandemic, before the country’s K-quarantine system took shape.",
            "Public CSV records are read in Processing, which lists and replays the daily case counts and sends them over the OSC protocol. TouchDesigner receives the data through the protocol port and refines it. The virus form was modelled in 3D in Maya, and its movement is driven by the values in the data.",
            "The work was made as a starting point for further visual and interactive studies of viruses.",
        ],
    },
    {
        "slug": "making-a-window",
        "title": "Making a Window",
        "note": "Master’s graduation project, Yonsei University Graduate School of Communication.",
        "year": "2020",
        "type": "Interactive installation, 1920 × 1080 px",
        "list_venue": "Yonsei University, Seoul",
        "shown": [("“Transaction in Interactive Art”, research exhibition, Yonsei University, Seoul", "2020")],
        "materials": "Kinect, PC, wall projection",
        "with": "Hyun Seung-cheol (technical support)",
        "links": [("Watch the video", "https://vimeo.com/608283702")],
        "summary": "An interactive installation on trans-action: participants’ faces become points on the wall, and when three points align the work opens into video.",
        "body": [
            "<i>Making a Window</i> explores the concept of trans-action in art and invites unpredictable social interaction between participants.",
            "A Kinect camera reads the facial coordinates of the people in front of the wall, and Unity displays one or two points according to their number and position. When three points align, the system shifts into video output and reveals the final form of the work.",
        ],
    },
    {
        "slug": "circulation",
        "title": "Circulation: Wave and Negentropy",
        "note": "",
        "year": "2019",
        "type": "Video, 1920 × 1080 px",
        "list_venue": "IBS Quantum Nanoscience Art Competition, Seoul",
        "shown": [("IBS Center for Quantum Nanoscience Art Competition, Ewha Womans University, Seoul", "2019.09–12")],
        "materials": "Single-channel video, sound",
        "with": "Hong Gwang-min (sound)",
        "links": [("Watch the video", "https://vimeo.com/342796965")],
        "summary": "A video work combining metaphysical imagery and sound to express the cyclical relationship between waves and negentropy.",
        "body": [
            "This video work combines metaphysical imagery with sound to express the cyclical relationship between waves and negentropy. It explores the interplay between entropy and its counterforce, and what unfolds between waves and particles, between quantitative certainty and fluid waveforms.",
            "Suggesting that quantum forms emerge in this in-between space, the work reflects on how these shifting states continuously reshape the world.",
        ],
    },
    {
        "slug": "surviving-blocks",
        "title": "Surviving Blocks",
        "note": "",
        "year": "2017",
        "type": "Mixed-media installation",
        "list_venue": "Artience 30×30, Daejeon",
        "shown": [("Artience 30×30, Daejeon Culture and Arts Foundation × KAIST Graduate School of Culture Technology × British Council, Daejeon", "2017")],
        "materials": "Mixed media, projection mapping, PC, variable dimensions",
        "with": "Dr. Lee Hyun-ji (biologist)",
        "links": [("Watch the video", "https://vimeo.com/257823234")],
        "summary": "A mixed-media installation on survival, made with biologist Dr. Lee Hyun-ji through projection mapping and digital image composition.",
        "body": [
            "<i>Surviving Blocks</i> is a mixed-media installation exploring themes of survival, made in collaboration with biologist Dr. Lee Hyun-ji.",
            "Projection mapping and composited digital images run across a structure of stacked blocks.",
            "The work was created as a participating artist in Artience 30×30, a programme of KAIST Graduate School of Culture Technology, the British Council and Daejeon Culture and Arts Foundation.",
        ],
    },
]

# ---------------------------------------------------------------------
#  PAINTING  (위에서부터 순서대로 표시)
#  images: 첫 번째가 목록에 보이는 이미지. 두 번째부터는 크게 보기에서 넘겨 보는 이미지.
#          ("파일이름", "설명") — 파일은 assets/img/painting/ 안에 있어요.
#          목록용 작은 이미지는 같은 이름 + "-s" (예: projections-1-s.webp)
#  year / medium / size 가 "" 이면 표시하지 않습니다.
#  TODO 표시된 것은 제목·연도를 확인해서 채워 주세요.
# ---------------------------------------------------------------------
PAINTING = [
    {"title": "Fragments of Desire: Projections 1", "year": "2024", "medium": "Oil and acrylic with mirror fragments on canvas", "size": "",
     "images": [("projections-1", "Full view"), ("projections-1-detail", "Detail")]},
    {"title": "Fragments of Desire: Projections 2", "year": "2024", "medium": "Oil and acrylic with mirror fragments on canvas", "size": "",
     "images": [("projections-2", "Full view"), ("projections-2-detail", "Detail")]},
    {"title": "Fragments of Desire: Projections 3", "year": "2024", "medium": "Oil and acrylic with mirror fragments on canvas", "size": "",
     "images": [("projections-3", "Full view"), ("projections-3-detail", "Detail")]},
    # 프린트 시리즈 — 3점이 한 작품(3연작) + 각각 독립된 프린트 2점
    {"title": "Fragments of Desire: Mutating Objects (변이하는 객체들), triptych", "year": "2024", "medium": "Digital print, three parts", "size": "1080 × 1920 px each",
     "images": [("mutating-objects-triptych", "Installation view")]},
    {"title": "Fragments of Desire: Mutating Objects (변이하는 객체들)", "year": "2024", "medium": "Digital print", "size": "1080 × 1920 px",
     "images": [("mutating-objects-print-1", ""), ("mutating-objects-installation", "Installation view")]},
    {"title": "Fragments of Desire: Mutating Objects (변이하는 객체들)", "year": "2024", "medium": "Digital print", "size": "1920 × 1080 px",
     "images": [("mutating-objects-print-2", ""), ("mutating-objects-installation", "Installation view")]},
    {"title": "Contact (접촉)", "year": "2016", "medium": "Oil on canvas", "size": "72.5 × 53 cm", "images": [("blue-cell", "")]},
    {"title": "Sonata of Addiction (중독의 소나타)", "year": "2016", "medium": "Oil on canvas", "size": "100 × 80.3 cm", "images": [("blue-cluster", "")]},
    {"title": "5-dimension", "year": "2016", "medium": "Oil and hwaseonji (rice paper) on canvas", "size": "131 × 75 cm", "images": [("reclining-figure", "")]},
    {"title": "Firestone", "year": "2016", "medium": "Oil on canvas", "size": "72.7 × 60.6 cm", "images": [("firestone", "")]},
    {"title": "Primavera", "year": "2017", "medium": "Oil on canvas", "size": "50 × 65 cm", "images": [("forest-window", "")]},
    {"title": "Tree of Idea (관념의 나무)", "year": "2016", "medium": "Oil on canvas", "size": "116.8 × 91 cm", "images": [("blue-tree", "")]},
    {"title": "Idea Cube (이데아 큐브)", "year": "2016", "medium": "Oil on canvas", "size": "72.7 × 90 cm", "images": [("idea-cube", "")]},
    {"title": "Approach (접근)", "year": "2016", "medium": "Oil on canvas", "size": "50 × 50 cm", "images": [("two-cells", "")]},
    {"title": "Exit from Karma (업의 출구)", "year": "2017", "medium": "Oil on canvas", "size": "130 × 53 cm",
     "images": [("exit-from-karma", ""), ("triptych", "Composite with other works")]},
]

# ---------------------------------------------------------------------
#  CV
#  각 줄 맨 앞의 True / False 가 '사이트에 보이기 / 숨기기' 입니다.
#  False 로 둔 이력은 HTML 에 아예 들어가지 않아서 검색에도 잡히지 않아요.
# ---------------------------------------------------------------------
CV = {
    "intro": "Yeongju Yang (양영주) is a painter and media artist based in Seoul, researching desire and <i>trans-action</i> between humans, technology and the environment. Research at Yonsei University on trans-action in interactive art links cybernetics, Eastern philosophy and the aesthetics of change.",
    "note": "",   # 소개 아래 작은 안내문 (비우면 표시 안 함)
    "sections": [
        ("Selected exhibitions", [
            (True,  "2026", "Shinbuldang Art Center, “Human Becoming (인간, 되어가는 중)”, three-person exhibition with Kim Hyeongsoo and Lee Yujin, Cheonan"),
            (True,  "2026–2027", "ZKM, “Silver Egg: The Eros of Media Art”, <i>Transactions of Desire</i>, media installation, Karlsruhe"),
            (True,  "2026", "Bucheon Cultural Foundation, “따뜻한 소음 아득한 정적 (Warm Noise, Distant Silence)”, group exhibition, Boksagol Gallery, Bucheon"),
            (True,  "2025", "Grand Palais Immersif, “Artificial Dreams II: Visions of the Future”, <i>Fragments of Desire</i>, video art, Paris"),
            (True,  "2025", "Seoul Arts Center, ISEA2025 “Dong-Dong: Creator’s Universe”, <i>Transaction of Desires</i>, interactive installation, Seoul"),
            (True,  "2024", "Gong-gan Kkachijip, “Formations: On the Table”, <i>Fragments of Desire</i>, digital art duo exhibition with Kim Hyeongsoo, Cheonan"),
            (True,  "2024", "Daejeon Culture and Arts Foundation Artience × KRIBB, Artience Daejeon 2024, <i>Fragments of Desire Project</i>, curation and production, Daejeon"),
            (True,  "2021", "SPACE TYPE, Art and Technology Convergence Support Program, <i>Imaginary Musicscape</i>, VR planning and 3D, Seoul"),
            (True,  "2020", "Yonsei University, “Transaction in Interactive Art”, <i>Making a Window</i>, research exhibition, Seoul"),
            (True,  "2020", "Gyeonggi Cultural Foundation, “The Sign: 2020 COVID-19 by South Korea Data”, <i>The Sign</i>, online exhibition, Gyeonggi"),
            (True,  "2019", "Ewha Womans University, IBS Center for Quantum Nanoscience Art Competition, <i>Circulation: Wave and Negentropy</i>, science art project, Seoul"),
            (True,  "2018", "Jeongsu Art Center, Yeongju Yang solo exhibition, “Imagined Reality”, painting and installation, Seoul"),
            (True,  "2017", "Daejeon Culture and Arts Foundation × KAIST Graduate School of Culture Technology × British Council, Artience 30×30, <i>Surviving Blocks</i>, participating artist, Daejeon"),
            (False, "2017", "Cheongju MUMI Art, Musimcheon Gurumul Public Art Project, <i>Starry Playground</i>, public art installation, Cheongju"),
            (False, "2017", "Daejeon Arts Center, Daejeon Art Festival “Contemporary Art of Daejeon Today”, group exhibition, Daejeon"),
            (False, "2016", "Chungbuk Cultural Foundation, “Artist 5Dsay”, group exhibition, Cheongju"),
            (False, "2016", "Chungbuk Minjok Art Festival, group exhibition, Cheongju Museum of Art, Cheongju"),
            (True,  "2016", "Chungbuk Federation of Cultural and Artistic Organizations, “When Your Star Meets Mine”, solo exhibition, Cheongju"),
        ]),
        ("Projects and workshops", [
            (True,  "2026", "Shinbuldang Art Center, “Human Becoming”, artist workshop on the sixteen types of desire, Cheonan"),
            (True,  "2026", "ZKM, opening programme of “Silver Egg: The Eros of Media Art”, artist workshop, Karlsruhe"),
            (True,  "2025", "National Science Museum of Korea × Yeongju Yang, “Workshop: The Desire Laboratory”, ISSM 2025, artist workshop"),
            (True,  "2024", "Daejeon Culture and Arts Foundation × Yeongju Yang, “My Desire: Generation Laboratory and Dialogue”, <i>Fragments of Desire</i>, artist workshop"),
            (True,  "2023–2024", "Daejeon Culture and Arts Foundation Artience, Korea Research Institute of Bioscience and Biotechnology (KRIBB) × Yeongju Yang, <i>Fragments of Desire</i>, planning and production"),
            (True,  "2018–2020", "Yonsei University X-Media Art and Research Center, “Toegye’s Ten Diagrams on Sage Learning” VR project: a study on the experiential spatiotemporal expression of Eastern philosophy concepts, VR planning and graphics"),
            (False, "2017", "Daejeon Culture and Arts Foundation × KAIST Graduate School of Culture Technology × British Council, <i>Surviving Blocks</i>, participating artist, Artience 30×30"),
            (False, "2017", "Cheongju Musimcheon Gurumul Square MUMI Art participatory project, <i>Starry Playground</i>, public art structure production"),
        ]),
        ("Publications", [
            (True,  "2020", "Hyun Jean Lee, Wonjean Lee, Hyungsin Kim, Jinhun Park, Jiyun Kim, Honam Kim, Mae Hwe Kim, Gwang Min Hong, <b>Yeongju Yang</b>, Seung Cheol Hyun, Joon Seok Moon, Haejin Jung, Hyunsoo Kim, Yuyeol Byeon. “SungHakSipDo VR, No. 3 SoHakDo (Illustration of Elementary Learning)”, Art and Technology Convergence Support Program. <i>Journal of the HCI Society of Korea</i>, 2020 (2)."),
            (True,  "2020", "<b>Yeongju Yang</b>. “‘Transaction’ in Interactive Art: Focused on ‘Change’ in the Process for Aesthetic Experience”. Master’s thesis, Yonsei University."),
            (True,  "2019", "Mae Hwe Kim, <b>Yeongju Yang</b>, Wonjean Lee. “I-Ching and Taegeukdo in Multimedia Artwork”. <i>Journal of the HCI Society of Korea</i>, 2019 (2)."),
        ]),
    ],
}

# ---------------------------------------------------------------------
#  CONTACT
# ---------------------------------------------------------------------
CONTACT = {
    "label_email": "E-mail",
    "label_lab": "Trans-action Art Lab",
    "label_dm": "Direct message",
    "label_based": "Based in",
}

# ---------------------------------------------------------------------
#  ARCHIVE — Wish Tower
# ---------------------------------------------------------------------
ARCHIVE = {
    "title": "Wish Tower",
    "question": "현재 당신이 가장 원하는 것은 무엇인가요?",
    "button": "남기기",
    "empty": "소원을 한 줄 적어 주세요.",
    "saved": "탑에 올라갔습니다.",
    "error": "지금은 저장할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    "caption": "Every wish left here floats in the tower, coloured by the kind of desire it carries.",
}
