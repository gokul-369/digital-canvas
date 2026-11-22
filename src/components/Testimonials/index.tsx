import ScrollingRow from "../../animations/Scroller";
import { testimonials } from "../../data";
import { divideArray } from "../../utils/divideArray";
import TestimonialCard from "./TestimonialCard";
import SectionHeader from "../SectionHeader";

function Testimonials() {
  const testimonialData = testimonials;
  const [right, left] = divideArray(testimonialData);

  return (
    <section
      id="testimonials"
      className="relative flex flex-col items-center 
                 min-h-dvh w-full py-10 md:py-32"
    >
      <div className="w-full lg:px-20 px-8 flex flex-col items-center">
        <SectionHeader
          tag="Words & Perspectives"
          title="Voices from people"
          accent="I’ve built with"
          description="Unfiltered feedback and recommendations from colleagues, engineering leads, and teammates."
        />
      </div>

      <div className="mt-16 flex flex-col w-full">
        <ScrollingRow direction="left">
          {left.map((item, index) => (
            <TestimonialCard key={index} testimonial={item} />
          ))}
        </ScrollingRow>

        <ScrollingRow direction="right">
          {right.map((item, index) => (
            <TestimonialCard key={index} testimonial={item} />
          ))}
        </ScrollingRow>
      </div>
    </section>
  );
}

export default Testimonials;
