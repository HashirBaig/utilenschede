// US-04 (first version): attributes of the selected pipe. Missing values are shown as "missing", never blank.
import type { PipeFeature } from "../types";

const MATERIAL_LABEL: Record<string, string> = {
  cast_iron: "Cast iron", asbestos_cement: "Asbestos cement", steel: "Steel", pvc: "PVC", pe: "PE",
};

function Value({ value }: { value: string | number | null }) {
  return value === null || value === "" ? <span className="missing">missing</span> : <>{value}</>;
}

export function PipeDetail({ feature }: { feature: PipeFeature | null }) {
  if (!feature) {
    return (
      <section aria-labelledby="detail-title">
        <h2 id="detail-title">Pipe details</h2>
        <p className="hint">Select a pipe on the map to see its attributes.</p>
      </section>
    );
  }
  const p = feature.properties;
  return (
    <section aria-labelledby="detail-title">
      <h2 id="detail-title">Pipe details</h2>
      <dl className="detail">
        <dt>ID</dt><dd><Value value={p.id} /></dd>
        <dt>Material</dt><dd><Value value={p.material && (MATERIAL_LABEL[p.material] ?? p.material)} /></dd>
        <dt>Installed</dt><dd><Value value={p.installYear} /></dd>
        <dt>Diameter</dt><dd><Value value={p.diameterMm ? `${p.diameterMm} mm` : null} /></dd>
        <dt>Condition</dt><dd><Value value={p.condition} /></dd>
        <dt>Length</dt><dd>{p.lengthM} m</dd>
        <dt>Street class</dt><dd>{p.streetClass}</dd>
      </dl>
    </section>
  );
}
