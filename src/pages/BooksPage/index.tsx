import BooksSection from "../../components/Books";
import InteractiveAmbient from "../../components/Backgrounds/InteractiveAmbient";

export default function BooksPage() {
  return (
    <main className="relative w-full min-h-screen">
      {/* Dynamic interactive ambient starfield & aurora background matching rest of site */}
      <InteractiveAmbient variant="books" />

      {/* 3D Interactive Books Showcase */}
      <BooksSection />
    </main>
  );
}
