import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";
import Album from "../../components/Album";
import useNavigateTop from "../../hooks/useNavigateToTop";
import RoleModels from "../../components/RoleModels";

gsap.registerPlugin(ScrollTrigger);

function ImageGallery() {
  useNavigateTop();

  return (
    <section className="relative" id="gallery">
      <InteractiveAmbient variant="gallery" />
      <Album />
      <RoleModels />
    </section>
  );
}

export default ImageGallery;
