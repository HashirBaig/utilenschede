import type { Feature, FeatureCollection, LineString } from "geojson";

export type Material = "cast_iron" | "asbestos_cement" | "steel" | "pvc" | "pe";
export type Condition = 1 | 2 | 3 | 4 | 5;

// Values can be null on purpose: missing data is what the data-quality layer (US-10) will detect.
export interface PipeProps {
  id: string;
  material: Material | null;
  installYear: number | null;
  diameterMm: number | null;
  condition: Condition | null;
  streetClass: string;
  lengthM: number;
}

export type PipeFeature = Feature<LineString, PipeProps>;
export type PipeCollection = FeatureCollection<LineString, PipeProps> & {
  metadata: { title: string; notice: string; streetSource: string; seed: number; referenceYear: number; segmentCount: number };
};
