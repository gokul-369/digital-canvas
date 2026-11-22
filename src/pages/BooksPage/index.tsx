import BooksSection from "../../components/Books";
import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";

export default function BooksPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#03060f]">
      {/* Dynamic interactive ambient starfield & aurora background matching rest of site */}
      <InteractiveAmbient variant="home" />

      {/* 3D Interactive Books Showcase */}
      <BooksSection />
    </main>
  );
}
