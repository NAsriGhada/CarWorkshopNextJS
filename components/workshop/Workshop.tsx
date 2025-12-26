// "use client";

// import { useState } from "react";
// import {
//   Wrench,
//   ClipboardList,
//   Users,
//   Boxes,
//   BarChart3,
//   RefreshCcw,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

// type WorkshopTool = "orders" | "technicians" | "stock" | "kpi";

// export default function WorkshopPage() {
//   const [activeTool, setActiveTool] = useState<WorkshopTool>("orders");

//   return (
//     <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
//           {/* Top header */}
//           <h1>accessible by everyone except the client/customer</h1>
//       <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//         <div className="space-y-1">
//           <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
//             Internal • Workshop access only
//           </p>

//           <div className="flex items-center gap-2">
//             <Wrench className="h-5 w-5 text-primary" />
//             <h1 className="text-2xl font-semibold tracking-tight">Workshop</h1>
//           </div>

//           <p className="max-w-xl text-sm text-muted-foreground">
//             Central hub for daily workshop operations: orders, technicians,
//             stock overview and KPIs.
//           </p>
//         </div>

//         <div className="flex items-center gap-2 self-start">
//           <span className="rounded-full border border-primary/50 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary">
//             Live environment
//           </span>
//           <Button
//             variant="outline"
//             size="sm"
//             className="gap-1 text-xs font-medium"
//           >
//             <RefreshCcw className="h-3.5 w-3.5" />
//             Refresh data
//           </Button>
//         </div>
//       </header>

//       {/* Main layout: left menu + right content */}
//       <section className="grid gap-6 md:grid-cols-[260px,1fr]">
//         {/* Left: workshop menu */}
//         <Card className="h-fit border-muted-foreground/20 shadow-sm">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-semibold">
//               Workshop menu
//             </CardTitle>
//             <CardDescription className="text-xs">
//               Quick access to internal workshop tools.
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-1">
//             <ToolButton
//               icon={ClipboardList}
//               label="Check orders"
//               isActive={activeTool === "orders"}
//               onClick={() => setActiveTool("orders")}
//             />
//             <ToolButton
//               icon={Users}
//               label="Technician follow-up"
//               isActive={activeTool === "technicians"}
//               onClick={() => setActiveTool("technicians")}
//             />
//             <ToolButton
//               icon={Boxes}
//               label="Parts in stock"
//               isActive={activeTool === "stock"}
//               onClick={() => setActiveTool("stock")}
//             />
//             <ToolButton
//               icon={BarChart3}
//               label="KPI workshop"
//               isActive={activeTool === "kpi"}
//               onClick={() => setActiveTool("kpi")}
//             />
//           </CardContent>
//         </Card>

//         {/* Right: main panel */}
//         <Card className="border-dashed border-primary/20 bg-muted/40 shadow-none">
//           <CardHeader className="pb-2">
//             <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//               <BarChart3 className="h-3.5 w-3.5 text-primary" />
//               <span>KPI workshop</span>
//             </div>
//             <Separator className="mt-2" />
//           </CardHeader>

//           <CardContent className="pt-4 text-sm">
//             {activeTool === "orders" && (
//               <div className="space-y-3">
//                 <h2 className="text-base font-semibold flex items-center gap-2">
//                   <ClipboardList className="h-4 w-4 text-primary" />
//                   Check orders
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Overview of open work orders, their status, and priority. This
//                   is your main workshop panel. Later you can plug in a data
//                   table here.
//                 </p>

//                 <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
//                   <li>Order number / VIN</li>
//                   <li>Customer &amp; vehicle</li>
//                   <li>Status (waiting parts, in progress, finished…)</li>
//                   <li>Assigned technician</li>
//                 </ul>
//               </div>
//             )}

