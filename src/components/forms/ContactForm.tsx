"use client";

import { useState } from "react";
import { ChoiceGroup } from "@/components/forms/Choice";
import { LeadForm } from "@/components/forms/LeadForm";

type Topic = "residential" | "commercial" | "repair" | "flat" | "other";

export function ContactForm() {
  const [topic, setTopic] = useState<Topic>("residential");
  return (
    <LeadForm
      source="contact"
      submitLabel="Schedule My Free Inspection"
      buildPayload={(contact) => ({ source: "contact", contact, topic })}
      extraFields={
        <ChoiceGroup legend="What do you need help with?" name="topic" columns={3} value={topic} onChange={setTopic}
          options={[{ value: "residential", label: "Home roof" }, { value: "commercial", label: "Commercial roof" }, { value: "repair", label: "Repair / leak" }, { value: "flat", label: "Flat roof" }, { value: "other", label: "Something else" }]} />
      }
    />
  );
}
