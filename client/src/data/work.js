// Studio portfolio grid, shown on the root page (launchit.studio/). Links
// were verified live (page actually loaded and matched project branding),
// not just inferred from a deploy-state.json — a handful legitimately have
// no confirmed live instance, hence no link.
//
// type: 'webapp' for anything with real interactivity (accounts, data
// entry, generation, gameplay, tracking); 'website' for informational/
// marketing sites with no real backend behavior beyond maybe a contact
// form. Omitted entirely for things that aren't primarily a hosted site
// at all (Project Switcher is a local tool).
//
// icon: an emoji, picked per what the project actually is, not a generic
// default — more color/pop than a Material Icon for this size of card.
//
// description: 142 characters is the current longest (Ideal Instruction)
// — the card grid is sized off that. Keep new descriptions at or under
// 142 characters so every card stays the same size.
export default [
  {
    title: 'La Lotería',
    description: 'Multiplayer Lotería, the Mexican bingo game, playable in real time with friends.',
    link: 'https://d1g478ncyw9arv.cloudfront.net',
    type: 'webapp',
    icon: '🎴'
  },
  {
    title: 'Daily Meditations',
    description: "Turns Marcus Aurelius's Meditations into short modern-English daily passages with reflection prompts.",
    link: 'https://meditations.launchit.studio',
    type: 'webapp',
    icon: '🧘'
  },
  {
    title: 'Steelmill Gym',
    description: 'Redesign concept for an old-school Houston Heights bodybuilding gym, rebuilt from Wix into a fast modern site.',
    link: 'https://d2o6sntgwqzr70.cloudfront.net',
    type: 'website',
    icon: '🏋️'
  },
  {
    title: 'Home Financing Center',
    description: 'WordPress-to-Vue rebuild for a South Florida mortgage lender — faster site, same trusted branding.',
    link: 'https://www.homefinancingcenter.com',
    type: 'website',
    icon: '🏡'
  },
  {
    title: 'Ideal Instruction',
    description: 'Full WordPress-to-Quasar migration for a teacher-development company — every page, video showcase, and account flow rebuilt on a modern stack.',
    link: 'https://d1tkc36wtuokrt.cloudfront.net',
    type: 'webapp',
    icon: '🎓'
  },
  {
    title: 'Platr Meal Planner',
    description: "Builds a personalized multi-day meal plan from Platr's real menu to hit your macros, with one-click ordering.",
    link: 'https://d16v0snpm7wrwe.cloudfront.net',
    type: 'webapp',
    icon: '🍽️'
  },
  {
    title: '10th Fitness',
    description: 'Redesign concept for a Houston personal-training studio, replacing its WordPress/Elementor site.',
    link: 'https://d2n94x86jgwooa.cloudfront.net',
    type: 'website',
    icon: '💪'
  },
  {
    title: 'Digital Bulletin Board',
    description: 'Replaces physical city bulletin boards — publishes and cycles public meeting agendas, with a kiosk display mode for large screens.',
    link: 'https://d1r6yvp4doepfd.cloudfront.net/#/',
    type: 'webapp',
    icon: '📌'
  },
  {
    title: 'Clika',
    description: "Mobile-first World Cup 2026 bracket app — pick every match, invite your crew, see who really knows their fútbol.",
    link: 'https://d1np1ofgc91bto.cloudfront.net',
    type: 'webapp',
    icon: '⚽'
  },
  {
    title: 'Blast to the Past',
    description: "Drag a dial to any year from 1965-2020, get that year's Billboard Hot 100, and export it as a real Spotify playlist.",
    link: '',
    type: 'webapp',
    icon: '🎵'
  },
  {
    title: 'RealCost',
    description: 'Shows the real all-in numbers behind a home purchase.',
    link: 'https://d2d7tho10yuty7.cloudfront.net',
    type: 'webapp',
    icon: '🧮'
  },
  {
    title: 'PermitPulse',
    description: "Open Data Day datathon entry turning Sugar Land's building-permit data into a map of where the city is growing.",
    link: 'https://d3300qf46cmy2c.cloudfront.net',
    type: 'webapp',
    icon: '🏗️'
  },
  {
    title: 'Pump Log',
    description: 'Simple workout logging app for tracking lifts consistently, session to session.',
    link: 'https://dq0ag6mos5oil.cloudfront.net',
    type: 'webapp',
    icon: '🏋️‍♂️'
  },
  {
    title: 'Lena Health',
    description: 'Family health tracker for doctors, prescriptions, appointments, and care notes in one place.',
    link: '',
    type: 'webapp',
    icon: '🩺'
  },
  {
    title: 'Project Switcher',
    description: 'Tap an NFC tag and it opens the right VS Code window and Chrome tabs for that project automatically.',
    link: '',
    icon: '📲'
  }
]
