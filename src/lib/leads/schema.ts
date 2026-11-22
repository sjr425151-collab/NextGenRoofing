import { z } from "zod";
import { estimateInput } from "@/lib/estimator/schema";

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[^\d]/g, ""))
  .refine((d) => d.length === 10 || (d.length === 11 && d.startsWith("1")), "Enter a 10-digit phone number");

export const contactFields = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone,
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  address: z.string().trim().max(200).optional().default(""),
  preferredContact: z.enum(["phone", "text", "email"]),
  notes: z.string().trim().max(2000).optional().default(""),
});

export const leadPayload = z.discriminatedUnion("source", [
  z.object({
    source: z.literal("estimator"),
    contact: contactFields.extend({ address: z.string().trim().min(5, "Enter the property address").max(200) }),
    estimate: estimateInput,
    issues: z.array(z.string().max(60)).max(10).optional().default([]),
  }),
  z.object({
    source: z.literal("contact"),
    contact: contactFields,
    topic: z.enum(["residential", "commercial", "repair", "flat", "other"]).default("other"),
  }),
]);

/** Anti-abuse fields sent alongside the payload; never stored. */
export const antiAbuse = z.object({
  website: z.string().max(0, "spam").optional().default(""), // honeypot — must stay empty
  startedAt: z.number().int().positive(),
  turnstileToken: z.string().max(4096).optional(),
});

export const leadRequest = z.object({ payload: leadPayload, guard: antiAbuse });

export type LeadPayload = z.infer<typeof leadPayload>;
export type LeadRequest = z.infer<typeof leadRequest>;
