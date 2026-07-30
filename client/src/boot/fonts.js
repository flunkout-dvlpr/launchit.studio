// Self-hosted brand type — see /brand-identity.md at repo root.
// Space Grotesk: structural/technical (nav, labels, framework copy).
// Fraunces: personality/voice (headlines, pull quotes), incl. italic.
//
// Imported via relative disk path (not the bare package specifier) because
// this project's pinned Vite 2.9 can't resolve @fontsource's package.json
// `exports` wildcard patterns for deep subpaths like "/400.css".
import '../../node_modules/@fontsource/space-grotesk/400.css'
import '../../node_modules/@fontsource/space-grotesk/500.css'
import '../../node_modules/@fontsource/space-grotesk/600.css'
import '../../node_modules/@fontsource/fraunces/400.css'
import '../../node_modules/@fontsource/fraunces/600.css'
import '../../node_modules/@fontsource/fraunces/400-italic.css'
import '../../node_modules/@fontsource/fraunces/600-italic.css'
