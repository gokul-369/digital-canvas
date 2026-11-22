import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";
import BooksSection from "../../components/Books";

export default function BooksPage() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden pt-12 pb-24">
      {/* Dynamic Cosmic Ambient Background */}
      <InteractiveAmbient variant="home" />

      {/* 3D Interactive Books Showcase */}
      <BooksSection />
    </main>
  );
}
