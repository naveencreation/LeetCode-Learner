"use client";

import DSASidebar from "@/components/DSASidebar";
import {
  sections,
  getProblemHref,
  getGuideHref,
  getPlatformLink,
  topicConfigurations,
  topicAccents,
  defaultAccent,
  type Accent,
} from "@/data/problems-data";

export {
  sections,
  getProblemHref,
  getGuideHref,
  getPlatformLink,
  topicConfigurations,
  topicAccents,
  defaultAccent,
  type Accent,
};

export default function ProblemsPage() {
  return <DSASidebar />;
}
