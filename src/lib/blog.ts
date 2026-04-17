export type BlogFAQ = {
  question: string
  answer: string
}

export type BlogSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  updatedAt: string
  image: string
  imageAlt: string
  author: string
  readTimeMinutes: number
  keywords: string[]
  sourceNote: string
  supportImage?: string
  supportImageAlt?: string
  sections: BlogSection[]
  faq: BlogFAQ[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'hoe-kies-je-de-juiste-kleur-voor-je-keuken',
    title: 'Hoe kies je de juiste kleur voor je keuken?',
    excerpt:
      'Een rustige keuken begint bij kleurconsistentie. In deze gids van Noctis leer je hoe je warme en koele tinten slim combineert voor een stijlvol aanrecht.',
    date: '2025-03-12',
    updatedAt: '2026-04-15',
    image: '/content/blogs/hoe-kies-je-de-juiste-kleur-voor-je-keuken.webp',
    imageAlt: '19-delige keukenset in nude kleur op een aanrecht',
    author: 'Milan van Noctis',
    readTimeMinutes: 6,
    keywords: [
      'keuken kleur kiezen',
      'keuken styling tips',
      'nude keukenset',
      'rustig aanrecht',
      'Noctis keukenadvies',
    ],
    sourceNote: 'Redactionele bron: Noctis productteam en klantinzichten, geverifieerd op 15 april 2026.',
    sections: [
      {
        heading: 'Waarom kleur zo veel invloed heeft op je keukengevoel',
        paragraphs: [
          'Kleur is niet alleen decoratie. In de praktijk bepaalt kleur hoeveel visuele rust je ervaart wanneer je kookt. Wanneer tools, houders en accessoires qua toon botsen, voelt je werkblad sneller rommelig.',
          'Bij Noctis zien we dat klanten die overstappen op één samenhangend kleurpalet hun keuken vaker als opgeruimd en “af” omschrijven, zelfs zonder verbouwing.',
        ],
      },
      {
        heading: 'Stap 1: kijk eerst naar vaste elementen',
        paragraphs: [
          'Start met de kleuren die al vastliggen: kastfronten, werkblad, vloer en wandtegels. Die vormen het basiskader waar je accessoires in moeten passen.',
          'Heb je warme houttonen of beige marmer? Dan werken warme sets zoals nude en wit vaak het rustigst. Heb je veel koele tinten of betonlook? Dan sluiten grijs, zwart of groen meestal beter aan.',
        ],
        bullets: [
          'Warme basis: nude, wit, zachte aardetinten',
          'Koele basis: grijs, zwart, groen',
          'Twijfelgeval: zwart-wit is het meest neutraal en combineert breed',
        ],
      },
      {
        heading: 'Stap 2: kies één hoofdkleur en houd die consequent',
        paragraphs: [
          'De grootste winst zit in consistentie. Eén set in één kleurfamilie oogt direct rustiger dan losse tools van meerdere merken en materialen.',
          'Dat is precies waarom complete sets vaak sterker ogen dan losse aankopen: je haalt in één keer balans in vorm, kleur en afwerking naar je aanrecht.',
        ],
      },
      {
        heading: 'Stap 3: voeg hooguit één accentkleur toe',
        paragraphs: [
          'Wil je meer karakter? Werk dan met één gecontroleerd accent, bijvoorbeeld in je peper- en zoutmolens of een vaas. Zo blijft het rustig, maar niet saai.',
          'Gebruik die accentkleur maximaal op twee plekken. Meer accenten zorgen vaak opnieuw voor visuele onrust.',
        ],
      },
      {
        heading: 'Noctis advies in het kort',
        paragraphs: [
          'Voor de meeste keukens werkt een combinatie van één basiskleur + één accent het best. Daarmee creëer je een keuken die niet alleen mooi oogt op foto’s, maar ook dagelijks prettig aanvoelt in gebruik.',
        ],
      },
    ],
    faq: [
      {
        question: 'Welke kleur keukenset past in een lichte keuken?',
        answer:
          'In lichte keukens werken nude, wit en mintgroen vaak goed. Deze kleuren versterken ruimtelijkheid zonder hard contrast.',
      },
      {
        question: 'Is zwart te zwaar voor een kleine keuken?',
        answer:
          'Niet per se. Zwart werkt juist goed als je de rest van het blad rustig houdt en niet te veel losse kleuren toevoegt.',
      },
    ],
  },
  {
    slug: 'waarom-een-acacia-snijplank-de-beste-keuze-is',
    title: 'Waarom een acacia snijplank de beste keuze is',
    excerpt:
      'Acacia combineert duurzaamheid, mesvriendelijkheid en uitstraling. Ontdek waarom een acacia snijplank van Noctis een slimme langetermijnkeuze is.',
    date: '2025-02-20',
    updatedAt: '2026-04-15',
    image: '/content/blogs/waarom-een-acacia-snijplank-de-beste-keuze-is.webp',
    imageAlt: 'Acacia snijplank van Noctis',
    author: 'Milan van Noctis',
    readTimeMinutes: 7,
    keywords: [
      'acacia snijplank voordelen',
      'beste houten snijplank',
      'mesvriendelijke snijplank',
      'snijplank onderhoud',
      'Noctis acacia',
    ],
    sourceNote: 'Redactionele bron: Noctis productteam en materiaalspecificaties, geverifieerd op 15 april 2026.',
    sections: [
      {
        heading: 'Wat maakt acacia anders dan standaard snijplanken?',
        paragraphs: [
          'Acacia is een dichte, sterke houtsoort met natuurlijke variatie in nerf en kleur. Daardoor is het materiaal zowel functioneel als esthetisch geschikt voor dagelijks gebruik op het aanrecht.',
          'In vergelijking met veel zachtere houtsoorten neemt acacia minder snel vocht op en blijft het langer stabiel bij normaal keukenverbruik.',
        ],
      },
      {
        heading: 'Goed voor je messen én voor hygiëne',
        paragraphs: [
          'Een goede snijplank moet hard genoeg zijn om lang mee te gaan, maar niet zo hard dat je messen sneller bot worden. Acacia zit precies in die balans.',
          'Daarnaast helpt de dichte structuur van het hout om het oppervlak hygiënisch te houden, mits je de plank goed reinigt en laat drogen.',
        ],
      },
      {
        heading: 'Praktisch onderhoud zonder gedoe',
        paragraphs: [
          'Voor langdurige kwaliteit is handwas de beste keuze. Vermijd weken in water en gebruik geen vaatwasser, omdat extreme hitte en vocht het hout kunnen vervormen.',
          'Behandel de plank periodiek met een voedselveilige olie om uitdroging te voorkomen en de natuurlijke glans te behouden.',
        ],
        bullets: [
          'Reinig met lauw water + milde zeep',
          'Droog direct na het afwassen',
          'Olie 1-2 keer per maand bij intensief gebruik',
        ],
      },
      {
        heading: 'Waarom Noctis kiest voor acacia in setvorm',
        paragraphs: [
          'Met meerdere formaten in één set kun je per taak de juiste plank gebruiken: klein voor fruit, middel voor dagelijks snijwerk en groot voor vlees of serveerwerk.',
          'Dat maakt je workflow sneller, netter en hygiënischer dan één universele plank voor alles.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is acacia beter dan bamboe?',
        answer:
          'Beide zijn sterke keuzes, maar acacia is vaak robuuster qua uitstraling en voelt zwaarder en stabieler aan op het werkblad.',
      },
      {
        question: 'Hoe vaak moet ik een acacia plank oliën?',
        answer:
          'Bij normaal gebruik meestal eens per 3-6 weken. Bij dagelijks intensief gebruik kan dat vaker nodig zijn.',
      },
    ],
  },
  {
    slug: 'de-perfecte-keuken-setup-voor-een-rustig-aanrecht',
    title: 'De perfecte keuken-setup voor een rustig aanrecht',
    excerpt:
      'Minder visuele ruis, meer focus tijdens het koken. In deze complete gids van Noctis ontdek je hoe je je aanrecht logisch inricht met zones, kleurconsistentie en vaste routines.',
    date: '2026-04-16',
    updatedAt: '2026-04-16',
    image: '/content/blogs/perfecte-keuken-setup-hero.webp',
    imageAlt: 'Rustige keukenopstelling met Noctis producten op het aanrecht',
    supportImage: '/content/blogs/perfecte-keuken-setup-inline.webp',
    supportImageAlt: 'Detailbeeld van een rustige keukenopstelling met Noctis',
    author: 'Milan van Noctis',
    readTimeMinutes: 9,
    keywords: [
      'aanrecht organiseren',
      'rustige keuken inrichting',
      'keuken setup tips',
      'keuken minimalisme',
      'Noctis keukenset',
      'keuken workflow optimaliseren',
      'visuele rust in de keuken',
      '19-delige keukenset',
      'Noctis essentials',
    ],
    sourceNote: 'Redactionele bron: Noctis designrichtlijnen, supportvragen en klantfeedback, geverifieerd op 16 april 2026.',
    sections: [
      {
        heading: 'Rust op je aanrecht begint met selectie',
        paragraphs: [
          'Een rustige keuken begint niet bij méér schoonmaken, maar bij minder visuele prikkels. In de praktijk zien we bij Noctis dat keukens sneller “rommelig” voelen zodra er veel losse tools, verschillende materialen en kleurbreuken op het aanrecht staan.',
          'Start daarom met selectie: laat alleen items zichtbaar die je minimaal meerdere keren per week gebruikt. Denk aan een vaste toolhouder, je dagelijkse molens en eventueel één snijplank die ook als serveerplank werkt.',
          'Alles wat je incidenteel gebruikt, hoort uit het zicht. Niet omdat het minder belangrijk is, maar omdat je werkoppervlak dan overzichtelijk blijft en je tijdens het koken minder mentale ruis ervaart.',
        ],
        bullets: [
          'Houd zichtbare items beperkt tot dagelijkse essentials',
          'Groepeer losse tools in één vaste houder',
          'Vermijd dubbele functies op het aanrecht',
        ],
      },
      {
        heading: 'Werk met zones in plaats van losse plekken',
        paragraphs: [
          'Veel keukens missen geen spullen, maar een systeem. Een aanrecht zonder zones zorgt ervoor dat items gaan “zwerven”: vandaag ligt de spatel naast het fornuis, morgen bij de spoelbak. Dat kost tijd en onderbreekt je ritme.',
          'Verdeel je werkblad daarom in drie duidelijke zones: voorbereiding, koken en afwerking/serveren. Zo ontstaat een logische flow waarbij je minder hoeft na te denken over waar iets ligt.',
          'Plaats in elke zone alleen wat je daar echt nodig hebt. Dat maakt je keuken niet alleen netter, maar ook sneller in gebruik.',
        ],
        bullets: [
          'Prep-zone: snijplank, mes, kom',
          'Kook-zone: spatels, lepels, tang in houder',
          'Serve-zone: molens, olie, afwerking',
        ],
      },
      {
        heading: 'Kleurconsistentie bepaalt 80% van je rustige look',
        paragraphs: [
          'Visuele rust ontstaat vooral door consistentie in kleur en afwerking. Losse aankopen van verschillende merken hebben vaak net andere tinten wit, zwart of grijs. Dat lijkt klein, maar samen zorgt het voor onrust in je totaalbeeld.',
          'Een complete set in één stijl voorkomt die mismatch in één keer. Daarom kiezen veel klanten voor een 19-delige keukenset gecombineerd met bijpassende peper- en zoutmolens: alles sluit qua vormtaal en toon direct op elkaar aan.',
          'Wil je toch variatie? Gebruik maximaal één accentkleur. Meer dan één accent zorgt in kleine ruimtes snel voor drukte.',
        ],
      },
      {
        heading: 'Bouw vaste routines rond je setup',
        paragraphs: [
          'Een goede keuken-setup werkt pas echt als je hem ondersteunt met eenvoudige routines. Denk aan een korte reset van 60 seconden na het koken: tools terug in de houder, plank schoon, werkblad leeg.',
          'Die mini-routine voorkomt dat kleine rommel zich opstapelt. Na een week merk je dat je keuken structureel rustiger blijft, zonder extra moeite.',
          'Noctis-producten zijn ontworpen rondom dit principe: zichtbaar mogen blijven, snel te pakken, en direct terug op hun vaste plek.',
        ],
      },
      {
        heading: 'Welke Noctis-combinatie werkt het best per type keuken?',
        paragraphs: [
          'Voor compacte keukens raden we één centrale toolhouder + een minimalistisch molenset aan. In grotere leefkeukens kun je aanvullend werken met een acacia snijplankenset voor prep en presentatie.',
          'Gebruik je veel dagelijks? Dan is een complete 19-delige set vaak de meest efficiënte keuze: je hoeft niet meer te combineren tussen losse materialen en hebt direct een uniforme workflow.',
          'Kook je vooral snel doordeweeks? Dan kan een lichtere setup met molens + kern-tools al voldoende zijn, zolang je zones en kleurconsistentie bewaakt.',
        ],
      },
      {
        heading: 'Conclusie: minder losse keuzes, meer rust en flow',
        paragraphs: [
          'De perfecte keuken-setup draait niet om trends, maar om helderheid. Selecteer bewust, werk in zones, houd kleurgebruik consistent en maak onderhoud eenvoudig.',
          'Zo krijg je een keuken die rustiger oogt én prettiger werkt. Dat is precies waar Noctis voor staat: tools en accessoires die samen één geheel vormen, zodat jij met meer focus en minder frictie kookt.',
        ],
      },
    ],
    faq: [
      {
        question: 'Hoeveel items kunnen het best op een aanrecht blijven staan?',
        answer:
          'Houd het bij dagelijkse essentials: bijvoorbeeld een toolhouder, peper- en zoutmolens en eventueel één snijplank. De rest kun je beter opbergen voor maximale rust.',
      },
      {
        question: 'Werkt deze aanpak ook in kleine keukens?',
        answer:
          'Ja, juist in kleinere keukens levert zonering en kleurconsistentie de meeste winst op. Minder visuele ruis maakt de ruimte direct groter en overzichtelijker.',
      },
      {
        question: 'Welke set is het meest geschikt als ik in één keer rust wil creëren?',
        answer:
          'Meestal de 19-delige keukenset, omdat je direct een complete basis hebt in één stijl. Voeg daarna eventueel bijpassende molens of een acacia snijplank toe.',
      },
      {
        question: 'Hoe voorkom ik dat mijn aanrecht na een week weer rommelig wordt?',
        answer:
          'Werk met vaste zones en een korte resetroutine na elk kookmoment. Door tools direct terug te plaatsen in dezelfde houder blijft je keuken duurzaam georganiseerd.',
      },
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
