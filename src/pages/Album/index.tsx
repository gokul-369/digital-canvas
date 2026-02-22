import CircularGallery from "./Gallery";
import ak from "../../assets/Ak.png";

function Album() {
  return (
    <div className="w-dvw flex items-center justify-center h-dvh">
      <CircularGallery
        items={[
          ...Array(3)
            .fill(null)
            .map(() => ({
              image: ak,
              text: "",
            })),
        ]}
        scrollEase={0.06}
      />
    </div>
  );
}

export default Album;