//             {activeTool === "technicians" && (
//               <div className="space-y-3">
//                 <h2 className="text-base font-semibold flex items-center gap-2">
//                   <Users className="h-4 w-4 text-primary" />
//                   Technician follow-up
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Track technician workload, current jobs, and performance.
//                   Later you could add per-technician KPIs and schedule planning.
//                 </p>
//               </div>
//             )}

//             {activeTool === "stock" && (
//               <div className="space-y-3">
//                 <h2 className="text-base font-semibold flex items-center gap-2">
//                   <Boxes className="h-4 w-4 text-primary" />
//                   Parts in stock
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Quick overview of critical parts availability. In the future
//                   this card can show low-stock alerts, suppliers and ETAs.
//                 </p>
//               </div>
//             )}

//             {activeTool === "kpi" && (
//               <div className="space-y-3">
//                 <h2 className="text-base font-semibold flex items-center gap-2">
//                   <BarChart3 className="h-4 w-4 text-primary" />
//                   Workshop KPIs
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Placeholder for workshop performance metrics: throughput,
//                   average repair time, first-time fix rate, etc.
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </section>
//     </main>
//   );
// }

// /* ────────────────────────────────────────────────────────────── */
// /* Small helper for left nav buttons                             */
// /* ────────────────────────────────────────────────────────────── */

// type ToolButtonProps = {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
//   label: string;
//   isActive: boolean;
//   onClick: () => void;
// };

// function ToolButton({ icon: Icon, label, isActive, onClick }: ToolButtonProps) {
//   return (
//     <Button
//       variant={isActive ? "default" : "ghost"}
//       size="sm"
//       className={`flex w-full items-center justify-start gap-2 rounded-lg border transition-all ${
//         isActive
//           ? "border-primary bg-primary text-primary-foreground shadow-sm"
//           : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60"
//       }`}
//       onClick={onClick}
//     >
//       <Icon className="h-4 w-4" />
//       <span className="text-sm">{label}</span>
//     </Button>
//   );
// }


"use client";

