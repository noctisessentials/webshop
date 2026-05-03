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
    slug: 'acacia-snijplank-onderhouden',
    title: 'Zo onderhoud je een acacia snijplank: schoonmaken en invetten',
    excerpt:
      'Een acacia snijplank gaat tientallen jaren mee — maar alleen als je hem goed onderhoudt. In deze gids leer je precies hoe je hem schoonmaakt, invet en beschermt tegen uitdroging en barsten.',
    date: '2026-04-27',
    updatedAt: '2026-04-27',
    image: '/content/blogs/acacia-snijplank-onderhouden-hero.webp',
    imageAlt: 'Acacia snijplank van Noctis wordt ingevet met houtolie',
    supportImage: '/content/blogs/acacia-snijplank-onderhouden-olie.webp',
    supportImageAlt: 'Voedselolie wordt aangebracht op een acacia snijplank',
    author: 'Milan van Noctis',
    readTimeMinutes: 8,
    keywords: [
      'acacia snijplank onderhouden',
      'houten snijplank schoonmaken',
      'snijplank invetten',
      'welke olie voor snijplank',
      'acacia snijplank onderhoud tips',
      'houten snijplank verzorgen',
      'snijplank bijenwas',
      'Noctis acacia snijplank',
    ],
    sourceNote:
      'Redactionele bron: Noctis productteam op basis van materiaalspecificaties en gebruikservaringen, geverifieerd op 27 april 2026.',
    sections: [
      {
        heading: 'Waarom onderhoud zo belangrijk is voor acacia',
        paragraphs: [
          'Acacia is een van de hardste houtsoorten die je in de keuken kunt gebruiken — het scoort 2.300 op de Janka hardheidschaal, harder dan walnoot en eik. Dat maakt het duurzaam, mesvriendelijk en bestand tegen dagelijks gebruik.',
          'Maar acacia bevat ook natuurlijke oliën die het hout vochtig en flexibel houden. Wanneer die oliën verdwijnen door herhaald wassen, droogt het hout uit. Je ziet het eerst in een vale kleur en een ruw oppervlak. Als je niets doet volgen scheuren en splinters.',
          'Goed onderhoud is simpel: regelmatig schoonmaken op de juiste manier en de plank periodiek invetten. Dat is het. Een acacia snijplank die je serieus verzorgt gaat makkelijk 10 tot 20 jaar mee.',
        ],
      },
      {
        heading: 'Dagelijks schoonmaken: zo doe je het goed',
        paragraphs: [
          'Was je acacia snijplank direct na gebruik af met warm water en een milde afwasmiddel. Gebruik een zachte spons of doek — geen staalwol of schurende pads, want die beschadigen het houtoppervlak.',
          'Spoel de zeep goed af en droog de plank direct en grondig af met een theedoek. Zet hem daarna rechtop of leg hem schuin zodat beide kanten goed kunnen uitdampen. Laat hem nooit plat liggen terwijl hij nat is: de onderkant blijft dan langer vochtig en het hout kan gaan werpen.',
        ],
        bullets: [
          'Gebruik warm water + milde afwaszeep',
          'Schrob met een zachte spons, nooit met staalwol',
          'Droog direct af en zet de plank rechtop',
          'Laat nooit plat drogen op een nat aanrecht',
        ],
      },
      {
        heading: 'Wat je absoluut moet vermijden',
        paragraphs: [
          'De vaatwasser is de grootste vijand van een acacia snijplank. De combinatie van intense hitte, lang aanhoudend vocht en agressief reinigingsmiddel trekt alle natuurlijke oliën uit het hout. Na een paar keer vaatwassen barst of vervormt de plank vrijwel altijd.',
          'Laat de plank ook nooit in water weken. Hout neemt snel vocht op, zwelt op aan de buitenkant terwijl de binnenkant droog blijft, en dat ongelijke spanningsverschil leidt direct tot scheuren.',
          'Gebruik ook geen bleekmiddel of agressieve schoonmaakmiddelen. Die drogen het hout versneld uit en kunnen sporen achterlaten die je later in je eten terugvindt.',
        ],
        bullets: [
          'Geen vaatwasser — altijd met de hand wassen',
          'Nooit laten weken in water of in de gootsteen laten staan',
          'Geen bleekmiddel of agressieve reinigingsmiddelen',
          'Niet in direct zonlicht of naast de oven bewaren',
        ],
      },
      {
        heading: 'Vlekken en geuren verwijderen',
        paragraphs: [
          'Knoflook-, ui- of visgeur laat je verdwijnen met grof zeezout en een halve citroen. Strooi een laagje zout op de plank en wrijf hem in cirkelbewegingen in met de snijkant van de citroen. Het zout fungeert als schuurmiddel en de citroen neutraliseert de geur. Spoel daarna goed af en droog direct.',
          'Hardnekkige vlekken van rode wijn of bessen pak je aan met een pasta van baksoda en water. Laat die twee minuten inwerken, wrijf voorzichtig in en spoel goed af. Hierna is even extra invetten aan te raden, omdat baksoda licht ontvettend werkt.',
        ],
      },
      {
        heading: 'Invetten: welke olie gebruik je en hoe vaak?',
        paragraphs: [
          'Invetten is de belangrijkste stap in het onderhoud van je acacia snijplank. Door regelmatig olie aan te brengen, vul je de natuurlijke oliën aan die bij het wassen verdwijnen. Zo blijft het hout soepel, voorkom je scheuren en behoudt de plank zijn diepe kleur.',
          'De beste keuze is voedselolie op mineraalbasis (food-grade mineral oil). Dit type olie droogt niet in, wordt nooit ranzig en penetreert diep in de houtstructuur. Bijenwas is een uitstekende aanvulling: het vormt een beschermende laag aan de oppervlakte die het effect van de olie verlengt en de plank een zachte glans geeft.',
          'Gebruik nooit olijfolie, zonnebloemolie of andere plantaardige keukenoliën. Die worden ranzig in het hout, veroorzaken een nare geur en kunnen zelfs schimmel aantrekken.',
        ],
        bullets: [
          'Beste keuze: food-grade minerale olie of bijenwas',
          'Goede aanvulling: mengsel van minerale olie en bijenwas (4:1)',
          'Nooit gebruiken: olijfolie, zonnebloemolie, kokosolie, lijnzaadolie',
          'Frequentie bij normaal gebruik: eens per 3 tot 4 weken',
          'Frequentie bij dagelijks intensief gebruik: eens per 2 weken',
        ],
      },
      {
        heading: 'Stap voor stap: je acacia snijplank invetten',
        paragraphs: [
          'Zorg dat de plank schoon en volledig droog is voordat je begint. Een natte plank neemt de olie niet goed op.',
          'Giet of smeer een royale hoeveelheid olie op het oppervlak en verdeel hem met een schone doek of keukenpapier in de richting van de nerf. Wrijf de olie goed in en vergeet de zijkanten en achterkant niet — die drogen even snel uit.',
          'Laat de olie minimaal twee uur intrekken, maar liefst een nacht. Wip de volgende ochtend het overtollige olie af met een droge doek en poets het oppervlak kort op voor een egaal resultaat. De plank voelt direct steviger en ziet er rijker van kleur uit.',
        ],
        bullets: [
          'Stap 1: zorg dat de plank schoon en droog is',
          'Stap 2: breng een royale laag olie aan op alle kanten',
          'Stap 3: laat minimaal 2 uur intrekken (bij voorkeur een nacht)',
          'Stap 4: wip overtollige olie af en poets na',
          'Stap 5: herhaal bij een nieuwe plank de eerste week 3 keer',
        ],
      },
      {
        heading: 'Je eerste keer: behandel een nieuwe plank intensiever',
        paragraphs: [
          'Een nieuwe acacia snijplank heeft in de eerste week extra aandacht nodig. Breng drie keer olie aan met steeds een nacht ertussen. Zo bouw je een goede basis op in het hout die maandenlang beschermt.',
          'Na die eerste behandelronde is maandelijks onderhoud voldoende. Je ziet zelf wanneer de plank toe is aan nieuwe olie: het oppervlak ziet er mat en droog uit in plaats van diep en enigszins glanzend.',
        ],
      },
      {
        heading: 'Hoe lang gaat een goed onderhouden acacia snijplank mee?',
        paragraphs: [
          'Een acacia snijplank die je goed onderhoudt — correct wassen, direct drogen, regelmatig invetten — gaat gemakkelijk 10 tot 20 jaar mee. Planken die consequent worden verzorgd houden het zelfs langer vol dan dat.',
          'Ter vergelijking: een verwaarloosde acacia plank begint al na een jaar of twee te barsten en het oppervlak wordt ruw. Het verschil zit niet in de kwaliteit van het hout, maar volledig in hoe je hem behandelt.',
          'Noctis acacia snijplanken zijn gemaakt van geselecteerd acaciahout met een strakke nerf en gesloten structuur, waardoor ze olie goed opnemen en lang mooi blijven — mits je ze de aandacht geeft die ze verdienen.',
        ],
      },
    ],
    faq: [
      {
        question: 'Hoe vaak moet ik mijn acacia snijplank invetten?',
        answer:
          'Bij normaal gebruik eens per 3 tot 4 weken. Bij dagelijks intensief gebruik eens per 2 weken. Een nieuwe plank behandel je de eerste week drie keer achter elkaar voor een goede basisbescherming.',
      },
      {
        question: 'Welke olie is het beste voor een acacia snijplank?',
        answer:
          'Food-grade minerale olie is de gouden standaard: het wordt niet ranzig, penetreert diep en is volledig veilig bij voedselbereiding. Bijenwas is een goede aanvulling voor extra oppervlaktebescherming. Gebruik nooit olijfolie of andere plantaardige keukenoliën — die worden ranzig in het hout.',
      },
      {
        question: 'Mag een acacia snijplank in de vaatwasser?',
        answer:
          'Nee. De hitte en het langdurige vocht in de vaatwasser onttrekken alle natuurlijke oliën uit het hout, waardoor de plank snel barst of vervormt. Was je acacia snijplank altijd met de hand in warm water met een mild afwasmiddel.',
      },
      {
        question: 'Mijn acacia snijplank heeft kleine scheurtjes — wat nu?',
        answer:
          'Kleine scheurtjes zijn een teken van uitdroging. Behandel de plank meteen met een royale laag minerale olie en herhaal dat drie avonden achter elkaar. In veel gevallen trekken kleine scheurtjes vanzelf dicht wanneer het hout weer vocht opneemt. Grotere scheuren laat je vullen met voedselzeker houtlijm.',
      },
      {
        question: 'Hoe verwijder ik geuren van knoflook of vis uit mijn snijplank?',
        answer:
          'Strooi grof zeezout op de plank en wrijf hem in met de snijkant van een halve citroen. Het zout schrobt en de citroen neutraliseert de geur. Spoel goed af met warm water en droog de plank direct.',
      },
      {
        question: 'Hoe lang gaat een acacia snijplank mee?',
        answer:
          'Met goed onderhoud — regelmatig wassen op de juiste manier en maandelijks invetten — gaat een acacia snijplank 10 tot 20 jaar mee. De levensduur wordt volledig bepaald door hoe je hem verzorgt, niet door de houtsoort zelf.',
      },
    ],
  },
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
