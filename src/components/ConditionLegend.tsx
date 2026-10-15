// US-02: legend with counts, including an explicit "not scored" entry.
import { CONDITION_SCALE, UNKNOWN_COLOR } from "../condition";
import type { PipeFeature } from "../types";

export function ConditionLegend({ features }: { features: PipeFeature[] }) {
  const count = (score: number | null) =>
    features.filter((f) => f.properties.condition === score).length;
  return (
    <section aria-labelledby="legend-title">
      <h2 id="legend-title">Condition</h2>
      <ul className="legend">
        {CONDITION_SCALE.map((c) => (
          <li key={c.score}>
            <span className="swatch" style={{ background: c.color }} />
            <span>{c.label}</span>
            <span className="count">{count(c.score)}</span>
          </li>
        ))}
        <li>
          <span
            className="swatch unknown"
            style={{ borderColor: UNKNOWN_COLOR }}
          />
          <span>Not scored</span>
          <span className="count">{count(null)}</span>
        </li>
      </ul>
    </section>
  );
}