import React, { useMemo, useState } from "react";
import {
  Wrench,
  ClipboardList,
  Users,
  Boxes,
  BarChart3,
  RefreshCcw,
  Plus,
  Search,
  Car,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type WorkshopTool = "orders" | "technicians" | "stock" | "kpi";

const TOOL_META: Record<
  WorkshopTool,
  {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    eyebrow: string;
    title: string;
    desc: string;
  }
> = {
  orders: {
    label: "Check orders",
    icon: ClipboardList,
    eyebrow: "Operations",
    title: "Work orders",
    desc: "Create, search and track work orders (AO). Later: VIN decode + statuses + assignments.",
  },
  technicians: {
    label: "Technician follow-up",
    icon: Users,
    eyebrow: "Operations",
    title: "Technicians",
    desc: "Track workload, time logs and current operations per technician.",
  },
  stock: {
    label: "Parts in stock",
    icon: Boxes,
    eyebrow: "Inventory",
    title: "Parts stock",
    desc: "Monitor parts usage and stock levels. Later: low-stock alerts + suppliers.",
  },
  kpi: {
    label: "KPI workshop",
    icon: BarChart3,
    eyebrow: "Analytics",
    title: "Workshop KPIs",
    desc: "Throughput, average repair time, technician utilization, and more.",
  },
};

export default function WorkshopPage() {
  const [activeTool, setActiveTool] = useState<WorkshopTool>("orders");
  const [search, setSearch] = useState("");

  const meta = TOOL_META[activeTool];
  const ActiveIcon = meta.icon;

  // Fake KPI tiles (UI only)
  const kpiTiles = useMemo(
    () => [
      { label: "Open work orders", value: "—", icon: AlertTriangle },
      { label: "In progress", value: "—", icon: Timer },
      { label: "Completed today", value: "—", icon: CheckCircle2 },
    ],
    []
  );

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      {/* Top bar */}
      <header className="flex flex-col gap-4">
        {/* Breadcrumb + actions row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Dashboard</span>
            <span className="opacity-60">/</span>
            <span className="font-medium">Workshop</span>
            <Badge variant="secondary" className="ml-2">
              Internal access only
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/50 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary">
              Live environment
            </span>

            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Title block */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Workshop</h1>
            <Badge variant="outline" className="ml-1">
              internal staff portal
            </Badge>
          </div>

          <p className="max-w-2xl text-sm text-muted-foreground">
            Central hub for daily workshop operations: orders, technicians,
            stock and KPIs.
          </p>
        </div>

        {/* Quick Actions */}
        <section className="grid gap-3 md:grid-cols-4">
          <QuickAction
            title="Create work order"
            desc="Start with AO + VIN"
            icon={Plus}
            badge="Next"
            onClick={() => setActiveTool("orders")}
          />
          <QuickAction
            title="VIN decode"
            desc="Auto-fill vehicle data"
            icon={Car}
            badge="Later"
            onClick={() => setActiveTool("orders")}
          />
          <QuickAction
            title="Add technician"
            desc="Create or edit profiles"
            icon={Users}
            badge="Later"
            onClick={() => setActiveTool("technicians")}
          />
          <QuickAction
            title="Add part"
            desc="Manage inventory list"
            icon={Boxes}
            badge="Later"
            onClick={() => setActiveTool("stock")}
          />
        </section>
      </header>

      {/* Main layout */}
      <section className="grid gap-6 md:grid-cols-[280px,1fr]">
        {/* Left menu */}
        <Card className="h-fit border-muted-foreground/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Workshop menu
            </CardTitle>
            <CardDescription className="text-xs">
              Quick access to internal tools.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Operations
              </p>
              <ToolButton
                icon={ClipboardList}
                label={TOOL_META.orders.label}
                isActive={activeTool === "orders"}
                onClick={() => setActiveTool("orders")}
              />
              <ToolButton
                icon={Users}
                label={TOOL_META.technicians.label}
                isActive={activeTool === "technicians"}
                onClick={() => setActiveTool("technicians")}
              />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Inventory
              </p>
              <ToolButton
                icon={Boxes}
                label={TOOL_META.stock.label}
                isActive={activeTool === "stock"}
                onClick={() => setActiveTool("stock")}
              />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Analytics
              </p>
              <ToolButton
                icon={BarChart3}
                label={TOOL_META.kpi.label}
                isActive={activeTool === "kpi"}
                onClick={() => setActiveTool("kpi")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Right content */}
        <Card className="border-muted-foreground/20 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {meta.eyebrow}
                </p>
                <div className="flex items-center gap-2">
                  <ActiveIcon className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{meta.title}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {meta.desc}
                </CardDescription>
              </div>

              {/* Context actions */}
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      activeTool === "orders"
                        ? "Search AO / VIN / customer..."
                        : activeTool === "technicians"
                        ? "Search technician..."
                        : activeTool === "stock"
                        ? "Search parts..."
                        : "Search KPIs..."
                    }
                    className="pl-9"
                  />
                </div>

                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {activeTool === "orders"
                    ? "New AO"
                    : activeTool === "technicians"
                    ? "New tech"
                    : activeTool === "stock"
                    ? "New part"
                    : "New report"}
                </Button>
              </div>
            </div>

            <Separator className="mt-3" />
          </CardHeader>

          <CardContent className="pt-4">
            {/* TOOL PANELS */}
            {activeTool === "orders" && (
              <div className="space-y-5">
                <div className="grid gap-3 md:grid-cols-3">
                  {kpiTiles.map((t) => (
                    <MiniStat
                      key={t.label}
                      label={t.label}
                      value={t.value}
                      icon={t.icon}
                    />
                  ))}
                </div>

                <EmptyPanel
                  title="No work orders yet"
                  desc="Create your first AO. Later you’ll decode VIN to auto-fill make/model/year."
                  primaryLabel="Create work order"
                  onPrimary={() => {}}
                  secondaryLabel="VIN decode (later)"
                  onSecondary={() => {}}
                />

                <HintCard
                  title="Planned flow (soon)"
                  bullets={[
                    "Create AO → enter customer + VIN",
                    "Decode VIN → fill make/model/year (API)",
                    "Add operations (your ‘jobs’) + assign technician",
                    "Add parts usage + start/stop time logs",
                  ]}
                />
              </div>
            )}

            {activeTool === "technicians" && (
              <div className="space-y-5">
                <EmptyPanel
                  title="No technicians yet"
                  desc="Add technicians to track workload and time logs."
                  primaryLabel="Add technician"
                  onPrimary={() => {}}
                  secondaryLabel="See planned KPIs"
                  onSecondary={() => setActiveTool("kpi")}
                />

                <HintCard
                  title="What you’ll track"
                  bullets={[
                    "Tech code + name",
                    "Active operations",
                    "Time log totals per day/week",
                    "Utilization and performance KPIs",
                  ]}
                />
              </div>
            )}

            {activeTool === "stock" && (
              <div className="space-y-5">
                <EmptyPanel
                  title="No parts in inventory yet"
                  desc="Add parts to start tracking usage per operation."
                  primaryLabel="Add part"
                  onPrimary={() => {}}
                  secondaryLabel="Go to orders"
                  onSecondary={() => setActiveTool("orders")}
                />

                <HintCard
                  title="Later improvements"
                  bullets={[
                    "Stock quantity + thresholds",
                    "Low-stock alerts",
                    "Supplier + ETA",
                    "Usage history per part",
                  ]}
                />
              </div>
            )}

            {activeTool === "kpi" && (
              <div className="space-y-5">
                <div className="grid gap-3 md:grid-cols-3">
                  {kpiTiles.map((t) => (
                    <MiniStat
                      key={t.label}
                      label={t.label}
                      value={t.value}
                      icon={t.icon}
                    />
                  ))}
                </div>

                <EmptyPanel
                  title="KPIs will appear here"
                  desc="Once operations + time logs exist, you’ll compute throughput and average repair time."
                  primaryLabel="Go create AO"
                  onPrimary={() => setActiveTool("orders")}
                  secondaryLabel="Technicians"
                  onSecondary={() => setActiveTool("technicians")}
                />

                <Card className="border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      KPI ideas (based on your drawings)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      These align with “Tech Time” and “Customer Time”.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Average Tech Time per operation</li>
                      <li>Average Customer Minutes per operation</li>
                      <li>Work orders completed per day</li>
                      <li>Top parts consumed</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Components                                                     */
/* ────────────────────────────────────────────────────────────── */

function ToolButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className={[
        "flex w-full items-center justify-start gap-2 rounded-lg border transition-all",
        isActive
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60",
      ].join(" ")}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </Button>
  );
}

function QuickAction({
  title,
  desc,
  icon: Icon,
  badge,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-xl border border-muted-foreground/20 bg-background p-4 text-left shadow-sm transition hover:-translate-y-px hover:border-primary/30 hover:shadow"
      type="button"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-muted-foreground/20 bg-muted/40 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold leading-none">{title}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </div>

        {badge ? (
          <span className="rounded-full border border-muted-foreground/20 bg-muted/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="group-hover:text-foreground">Open</span>
        <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
      </div>
    </button>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <Card className="border-muted-foreground/20">
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
        <span className="rounded-lg border border-muted-foreground/20 bg-muted/40 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </span>
      </CardContent>
    </Card>
  );
}

function EmptyPanel({
  title,
  desc,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: {
  title: string;
  desc: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <Card className="border-dashed border-primary/20 bg-muted/30 shadow-none">
      <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="sm" className="gap-2" onClick={onPrimary}>
            <Plus className="h-4 w-4" />
            {primaryLabel}
          </Button>
          <Button variant="outline" size="sm" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function HintCard({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <Card className="border-muted-foreground/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">
          UI now, logic later — but the structure is ready.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <ul className="list-disc space-y-1 pl-5">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
