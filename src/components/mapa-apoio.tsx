import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { CORUMBA_CENTER, type LocalApoio } from "@/data/locais";

// Build colored divIcons (avoid the broken default marker assets in bundlers)
function makeIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 28px; height: 28px;
      border-radius: 50% 50% 50% 0;
      background: ${color};
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -26],
  });
}

const ICONS = {
  online: makeIcon("oklch(0.55 0.14 245)"),
  publica: makeIcon("oklch(0.55 0.13 175)"),
};

type Ponto = LocalApoio & { lat: number; lng: number };

function FitBounds({ pontos }: { pontos: Ponto[] }) {
  const map = useMap();
  useEffect(() => {
    if (pontos.length === 0) {
      map.setView(CORUMBA_CENTER, 13);
      return;
    }
    if (pontos.length === 1) {
      map.setView([pontos[0].lat, pontos[0].lng], 15);
      return;
    }
    map.fitBounds(
      L.latLngBounds(pontos.map((p) => [p.lat, p.lng] as [number, number])),
      { padding: [40, 40] },
    );
  }, [pontos, map]);
  return null;
}

export default function MapaApoio({ locais }: { locais: LocalApoio[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="h-[320px] w-full animate-pulse rounded-2xl bg-secondary" />;
  }

  const pontos = locais.filter(
    (l): l is Ponto => typeof l.lat === "number" && typeof l.lng === "number",
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
      <MapContainer
        center={CORUMBA_CENTER}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: 320, width: "100%" }}
      >
        <FitBounds pontos={pontos} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pontos.map((l) => (
          <Marker key={l.id} position={[l.lat, l.lng]} icon={ICONS[l.categoria]}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{l.nome}</strong>
                <div style={{ fontSize: 12, marginTop: 4 }}>{l.endereco}</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>📞 {l.telefone}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
