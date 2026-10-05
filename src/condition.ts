// US-02: condition scale, colours and map style. One place, so legend and map never disagree.
import type { PathOptions } from "leaflet";
import type { Condition, PipeFeature } from "./types";

export const CONDITION_SCALE: { score: Condition; label: string; color: string }[] = [
  { score: 1, label: "1 Good", color: "#1a9850" },
  { score: 2, label: "2 Fair", color: "#8bc34a" },
  { score: 3, label: "3 Moderate", color: "#f2c200" },
  { score: 4, label: "4 Poor", color: "#f57c00" },
  { score: 5, label: "5 Very poor", color: "#c62828" },
];

export const UNKNOWN_COLOR = "#6b7280";

export function pipeStyle(feature: PipeFeature, selected: boolean): PathOptions {
  const score = feature.properties.condition;
  const known = CONDITION_SCALE.find((c) => c.score === score);
  return {
    color: selected ? "#0b3954" : known?.color ?? UNKNOWN_COLOR,
    weight: selected ? 7 : 4,
    opacity: 0.95,
    // Unknown condition is dashed so it is never mistaken for "good" (US-02, acceptance criterion 2)
    dashArray: known ? undefined : "5 6",
    lineCap: "round",
  };
}
