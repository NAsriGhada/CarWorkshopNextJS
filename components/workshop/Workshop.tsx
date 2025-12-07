"use client";

import { useState } from "react";
import {
  Wrench,
  ClipboardList,
  Users,
  Boxes,
  BarChart3,
  RefreshCcw,
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

type WorkshopTool = "orders" | "technicians" | "stock" | "kpi";

export default function WorkshopPage() {
  const [activeTool, setActiveTool] = useState<WorkshopTool>("orders");

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
          {/* Top header */}
          <h1>accessible by everyone except the client/customer</h1>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Internal • Workshop access only
          </p>

          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Workshop</h1>
          </div>

          <p className="max-w-xl text-sm text-muted-foreground">
            Central hub for daily workshop operations: orders, technicians,
            stock overview and KPIs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <span className="rounded-full border border-primary/50 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary">
            Live environment
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs font-medium"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Refresh data
          </Button>
        </div>
      </header>

      {/* Main layout: left menu + right content */}
      <section className="grid gap-6 md:grid-cols-[260px,1fr]">
        {/* Left: workshop menu */}
        <Card className="h-fit border-muted-foreground/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Workshop menu
            </CardTitle>
            <CardDescription className="text-xs">
              Quick access to internal workshop tools.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-1">
            <ToolButton
              icon={ClipboardList}
              label="Check orders"
              isActive={activeTool === "orders"}
              onClick={() => setActiveTool("orders")}
            />
            <ToolButton
              icon={Users}
              label="Technician follow-up"
              isActive={activeTool === "technicians"}
              onClick={() => setActiveTool("technicians")}
            />
            <ToolButton
              icon={Boxes}
              label="Parts in stock"
              isActive={activeTool === "stock"}
              onClick={() => setActiveTool("stock")}
            />
            <ToolButton
              icon={BarChart3}
              label="KPI workshop"
              isActive={activeTool === "kpi"}
              onClick={() => setActiveTool("kpi")}
            />
          </CardContent>
        </Card>

        {/* Right: main panel */}
        <Card className="border-dashed border-primary/20 bg-muted/40 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              <span>KPI workshop</span>
            </div>
            <Separator className="mt-2" />
          </CardHeader>

          <CardContent className="pt-4 text-sm">
            {activeTool === "orders" && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Check orders
                </h2>
                <p className="text-muted-foreground">
                  Overview of open work orders, their status, and priority. This
                  is your main workshop panel. Later you can plug in a data
                  table here.
                </p>

                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>Order number / VIN</li>
                  <li>Customer &amp; vehicle</li>
                  <li>Status (waiting parts, in progress, finished…)</li>
                  <li>Assigned technician</li>
                </ul>
              </div>
            )}

            {activeTool === "technicians" && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Technician follow-up
                </h2>
                <p className="text-muted-foreground">
                  Track technician workload, current jobs, and performance.
                  Later you could add per-technician KPIs and schedule planning.
                </p>
              </div>
            )}

            {activeTool === "stock" && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-primary" />
                  Parts in stock
                </h2>
                <p className="text-muted-foreground">
                  Quick overview of critical parts availability. In the future
                  this card can show low-stock alerts, suppliers and ETAs.
                </p>
              </div>
            )}

            {activeTool === "kpi" && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Workshop KPIs
                </h2>
                <p className="text-muted-foreground">
                  Placeholder for workshop performance metrics: throughput,
                  average repair time, first-time fix rate, etc.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Small helper for left nav buttons                             */
/* ────────────────────────────────────────────────────────────── */

type ToolButtonProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function ToolButton({ icon: Icon, label, isActive, onClick }: ToolButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className={`flex w-full items-center justify-start gap-2 rounded-lg border transition-all ${
        isActive
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60"
      }`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </Button>
  );
}
