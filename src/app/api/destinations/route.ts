import { NextRequest, NextResponse } from "next/server";

const DESTINATIONS = [
  "Croacia",
  "Ibiza",
  "Mallorca",
  "Menorca",
  "Cerdeña",
  "Grecia",
  "Islas Griegas",
  "Córcega",
  "Sicilia",
  "Malta",
  "Turquía",
  "Islas Baleares",
  "Islas Canarias",
  "Caribe",
  "Francia",
  "Italia",
  "Montenegro",
  "Eslovenia",
  "Tailandia",
  "Bahamas",
  "Seychelles",
  "Polinesia",
  "Australia",
  "Nueva Zelanda",
  "Brasil",
  "Estados Unidos",
  "México",
  "Cabo Verde",
  "Azores",
  "Madeira",
  "Islas Vírgenes",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const filtered = DESTINATIONS.filter((d) => d.toLowerCase().includes(q)).slice(0, 8);
  return NextResponse.json({ destinations: filtered });
} 