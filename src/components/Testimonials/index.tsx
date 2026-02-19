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
      className="relative flex flex-col items-center justify-start min-h-dvh w-full lg:px-20 py-32 overflow-x-hidden"
    >
      <BlurText
        className="uppercase tracking-widest"
        delay={200}
        animateBy="tags"
        direction="top"
      >
        <p className={`${theme.textPrimary}`}> Voices from people </p>
        <span className={`${theme.textMainAccent1} ml-3`}>I’ve built with</span>
      </BlurText>
      <section className="mt-5 p-5 w-full flex-col flex flex-wrap gap-4">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 
    bg-gradient-to-r from-black via-black/60 to-transparent z-10"
        />

        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 
    bg-gradient-to-l from-black via-black/60 to-transparent z-10"
        />
        <ScrollingRow direction="left">
          {left.map((item) => (
            <TestimonialCard testimonial={item} />
          ))}
        </ScrollingRow>
        <ScrollingRow direction="right">
          {right.map((item) => (
            <TestimonialCard testimonial={item} />
          ))}
        </ScrollingRow>
      </section>
    </section>
  );
}

export default Testimonials;
