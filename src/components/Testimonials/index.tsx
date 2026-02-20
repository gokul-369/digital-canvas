import BlurText from "../../animations/Text/BlurText";
import { type ThemeClassSet } from "../../types";
import ScrollingRow from "../../animations/Scroller";
import { testimonials } from "../../data";
import { divideArray } from "../../utils/divideArray";
import TestimonialCard from "./TestimonialCard";

function Testimonials({ theme }: { theme: ThemeClassSet }) {
  const testimonialData = testimonials;
  const [right, left] = divideArray(testimonialData);
  return (
    <section
      id="testimonials"
      className="relative flex flex-col items-center justify-start min-h-dvh w-full lg:px-20 px-8 py-32 overflow-x-hidden"
    >
      <BlurText
        className="uppercase text-center tracking-widest"
        delay={200}
        animateBy="tags"
        direction="top"
      >
        <p className={`${theme.textPrimary}`}> Voices from people </p>
        <span className={`${theme.textMainAccent1} ml-3`}>I’ve built with</span>
      </BlurText>
      <section className="mt-10 p-5 w-full flex-col flex flex-wrap gap-4">
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
      </section>
    </section>
  );
}

export default Testimonials;
