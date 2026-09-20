import BlackPanel from './components/BlackPanel'
import Caption from './components/Caption'
import Cursor from './components/Cursor'
import HeaderNav from './components/HeaderNav'
import Logo from './components/Logo'
import { OutroFooter, OutroOverlay } from './components/OutroLayers'
import ProductInfo from './components/ProductInfo'
import VideoBackground from './components/VideoBackground'
import ViewButton from './components/ViewButton'

/**
 * #scroll-spacer is the only thing that creates scroll height (500vh at first;
 * BlackPanel resizes it to vh + maxScroll + 2vh). Everything else is fixed.
 * Don't add transform/filter/isolation to it: that would break the
 * mix-blend-mode: exclusion overlays.
 */
export default function App() {
  return (
    <div id="scroll-spacer" className="relative h-[500vh] select-none bg-white lg:cursor-none">
      <Cursor />
      <Logo />
      <Caption />
      <HeaderNav />
      <ProductInfo />
      <ViewButton />
      <VideoBackground />
      <OutroOverlay />
      <OutroFooter />
      <BlackPanel />
    </div>
  )
}
