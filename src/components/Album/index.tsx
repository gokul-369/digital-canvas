import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../SectionHeader";
import EditorialGallery from "../Gallery/EditorialGallery";

export default function Album() {
  const [isImmersive, setIsImmersive] = useState(false);

  return (
    <section
      className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 md:px-8 transition-all duration-500 overflow-hidden ${
        isImmersive ? "py-6" : "pt-20 pb-10"
      }`}
      id="album"
    >
      {/* Gallery Section Header with silky smooth collapse/expand */}
      <AnimatePresence initial={false}>
        {!isImmersive && (
          <motion.div
            key="gallery-section-header"
            initial={{ opacity: 0, height: 0, y: -20, scale: 0.98 }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
              scale: 1,
              transition: {
                height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.35, ease: "easeOut" },
                y: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -20,
              scale: 0.98,
              transition: {
                height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25, ease: "easeIn" },
                y: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="w-full flex justify-center overflow-hidden mb-4"
          >
            <SectionHeader
              tag="Visual Journal"
              title="Moments I chose to"
              accent="freeze in time"
              description="A 3D interactive collection of light, street, and compositions captured through 35mm and digital glass."
              className="mb-0"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-7xl flex flex-col justify-center">
        <EditorialGallery
          isImmersive={isImmersive}
          onToggleImmersive={() => setIsImmersive((prev) => !prev)}
        />
      </div>
    </section>
  );
}
