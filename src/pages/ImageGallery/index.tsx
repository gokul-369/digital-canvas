import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MovingGradient from "../../components/Backgrounds/MovingGradient";
import Album from "../../components/Album";
import useNavigateTop from "../../hooks/useNavigateToTop";

gsap.registerPlugin(ScrollTrigger);

function ImageGallery() {
  useNavigateTop();

  return (
    <section className="relative" id="gallery">
      <MovingGradient />
      <Album />
      <section
        id="demo"
        className="h-dvh flex items-center justify-center w-full"
      >
        hi
      </section>
    </section>
  );
}

export default ImageGallery;
