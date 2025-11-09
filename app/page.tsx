import Hero from "@/components/hero/Hero";
import PartnersSection from "@/components/partners/Partners";
import ServicesSection from "@/components/services/ServicesList";
import TestimonialsSection from "@/components/testimonials/Testimonials";
import WhyUsSection from "@/components/whyUs/WhyUs";

export default function Home() {
  
  return (
    <main className="">
      <Hero />
      <ServicesSection />
      <WhyUsSection />
      <PartnersSection />
      <TestimonialsSection/>
    </main>
  );
}
