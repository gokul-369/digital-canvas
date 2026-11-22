import { memo } from "react";
import { roleModelsData } from "../../data";
import InspirationPoster from "./InspirationCard";
import SectionHeader from "../SectionHeader";

function RoleModels() {
  return (
    <section
      id="rolemodels"
      className="py-24 px-6 lg:px-24 w-full flex flex-col items-center relative overflow-hidden"
    >
      <SectionHeader
        tag="Iconic Posters & Exhibition"
        title="Wall of Fame &"
        accent="minds that shape mine"
        description="Principles of design obsession, extreme discipline, visual storytelling, and non-linear architecture that govern how I engineer digital products."
        className="mb-14"
      />

      {/* The Monumental Wall of Fame Poster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {roleModelsData.map((item, index) => (
          <InspirationPoster key={item.name} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

export default memo(RoleModels);
