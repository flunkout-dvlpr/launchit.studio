import { boot } from 'quasar/wrappers'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, MorphSVGPlugin)

export default boot(() => {})

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, MorphSVGPlugin }
