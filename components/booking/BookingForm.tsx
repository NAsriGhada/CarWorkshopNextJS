"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Loader2,
  ScanSearch,
  Calendar,
  Car,
  Hash,
  User,
  Info,
  MessageSquareText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/* =========================
   Helpers
========================= */

function normalizeVin(input: string) {
  return input.toUpperCase().replace(/\s+/g, "").trim();
}

function parseOptionalInt(
  raw: string,
  { min, max }: { min: number; max: number }
): number | undefined {
  const s = raw.trim();
  if (!s) return undefined;
  const n = Number(s);
  if (!Number.isFinite(n)) return undefined;
  const int = Math.trunc(n);
  if (int < min || int > max) return undefined;
  return int;
}

/* =========================
   Validation
========================= */

const vinSchema = z
  .string()
  .min(11, "VIN is usually 17 characters (some decoders accept 11+).")
  .max(17, "VIN can't be more than 17 characters.")
  .regex(
    /^[A-HJ-NPR-Z0-9]+$/i,
    "VIN can only contain letters/numbers (no I, O, Q)."
  );

// ✅ IMPORTANT: keep modelYear/year as (number | undefined) in Zod
const bookingSchema = z.object({
  aoNumber: z.string().min(2, "AO number is required").max(50),
  customerName: z.string().min(2, "Customer name is required").max(120),
  vin: vinSchema,

  modelYear: z.number().int().min(1980).max(2100).optional(),

  dateIn: z.string().optional(),

  // ✅ NEW: main field customer describes problem
  customerComplaint: z
    .string()
    .max(1500, "Please keep it under 1500 characters.")
    .optional(),

  vehicleInfo: z.string().optional(),

  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1980).max(2100).optional(),
  engine: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

type Props = {
  defaultValues?: Partial<BookingFormValues>;
  onSubmit: (values: BookingFormValues) => Promise<void> | void;

  onDecodeVin?: (
    vin: string,
    modelYear?: number
  ) => Promise<Partial<BookingFormValues>>;

  submitLabel?: string;
};

export function BookingForm({
  defaultValues,
  onSubmit,
  onDecodeVin,
  submitLabel = "Create booking",
}: Props) {
  const [decoding, setDecoding] = React.useState(false);
  const [decodeError, setDecodeError] = React.useState<string | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      aoNumber: "",
      customerName: "",
      vin: "",
      modelYear: undefined,
      dateIn: "",
      customerComplaint: "",
      vehicleInfo: "",
      make: "",
      model: "",
      year: undefined,
      engine: "",
      ...defaultValues,
    },
    mode: "onBlur",
  });

  const vinValue = form.watch("vin");
  const vinNormalized = normalizeVin(vinValue || "");
  const vinLen = vinNormalized.length;

  // ✅ typed patch helper (no any)
  function setPatch(patch: Partial<BookingFormValues>) {
    (Object.keys(patch) as (keyof BookingFormValues)[]).forEach((key) => {
      const value = patch[key];
      if (value !== undefined) {
        form.setValue(key, value, { shouldValidate: true, shouldDirty: true });
      }
    });
  }

  async function handleDecode() {
    if (!onDecodeVin) return;

    setDecodeError(null);

    const parsed = vinSchema.safeParse(vinNormalized);
    if (!parsed.success) {
      form.setError("vin", {
        type: "manual",
        message: parsed.error.issues[0]?.message ?? "Invalid VIN",
      });
      return;
    }

    setDecoding(true);
    try {
      const modelYear = form.getValues("modelYear");
      const patch = await onDecodeVin(vinNormalized, modelYear);
      setPatch(patch);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Could not decode VIN. Try again.";
      setDecodeError(msg);
    } finally {
      setDecoding(false);
    }
  }

  return (
    <Card className="border-muted/60">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              New booking (Work Order)
            </CardTitle>
            <CardDescription>
              Visitor enters vehicle details. Advisor can review/assign
              operations later.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="whitespace-nowrap">
            Visitor flow
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              values.vin = normalizeVin(values.vin);
              await onSubmit(values);
            })}
            className="space-y-6"
          >
            {/* Work order header */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="aoNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      AO number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="AO-000123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full name"
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ✅ NEW: customer complaint textarea */}
            <FormField
              control={form.control}
              name="customerComplaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4" />
                    Describe the issue (customer complaint)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Example: Engine noise when cold, vibration at 80km/h, check engine light, brakes squeal..."
                      className="resize-none"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    This helps the advisor + technician understand what the
                    customer experienced.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* VIN / vehicle info */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="17 characters (no spaces)"
                        {...field}
                        onChange={(e) =>
                          field.onChange(normalizeVin(e.target.value))
                        }
                        inputMode="text"
                        autoCapitalize="characters"
                      />
                    </FormControl>

                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" />
                        {vinLen}/17 characters
                      </span>
                      <span className={vinLen === 17 ? "text-foreground" : ""}>
                        Tip: paste VIN from registration card
                      </span>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model year + Decode */}
              <FormField
                control={form.control}
                name="modelYear"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Model year (optional)</FormLabel>

                    <div className="flex gap-2">
                      <FormControl className="flex-1">
                        <Input
                          placeholder="e.g. 2011"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const n = parseOptionalInt(e.target.value, {
                              min: 1980,
                              max: 2100,
                            });
                            field.onChange(n);
                          }}
                          inputMode="numeric"
                        />
                      </FormControl>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleDecode}
                        disabled={!onDecodeVin || decoding || vinLen < 11}
                        className="gap-2"
                      >
                        {decoding ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ScanSearch className="h-4 w-4" />
                        )}
                        Decode VIN
                      </Button>
                    </div>

                    <FormMessage />

                    {decodeError && (
                      <Alert variant="destructive">
                        <AlertDescription>{decodeError}</AlertDescription>
                      </Alert>
                    )}

                    {!onDecodeVin && (
                      <p className="text-xs text-muted-foreground">
                        Decoder not wired yet — we’ll connect this to your NHTSA
                        route next.
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="dateIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date in (optional)
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle info (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any additional notes (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Auto-filled preview */}
            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Decoded vehicle (preview)</p>
                <Badge variant="outline">auto</Badge>
              </div>

              <div className="mt-3 grid gap-4 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Make
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="—" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Model
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="—" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Year
                      </FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const n = parseOptionalInt(e.target.value, {
                              min: 1980,
                              max: 2100,
                            });
                            field.onChange(n);
                          }}
                          placeholder="—"
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="engine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Engine
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="—" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                You can still edit these if the decoder data is incomplete.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" className="gap-2">
                {submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
