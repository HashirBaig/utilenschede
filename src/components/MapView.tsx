// US-01: all pipe segments on a map. US-02: coloured by condition. US-04: click selects a pipe.
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { pipeStyle } from "../condition";
import type { PipeCollection, PipeFeature } from "../types";

interface Props {
  data: PipeCollection;
  selected: PipeFeature | null;
  onSelect: (feature: PipeFeature | null) => void;
}

export function MapView({ data, selected, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Build the map once per dataset. Canvas renderer keeps ~thousands of segments fast (NFR-03).
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, {
      renderer: L.canvas({ padding: 0.5, tolerance: 8 }),
    });
    const attributionKadaster = "Kaartgegevens &copy; Kadaster";
    const pdok = (theme: string) =>
      L.tileLayer(
        `https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/${theme}/EPSG:3857/{z}/{x}/{y}.png`,
        { attribution: attributionKadaster, maxZoom: 19 },
      );

    const baseLayers = {
      "PDOK grijs": pdok("grijs"),
      "PDOK standaard": pdok("standaard"),
      "PDOK pastel": pdok("pastel"),
      "CARTO licht": L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
          subdomains: "abcd",
          maxZoom: 20,
        },
      ),
    };
    baseLayers["PDOK pastel"].addTo(map); // default
    L.control
      .layers(baseLayers, undefined, { position: "topright" })
      .addTo(map);

    const layer = L.geoJSON(data, {
      bubblingMouseEvents: false,
      style: (f) => pipeStyle(f as PipeFeature, false),
      onEachFeature: (f, l) => {
        l.on("click", () => onSelectRef.current(f as PipeFeature));
        l.on("mouseover", () => {
          map.getContainer().style.cursor = "pointer";
        });
        l.on("mouseout", () => {
          map.getContainer().style.cursor = ""; // back to Leaflet's default grab cursor
        });
      },
    }).addTo(map);

    layerRef.current = layer;

    map.fitBounds(layer.getBounds(), { padding: [24, 24] });
    map.on("click", () => onSelectRef.current(null));

    return () => {
      map.remove();
      layerRef.current = null;
    };
  }, [data]);

  // Restyle only when the selection changes.
  useEffect(() => {
    layerRef.current?.eachLayer((l) => {
      const path = l as L.Path & { feature: PipeFeature };
      const isSelected = path.feature === selected;
      path.setStyle(pipeStyle(path.feature, isSelected));
      if (isSelected) path.bringToFront();
    });
  }, [selected]);

  return (
    <div
      ref={container}
      className="map"
      role="application"
      aria-label="Pipe network map"
    />
  );
}
