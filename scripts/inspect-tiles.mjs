// Inventaire du fichier de carte (public/tiles/bzv.pmtiles) : couches, types de lieux (kind) et exemples de noms.
// node scripts/inspect-tiles.mjs [zoom]
import fs from "node:fs";
import { PMTiles } from "pmtiles";
import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";
import zlib from "node:zlib";

const buf = fs.readFileSync(new URL("../public/tiles/bzv.pmtiles", import.meta.url));
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const p = new PMTiles({ getKey: () => "f", getBytes: async (o, l) => ({ data: ab.slice(o, o + l) }) });
const z = Number(process.argv[2] || 14);
const tx = (lng) => Math.floor(((lng + 180) / 360) * 2 ** z);
const ty = (lat) => { const r = (lat * Math.PI) / 180; return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z); };
const stats = {};
for (let x = tx(15.2); x <= tx(15.32); x++) for (let y = ty(-4.2); y <= ty(-4.3); y++) {
  const t = await p.getZxy(z, x, y); if (!t) continue;
  let data = Buffer.from(t.data); if (data[0] === 0x1f) data = zlib.gunzipSync(data);
  const vt = new VectorTile(new Pbf(data));
  for (const [name, layer] of Object.entries(vt.layers)) for (let i = 0; i < layer.length; i++) {
    const f = layer.feature(i).properties; const k = `${name}:${f.kind}`;
    stats[k] = stats[k] || { n: 0, ex: new Set() }; stats[k].n++; if (f.name && stats[k].ex.size < 4) stats[k].ex.add(f.name);
  }
}
for (const [k, v] of Object.entries(stats).sort()) console.log(k.padEnd(34), String(v.n).padStart(5), [...v.ex].join(" | "));
