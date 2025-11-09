"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import TestimonialCard from "./TestimonialCard";
import { useRef } from "react";

export default function TestimonialsSection() {
  // Create a ref to store the plugin instance
  const autoplay = useRef(
    Autoplay({
      delay: 3500, // ⏱ how long each slide stays (in ms)
      stopOnInteraction: false, // keeps autoplay even when user interacts
      stopOnMouseEnter: true, // pauses when hovering
    })
  );

  return (
    <section className="py-16 border-t border-border bg-bg">
      <div className="container">
        <div className="max-w-2xl">
          <span className="inline-block mb-3 px-3 py-1 rounded-full bg-accent text-accent-fore text-xs font-medium">
            Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold">
            What drivers say about us
          </h2>
        </div>

        <Carousel
          className="relative mt-8"
          opts={{
            loop: true, // 🔁 enable looping
          }}
          plugins={[autoplay.current]} // 🎬 add autoplay plugin
        >
          <CarouselContent>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <TestimonialCard
                quote="Fast, honest, and fairly priced."
                name="Eirik S."
                role="VW Golf owner"
                rating={5}
              />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <TestimonialCard
                quote="Fast, honest, and fairly priced."
                name="Eirik S."
                role="VW Golf owner"
                rating={5}
              />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <TestimonialCard
                quote="Fast, honest, and fairly priced."
                name="Eirik S."
                role="VW Golf owner"
                rating={5}
              />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <TestimonialCard
                quote="Great service and communication!"
                name="Hanna R."
                role="Toyota Corolla owner"
                rating={5}
              />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <TestimonialCard
                quote="Picked up same day. Very satisfied."
                name="Martin L."
                role="BMW 3 Series owner"
                rating={5}
              />
            </CarouselItem>
          </CarouselContent>

          {/* visible arrows */}
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
