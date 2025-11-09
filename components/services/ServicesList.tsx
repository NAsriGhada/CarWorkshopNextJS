import ServiceCard, { ServiceKey } from "./ServicesCard";

type ServiceItem = {
  icon: ServiceKey;
  title: string;
  description: string;
  href?: string;
};

const services: ServiceItem[] = [
  {
    icon: "oil",
    title: "Oil & Filter",
    description: "Full oil change with OEM filters and service reset.",
  },
  {
    icon: "brake",
    title: "Brake Service",
    description: "Pads, discs, and brake fluid check with warranty.",
  },
  {
    icon: "diagnostic",
    title: "Diagnostics",
    description: "Check engine lights, electrical faults, and coding.",
  },
  {
    icon: "tire",
    title: "Tires & Alignment",
    description: "Rotation, balancing, and 4-wheel alignment.",
  },
  {
    icon: "battery",
    title: "Battery & Start",
    description: "Battery testing, replacement, and starter inspection.",
  },
  {
    icon: "ac",
    title: "AC Service",
    description: "Leak test, recharge, and cabin filter replacement.",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="py-16 bg-muted border-t border-border"
    >
      <div className="container">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold">Our Services</h2>
          <p className="mt-2 text-[hsl(var(--color-muted-fore))]">
            Core maintenance and repairs for all major brands. Transparent
            pricing and fast turnaround.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
