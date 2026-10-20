// Builds the phone + city figure for the About page.
// Run `node figures/phone-city/build.mjs` (add `--audit` to prove the
// geometry). It writes src/figures/phone-city/art.ts: the static drawing as a
// string, plus what the live component needs to draw the cars and people:
// the camera, every route, and the box of every static item so movers can be
// slotted into the painter's order each frame.
//
// The idea: a road leaves the city and runs straight into the phone's screen.
// Cars and people go in through the glass, carry on as marks on the phone's
// map of the same city, and come back out.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../iso/iso-kit.mjs";
import * as G from "../iso/lathe.mjs";
import * as A from "../iso/audit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../src/figures/phone-city/art.ts");

const WIDTH = 600;
const HEIGHT = 398;

// World: 1 unit = 1 m of city. x runs left to right, y toward the viewer.
const PLATE = { x: -172, y: -86, w: 310, d: 166, r: 9 };
const PLATE_H = 9;
const FOOT_H = 5;

const TILE = { x: -160, y: -72, w: 170, d: 130, r: 4 };
const ROAD_Z = 2.4;
const CURB_H = 1.6;
const BLOCK_Z = ROAD_Z + CURB_H;
const FLOOR = 4;

// Four blocks between a ring road and two cross streets, each road 10 wide.
const BLOCKS = {
  tower: { x: -150, y: -62, w: 70, d: 50, r: 3 },
  offices: { x: -70, y: -62, w: 70, d: 50, r: 3 },
  park: { x: -150, y: -2, w: 70, d: 50, r: 3 },
  shops: { x: -70, y: -2, w: 70, d: 50, r: 3 },
};

const BUILDINGS = [
  { id: "tower", plan: { x: -144, y: -56, w: 30, d: 28, r: 1.5 }, h: 76, mullion: 5 },
  { id: "annex", plan: { x: -106, y: -52, w: 20, d: 32, r: 1.5 }, h: 32, mullion: 5 },
  { id: "office", plan: { x: -64, y: -57, w: 26, d: 22, r: 1.5 }, h: 52, mullion: 4.4 },
  { id: "hall", plan: { x: -31, y: -54, w: 25, d: 36, r: 1.5 }, h: 40, mullion: 5 },
  { id: "store", plan: { x: -64, y: 4, w: 28, d: 20, r: 1.5 }, h: 20, mullion: 7 },
  { id: "flats", plan: { x: -29, y: 6, w: 23, d: 36, r: 1.5 }, h: 28, mullion: 5.75 },
  { id: "kiosk", plan: { x: -62, y: 31, w: 14, d: 11, r: 1.2 }, h: 8, mullion: 0 },
];

// The phone stands on a plaza level with the road, screen toward the viewer.
// Its glass starts just above the road, so the road runs into the screen.
const PHONE = { x: 52, w: 64, z0: ROAD_Z, h: 136, r: 8, back: -4, front: 4 };
const PHONE_TOP = PHONE.z0 + PHONE.h;
const SCREEN = { x0: PHONE.x + 2.4, x1: PHONE.x + PHONE.w - 2.4, z0: PHONE.z0 + 1.2, z1: PHONE_TOP - 2.4, r: 6 };
const PLAZA = { x: 40, y: -24, w: 84, d: 44 };
const ROAD_X = [79, 89];
const ROAD_MID = (ROAD_X[0] + ROAD_X[1]) / 2;

// The ground: the city tile, a road east along the front and north to the
// phone, and the plaza the phone stands on, as one outline.
const GROUND = [
  [TILE.x, TILE.y], [TILE.x + TILE.w, TILE.y], [TILE.x + TILE.w, 48], [ROAD_X[0], 48], [ROAD_X[0], PLAZA.y + PLAZA.d],
  [PLAZA.x, PLAZA.y + PLAZA.d], [PLAZA.x, PLAZA.y], [PLAZA.x + PLAZA.w, PLAZA.y], [PLAZA.x + PLAZA.w, PLAZA.y + PLAZA.d],
  [ROAD_X[1], PLAZA.y + PLAZA.d], [ROAD_X[1], TILE.y + TILE.d], [TILE.x, TILE.y + TILE.d],
];

// The phone's map shows the whole tile, north up, edge to edge across the
// screen. Under it the road climbs the screen, narrowing into the map's cross street.
const MAP_SCALE = (SCREEN.x1 - SCREEN.x0) / TILE.w;
const MAP_TOP = 118;
const MAP_BOTTOM = MAP_TOP - TILE.d * MAP_SCALE;
const mapPoint = (x, y) => [SCREEN.x0 + (x - TILE.x) * MAP_SCALE, -MAP_TOP + (y - TILE.y) * MAP_SCALE];
const mapU = (x) => SCREEN.x0 + (x - TILE.x) * MAP_SCALE;
// On the climbing road a point at height z is drawn at this scale (1 at the
// glass edge, the map's scale where it meets the map).
const climb = (z) => 1 + (MAP_SCALE - 1) * ((z - SCREEN.z0) / (MAP_BOTTOM - SCREEN.z0));
// A world x on the plaza, carried up the screen to the map edge.
const climbU = (x, z) => {
  const t = (z - SCREEN.z0) / (MAP_BOTTOM - SCREEN.z0);
  return x + (mapU(x - ROAD_MID + -75) - x) * t;
};

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...k.boxCorners({ x: PHONE.x, y: PHONE.back, w: PHONE.w, d: PHONE.front - PHONE.back, r: 0 }, PHONE.z0, PHONE_TOP),
    ...k.boxCorners(BUILDINGS[0].plan, 0, BLOCK_Z + BUILDINGS[0].h + 24),
  ],
  WIDTH,
  HEIGHT,
  { pad: 6, azimuth: 56 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flat = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const quad = (points) => k.pathOf(points.map(at), true);
const f1 = (n) => Math.round(n * 10) / 10;
const f2 = (n) => Math.round(n * 100) / 100;

const R = A.recorder(P);

// ---------------------------------------------------------------- base plate
function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  R.solid(A.slab(PLATE, -PLATE_H, PLATE_H, { name: "stand.plate" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));

  // A scale strip in metres under the city: a tick every 5 m, a major every 25 m.
  const strip = { x: TILE.x, y: 64, w: TILE.w, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.x + 5, strip.x + strip.w - 5, 5, 5, strip.y + 0.8, 0.6, [1.6, 3.2], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));

  // Label plate with three rule lines and two screws.
  const label = { x: 44, y: 63, w: 46, d: 11, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
  out.push(L([30, 22, 26].map((w, i) => k.lineOnTop([label.x + 6, label.y + 3 + i * 2.6], [label.x + 6 + w, label.y + 3 + i * 2.6], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + 3, label.y + label.d / 2, 0.8]), at([label.x + label.w - 3, label.y + label.d / 2, 0.8])], { size: 0.45 }));
  return out.join("");
}

// -------------------------------------------------------------- city ground
function ground() {
  const out = [];
  out.push(S(k.extrude(GROUND, 0, ROAD_Z, P, { convex: false, bevel: 0.6 }), { tone: "lo" }));
  R.solid(A.extruded(GROUND, 0, ROAD_Z, { name: "stand.ground" }));
  // Centre line of the ring road, a closed dashed loop; the cross streets'
  // centre lines run from one side of the ring to the other.
  const ring = { x: TILE.x + 5, y: TILE.y + 5, w: TILE.w - 10, d: TILE.d - 10, r: 5 };
  out.push(L(k.planOutline(ring, ROAD_Z, P, 6), { tone: "lo", dashed: true }));
  out.push(L(k.lineOnTop([-75, ring.y], [-75, ring.y + ring.d], ROAD_Z, P) + k.lineOnTop([ring.x, -7], [ring.x + ring.w, -7], ROAD_Z, P), { tone: "lo", dashed: true }));
  // The phone road's centre line: from the ring along the front, then north
  // across the plaza until it meets the glass.
  out.push(L(k.onTop([[2, 53], [ROAD_MID - 5, 53], [ROAD_MID, 48], [ROAD_MID, PHONE.front]], ROAD_Z, P), { tone: "lo", dashed: true }));
  // Zebra crossings where the cross streets leave the ring.
  const zebra = [];
  for (const y of [-60, 40.5]) for (let i = 0; i < 4; i++) zebra.push(k.planOutline({ x: -79.2 + i * 2.4, y, w: 1.2, d: 7.5, r: 0.3 }, ROAD_Z, P, 2));
  for (const x of [-148, -7.5]) for (let i = 0; i < 4; i++) zebra.push(k.planOutline({ x, y: -11.2 + i * 2.4, w: 7.5, d: 1.2, r: 0.3 }, ROAD_Z, P, 2));
  out.push(L(zebra.join(""), { tone: "faint" }));
  // The plaza: kerb lines either side of the road and paving joints on the walks.
  const kerb = [ROAD_X[0], ROAD_X[1]].map((x) => k.lineOnTop([x, PHONE.front], [x, PLAZA.y + PLAZA.d], ROAD_Z, P)).join("");
  const joints = [];
  for (const [x0, x1] of [[PLAZA.x, ROAD_X[0]], [ROAD_X[1], PLAZA.x + PLAZA.w]]) for (const y of [8, 12, 16]) joints.push(k.lineOnTop([x0, y], [x1, y], ROAD_Z, P));
  out.push(L(kerb, { tone: "lo" }), L(joints.join(""), { tone: "faint" }));
  // The slot the phone stands in, and screws at the plaza's back corners.
  out.push(L(k.planOutline({ x: PHONE.x - 1.6, y: PHONE.back - 7.6, w: PHONE.w + 3.2, d: PHONE.front - PHONE.back + 7.6, r: 1.6 }, ROAD_Z, P, 3), { tone: "lo" }));
  out.push(D([at([PLAZA.x + 4, PLAZA.y + 4, ROAD_Z]), at([PLAZA.x + PLAZA.w - 4, PLAZA.y + 4, ROAD_Z])], { size: 0.5 }));
  return out.join("");
}

// ------------------------------------------------------------ city items
// Every item goes into the recorder; the audit settles their order. Each item
// also keeps its world box, so the live code can slot movers between them.
function put(name, centre, svg, shapes) {
  R.put({ name, at: centre, svg, shapes: shapes.map((shape) => R.solid(shape)) });
}

function curbs() {
  for (const [name, plan] of Object.entries(BLOCKS)) {
    const inner = name === "park" ? L(k.planOutline(k.insetPlan(plan, 4), BLOCK_Z, P, 4), { tone: "faint" }) : "";
    let svg = S(k.slabOf(plan, ROAD_Z, CURB_H, P, 4, 0.4), { tone: "mid" }) + inner;
    if (name === "park") svg += parkPaths(plan);
    put(`block.${name}`, [plan.x + plan.w / 2, plan.y + plan.d / 2, ROAD_Z], svg, [A.slab(plan, ROAD_Z, CURB_H, { name: `block.${name}` })]);
  }
}

const POND = { x: -115, y: 23, r: 6 };
function parkPaths(plan) {
  const lawn = k.insetPlan(plan, 4);
  const { x: cx, y: cy } = POND;
  const pond = k.ring(cx, cy, POND.r, BLOCK_Z, P, 40) + k.ring(cx, cy, POND.r - 1.6, BLOCK_Z, P, 40) + k.ring(cx, cy, 10, BLOCK_Z, P, 48);
  const path = [
    k.lineOnTop([lawn.x, cy - 1.4], [cx - 10, cy - 1.4], BLOCK_Z, P),
    k.lineOnTop([lawn.x, cy + 1.4], [cx - 10, cy + 1.4], BLOCK_Z, P),
    k.lineOnTop([cx + 10, cy - 1.4], [lawn.x + lawn.w, cy - 1.4], BLOCK_Z, P),
    k.lineOnTop([cx + 10, cy + 1.4], [lawn.x + lawn.w, cy + 1.4], BLOCK_Z, P),
  ].join("");
  return L(pond, { tone: "lo" }) + L(path, { tone: "faint" });
}

// A building: a slab with a floor seam every 4 m round its visible sides,
// mullions that run full height on the two faces you see, and a roof groove.
function building(b, index) {
  const { plan, h } = b;
  const z0 = BLOCK_Z;
  const z1 = z0 + h;
  const seams = [];
  for (let z = z0 + FLOOR; z < z1 - 0.5; z += FLOOR) seams.push(k.sideSeam(plan, z, P, 2));
  const mullions = [];
  if (b.mullion) {
    const front = plan.y + plan.d;
    const side = plan.x + plan.w;
    for (let x = plan.x + plan.r + b.mullion; x < plan.x + plan.w - plan.r - 1; x += b.mullion) mullions.push(k.segment([x, front, z0], [x, front, z1], P));
    for (let y = plan.y + plan.r + b.mullion; y < plan.y + plan.d - plan.r - 1; y += b.mullion) mullions.push(k.segment([side, y, z0], [side, y, z1], P));
  }
  const inner = L(seams.join(""), { tone: "faint" }) + L(mullions.join(""), { tone: "faint" });
  const roof = L(k.planOutline(k.insetPlan(plan, 1.6), z1, P, 2), { tone: "lo" });
  const svg = `<g class="pc-bld" data-b="${index}">${S(k.slabOf(plan, z0, h, P, 2, 0.6), { tone: "mid", inner })}${roof}${windows(b)}</g>`;
  put(`bld.${b.id}`, [plan.x + plan.w / 2, plan.y + plan.d / 2, z0], svg, [A.slab(plan, z0, h, { name: `bld.${b.id}` })]);
}

// A few lit windows per building, between two floor seams and two mullions on
// a face you see. The live code lets them come and go slowly.
let windowCount = 0;
function windows(b) {
  if (!b.mullion) return "";
  const { plan, h } = b;
  const front = plan.y + plan.d;
  const side = plan.x + plan.w;
  const floors = Math.round(h / FLOOR);
  const out = [];
  const seed = (n) => ((Math.sin(n * 91.7 + b.plan.x * 3.1) * 43758.5) % 1 + 1) % 1;
  const count = Math.max(2, Math.round(floors / 3));
  for (let i = 0; i < count; i++) {
    const floor = 1 + Math.floor(seed(i) * (floors - 1));
    const z = BLOCK_Z + floor * FLOOR;
    const inset = 0.7;
    if (seed(i + 7) < 0.5) {
      const slots = Math.floor((plan.w - 2 * plan.r - 1) / b.mullion);
      if (slots < 2) continue;
      const x = plan.x + plan.r + b.mullion * Math.floor(seed(i + 3) * (slots - 1));
      out.push(quad([[x + inset, front, z + inset], [x + b.mullion - inset, front, z + inset], [x + b.mullion - inset, front, z + FLOOR - inset], [x + inset, front, z + FLOOR - inset]]));
    } else {
      const slots = Math.floor((plan.d - 2 * plan.r - 1) / b.mullion);
      if (slots < 2) continue;
      const y = plan.y + plan.r + b.mullion * Math.floor(seed(i + 3) * (slots - 1));
      out.push(quad([[side, y + inset, z + inset], [side, y + b.mullion - inset, z + inset], [side, y + b.mullion - inset, z + FLOOR - inset], [side, y + inset, z + FLOOR - inset]]));
    }
  }
  return out.map((d) => `<path class="pc-win" d="${d}"/>`).join("");
}

function rooftops() {
  const [tower, annex, office, hall, store, flats] = BUILDINGS;
  const top = (b) => BLOCK_Z + b.h;
  const crown = { x: tower.plan.x + 6, y: tower.plan.y + 5, w: 18, d: 16, r: 1 };
  const crownSeam = k.sideSeam(crown, top(tower) + FLOOR, P, 3);
  put("roof.crown", [crown.x + 9, crown.y + 8, top(tower)], S(k.slabOf(crown, top(tower), 8, P, 3, 0.5), { tone: "mid", inner: L(crownSeam, { tone: "faint" }) }), [A.slab(crown, top(tower), 8, { name: "roof.crown" })]);
  const mast = [crown.x + 9, crown.y + 8];
  const mastTop = top(tower) + 8 + 16;
  put("roof.mast", [...mast, top(tower) + 8],
    S(k.cylinder(mast[0], mast[1], 1.6, top(tower) + 8, 1.2, P, 16), { tone: "lo" }) +
    S(k.cylinder(mast[0], mast[1], 0.5, top(tower) + 9.2, 14.8, P, 12), { tone: "mid", crease: "none" }) +
    D([at([mast[0], mast[1], mastTop + 0.4])], { size: 1, tone: "hi" }),
    [A.cylinder(mast[0], mast[1], 1.6, top(tower) + 8, 1.2, { name: "roof.mast.foot" }), A.cylinder(mast[0], mast[1], 0.5, top(tower) + 9.2, 14.8, { name: "roof.mast" })]);

  const unit = (name, x, y, z) => {
    const plan = { x, y, w: 7, d: 5, r: 0.6 };
    const fan = k.ring(x + 3.5, y + 2.5, 1.7, z + 3, P, 20);
    put(name, [x + 3.5, y + 2.5, z],
      S(k.slabOf(plan, z, 3, P, 2, 0.3), { tone: "mid" }) + L(fan, { tone: "lo" }) + D([at([x + 3.5, y + 2.5, z + 3])], { size: 0.4 }),
      [A.slab(plan, z, 3, { name })]);
  };
  unit("roof.ac1", annex.plan.x + 4, annex.plan.y + 6, top(annex));
  unit("roof.ac2", annex.plan.x + 8, annex.plan.y + 18, top(annex));
  unit("roof.ac3", store.plan.x + 15, store.plan.y + 6, top(store));
  unit("roof.ac4", hall.plan.x + 12, hall.plan.y + 24, top(hall));

  const tank = [office.plan.x + 13, office.plan.y + 11];
  const plinth = { x: tank[0] - 5, y: tank[1] - 5, w: 10, d: 10, r: 0.8 };
  put("roof.tank", [...tank, top(office)],
    S(k.slabOf(plinth, top(office), 1.4, P, 2), { tone: "lo" }) +
    S(k.cylinder(tank[0], tank[1], 4, top(office) + 1.4, 7, P, 32, 0.4), { tone: "mid", inner: L(k.sideArc(tank[0], tank[1], 4, top(office) + 5, P, 24), { tone: "faint" }) }),
    [A.slab(plinth, top(office), 1.4, { name: "roof.tank.plinth" }), A.cylinder(tank[0], tank[1], 4, top(office) + 1.4, 7, { name: "roof.tank" })]);

  const bed = { x: flats.plan.x + 5, y: flats.plan.y + 6, w: 13, d: 8, r: 1 };
  put("roof.bed", [bed.x + 6.5, bed.y + 4, top(flats)],
    S(k.slabOf(bed, top(flats), 2, P, 3, 0.3), { tone: "lo" }) + L(k.planOutline(k.insetPlan(bed, 1.2), top(flats) + 2, P, 3), { tone: "faint" }),
    [A.slab(bed, top(flats), 2, { name: "roof.bed" })]);
}

function trees() {
  const spots = [[-140, 8], [-128, 9], [-138, 38], [-93, 8], [-91, 38], [-128, 40]];
  spots.forEach(([x, y], i) => {
    const z = BLOCK_Z;
    put(`tree.${i}`, [x, y, z],
      S(k.cylinder(x, y, 0.7, z, 3, P, 12), { tone: "lo", crease: "none" }) +
      S(k.cylinder(x, y, 4.2, z + 3, 4, P, 32, 0.4), { tone: "mid" }) +
      S(k.cylinder(x, y, 2.8, z + 7, 1.8, P, 24), { tone: "mid" }),
      [A.cylinder(x, y, 0.7, z, 3, { name: `tree.${i}.trunk` }), A.cylinder(x, y, 4.2, z + 3, 4, { name: `tree.${i}` }), A.cylinder(x, y, 2.8, z + 7, 1.8, { name: `tree.${i}.top` })]);
  });
  const seat = { x: -104, y: 32, w: 9, d: 2.4, r: 0.4 };
  put("bench", [seat.x + 4.5, seat.y + 1.2, BLOCK_Z],
    S(k.slabOf({ x: seat.x + 1, y: seat.y + 0.4, w: 1, d: 1.6, r: 0.2 }, BLOCK_Z, 1.6, P, 2), { tone: "lo" }) +
    S(k.slabOf({ x: seat.x + 7, y: seat.y + 0.4, w: 1, d: 1.6, r: 0.2 }, BLOCK_Z, 1.6, P, 2), { tone: "lo" }) +
    S(k.slabOf(seat, BLOCK_Z + 1.6, 0.7, P, 2), { tone: "mid" }),
    [A.slab(seat, BLOCK_Z, 2.3, { name: "bench" })]);
}

// Street lamps on block corners, set back from the walkway.
function lamps() {
  const spots = [[-146, 44, 1, 0], [-4, 44, 0, 1], [-66, 44, 0, 1], [-4, -58, -1, 0], [-146, -16, -1, 0], [-84, 2, 1, 0]];
  spots.forEach(([x, y, dx, dy], i) => {
    const z = BLOCK_Z;
    const h = 12;
    const arm = dx !== 0
      ? { x: Math.min(x, x + dx * 3) - 0.4, y: y - 0.4, w: 3.8, d: 0.8, r: 0.3 }
      : { x: x - 0.4, y: Math.min(y, y + dy * 3) - 0.4, w: 0.8, d: 3.8, r: 0.3 };
    const head = [x + dx * 3, y + dy * 3];
    put(`lamp.${i}`, [x, y, z],
      S(k.cylinder(x, y, 0.9, z, 0.8, P, 12), { tone: "lo" }) +
      S(k.cylinder(x, y, 0.4, z + 0.8, h, P, 10), { tone: "mid", crease: "none" }) +
      S(k.slabOf(arm, z + h + 0.8, 0.7, P, 2), { tone: "mid" }) +
      D([at([head[0], head[1], z + h + 0.5])], { size: 0.8, tone: "hi" }),
      [A.cylinder(x, y, 0.9, z, 0.8, { name: `lamp.${i}.foot` }), A.cylinder(x, y, 0.4, z + 0.8, h, { name: `lamp.${i}` }), A.slab(arm, z + h + 0.8, 0.7, { name: `lamp.${i}.arm` })]);
  });
}

// Bollards on the plaza between the road and the walks.
function bollards() {
  for (const x of [ROAD_X[0] - 2, ROAD_X[1] + 2]) {
    for (const y of [9, 15]) {
      put(`bollard.${x}.${y}`, [x, y, ROAD_Z],
        S(k.cylinder(x, y, 0.9, ROAD_Z, 3.2, P, 16, 0.3), { tone: "mid" }) + L(k.sideArc(x, y, 0.9, ROAD_Z + 2.4, P, 10), { tone: "faint" }),
        [A.cylinder(x, y, 0.9, ROAD_Z, 3.2, { name: `bollard.${x}.${y}` })]);
    }
  }
}

// ----------------------------------------------------------------- routes
// Routes are polylines with rounded corners; the live code walks them by
// arc length. Cars keep to the right.
function rounded(points, r, closed, steps = 6) {
  const n = points.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const isEnd = !closed && (i === 0 || i === n - 1);
    if (isEnd) {
      out.push(p);
      continue;
    }
    const a = points[(i - 1 + n) % n];
    const b = points[(i + 1) % n];
    const da = Math.hypot(p[0] - a[0], p[1] - a[1]);
    const db = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const t = Math.min(r, da / 2, db / 2);
    const s = [p[0] + ((a[0] - p[0]) / da) * t, p[1] + ((a[1] - p[1]) / da) * t];
    const e = [p[0] + ((b[0] - p[0]) / db) * t, p[1] + ((b[1] - p[1]) / db) * t];
    for (let j = 0; j <= steps; j++) {
      const u = j / steps;
      // Quadratic Bézier through the corner: close to an arc for right angles.
      out.push([(1 - u) ** 2 * s[0] + 2 * (1 - u) * u * p[0] + u * u * e[0], (1 - u) ** 2 * s[1] + 2 * (1 - u) * u * p[1] + u * u * e[1]]);
    }
  }
  return out.map(([x, y]) => [f2(x), f2(y)]);
}

// Inner lanes of the ring, anticlockwise seen from above.
const RING = rounded([[-152.5, 50.5], [2.5, 50.5], [2.5, -64.5], [-152.5, -64.5]], 8, true);

// The phone circuit, from the glass (nose just out) round the ring's outer
// lanes and back into the glass.
const IN_X = ROAD_MID - 2.5;
const OUT_X = ROAD_MID + 2.5;
const CIRCUIT = rounded([
  [OUT_X, PHONE.front], [OUT_X, 55.5], [-157.5, 55.5], [-157.5, -69.5], [7.5, -69.5], [7.5, 50.5], [IN_X, 50.5], [IN_X, PHONE.front],
], 5, false);

// Inside the phone, in screen coordinates (u, v = -z) with the drawing scale
// at each point: up the road into the map, round the map's west loop, and
// back down the road to the glass.
function inside() {
  const pts = [];
  const climbSteps = 10;
  const inU0 = IN_X;
  const inU1 = mapU(-77.5);
  for (let i = 0; i <= climbSteps; i++) {
    const t = i / climbSteps;
    const z = SCREEN.z0 + (MAP_BOTTOM - SCREEN.z0) * t;
    pts.push([inU0 + (inU1 - inU0) * t, -z, climb(z)]);
  }
  for (const [x, y] of rounded([[-77.5, 58], [-77.5, -64.5], [-152.5, -64.5], [-152.5, 50.5], [-72.5, 50.5], [-72.5, 58]], 8, false).slice(1)) {
    const [u, v] = mapPoint(x, y);
    pts.push([u, v, MAP_SCALE]);
  }
  const outU0 = mapU(-72.5);
  for (let i = 1; i <= climbSteps; i++) {
    const t = i / climbSteps;
    const z = MAP_BOTTOM + (SCREEN.z0 - MAP_BOTTOM) * t;
    pts.push([outU0 + (OUT_X - outU0) * t, -z, climb(z)]);
  }
  return pts.map(([u, v, s]) => [f2(u), f2(v), f2(s)]);
}
const INSIDE = inside();

// Walkers round each block's walkway, and two round the pond.
const walkway = (plan, inset = 1.6) => rounded([
  [plan.x + inset, plan.y + inset], [plan.x + plan.w - inset, plan.y + inset], [plan.x + plan.w - inset, plan.y + plan.d - inset], [plan.x + inset, plan.y + plan.d - inset],
], 2, true, 3);
const pondLoop = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2;
  return [f2(POND.x + 8 * Math.cos(a)), f2(POND.y + 8 * Math.sin(a))];
});
const WALKS = [
  { path: walkway(BLOCKS.tower), count: 3 },
  { path: walkway(BLOCKS.offices), count: 3 },
  { path: walkway(BLOCKS.shops), count: 4 },
  { path: walkway(BLOCKS.park), count: 2 },
  { path: pondLoop, count: 2 },
];

// Walkers through the phone: out of the glass on one side of the road, a turn
// round the plaza walk, and back in beside the road. Inside they climb the
// screen beside the road and join the map's front edge.
function walkLoop(outX, inX) {
  const path3 = rounded([[outX, PHONE.front], [outX, 17.5], [inX, 17.5], [inX, PHONE.front]], 2, false, 3);
  const pts = [];
  const steps = 8;
  const edge = MAP_BOTTOM;
  const up = (x) => Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const z = SCREEN.z0 + (edge - SCREEN.z0) * t;
    return [climbU(x, z), -z, climb(z)];
  });
  const rise = up(inX);
  const fall = up(outX).reverse();
  const top0 = rise[rise.length - 1];
  const top1 = fall[0];
  pts.push(...rise);
  // Along the map's front edge between the two tops.
  const along = 6;
  for (let i = 1; i < along; i++) {
    const t = i / along;
    pts.push([top0[0] + (top1[0] - top0[0]) * t, top0[1], MAP_SCALE]);
  }
  pts.push(...fall);
  return { path3, inside: pts.map(([u, v, s]) => [f2(u), f2(v), f2(s)]) };
}
const PORTAL_WALKS = [walkLoop(62, 74), walkLoop(106, 94)];

// ------------------------------------------------------------------ phone
function dockRest() {
  const rest = { x: PHONE.x + 10, y: PHONE.back - 6, w: PHONE.w - 20, d: 6, r: 2 };
  return S(k.slabOf(rest, ROAD_Z, 60, P, 4, 0.5), { tone: "mid" });
}

function phone() {
  const F = G.frameOf([0, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const outline = k.roundedPlan({ x: PHONE.x, y: PHONE.z0, w: PHONE.w, d: PHONE.h, r: PHONE.r }, 8);
  const body = G.prismOf(F, outline, PHONE.back, PHONE.front, P);
  const out = [S(body, { tone: "hi", crease: "lo" })];
  const side = PHONE.x + PHONE.w;
  out.push(S(k.slabOf({ x: side, y: -1.8, w: 0.9, d: 3.6, r: 0.5 }, PHONE_TOP - 44, 14, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: side, y: -1.8, w: 0.9, d: 3.6, r: 0.5 }, PHONE_TOP - 26, 7, P, 2), { tone: "mid" }));
  out.push(screen());
  return out.join("");
}

function screen() {
  const { x0, x1, z0, z1, r } = SCREEN;
  const shape = flat(x0, z0, x1, z1, r);
  const glass = flat(PHONE.x + 0.9, PHONE.z0 + 0.5, PHONE.x + PHONE.w - 0.9, PHONE_TOP - 0.9, PHONE.r - 0.8, 8);
  const cx = (x0 + x1) / 2;
  const t = (x, z, text, size, cls = "pc-t") => `<text class="${cls}" x="${f1(x)}" y="${f1(-z)}" font-size="${size}">${text}</text>`;
  const ui = [];

  // The ground under the map: the road climbing into the map, and a walk on
  // each side, drawn narrowing as they go up.
  const [mx0, my0] = mapPoint(TILE.x, TILE.y);
  const [mx1, my1] = mapPoint(TILE.x + TILE.w, TILE.y + TILE.d);
  const road = [[ROAD_X[0], -z0], [ROAD_X[1], -z0], [mapU(-70), my1], [mapU(-80), my1]];
  ui.push(`<path class="pc-road" d="${k.pathOf(road, true)}"/>`);
  ui.push(`<path class="iso-line" data-tone="mid" d="${k.pathOf([road[0], road[3]])}${k.pathOf([road[1], road[2]])}"/>`);
  ui.push(`<path class="iso-line" data-tone="lo" data-dashed="" d="${k.pathOf([[ROAD_MID, -z0], [mapU(-75), my1]])}"/>`);
  const walk = (x) => k.pathOf(Array.from({ length: 9 }, (_, i) => {
    const z = z0 + (MAP_BOTTOM - z0) * (i / 8);
    return [climbU(x, z), -z];
  }));
  ui.push(`<path class="iso-line" data-tone="faint" d="${[62, 74, 94, 106].map(walk).join("")}"/>`);

  // The map: the same tile, blocks and buildings, seen from above.
  const map = [];
  map.push(`<rect class="pc-road" x="${f1(mx0)}" y="${f1(my0)}" width="${f1(mx1 - mx0)}" height="${f1(my1 - my0)}"/>`);
  const mrect = (plan, cls, extra = "") => {
    const [ax, ay] = mapPoint(plan.x, plan.y);
    return `<rect class="${cls}" x="${f1(ax)}" y="${f1(ay)}" width="${f1(plan.w * MAP_SCALE)}" height="${f1(plan.d * MAP_SCALE)}" rx="${f1(Math.max(0.3, plan.r * MAP_SCALE))}"${extra}/>`;
  };
  for (const [name, plan] of Object.entries(BLOCKS)) map.push(mrect(plan, name === "park" ? "pc-mpark" : "pc-mblock"));
  BUILDINGS.forEach((b, i) => map.push(mrect(b.plan, "pc-mbld", ` data-b="${i}"`)));
  const [pcx, pcy] = mapPoint(POND.x, POND.y);
  map.push(`<circle class="pc-mpond" cx="${f1(pcx)}" cy="${f1(pcy)}" r="${f1(POND.r * MAP_SCALE)}"/>`);
  map.push(`<g data-mdots></g>`);
  ui.push(`<clipPath id="pc-map"><rect x="${f1(mx0)}" y="${f1(my0)}" width="${f1(mx1 - mx0)}" height="${f1(my1 - my0)}"/></clipPath><g clip-path="url(#pc-map)">${map.join("")}</g>`);
  ui.push(`<rect class="iso-line" data-tone="lo" x="${f1(mx0)}" y="${f1(my0)}" width="${f1(mx1 - mx0)}" height="${f1(my1 - my0)}"/>`);
  // Marks for the cars and people inside the phone, drawn by the live code.
  ui.push(`<g data-inside></g>`);

  // Status bar and search field over the top.
  ui.push(t(x0 + 4.4, z1 - 5.4, "9:41", 3.4, "pc-t pc-strong"));
  ui.push(`<path class="pc-island" d="${flat(cx - 8, z1 - 6.6, cx + 8, z1 - 2.2, 2.2)}"/>`);
  ui.push(`<path class="iso-line" data-tone="mid" d="${flat(x1 - 10, z1 - 5.9, x1 - 4.6, z1 - 3.3, 0.7, 2)}"/>`);
  ui.push(`<path class="pc-fill-mid" d="${flat(x1 - 9.3, z1 - 5.3, x1 - 6.4, z1 - 3.9, 0.3, 2)}"/>`);
  ui.push(`<path class="pc-field" d="${flat(x0 + 3, z1 - 16.6, x1 - 3, z1 - 9.6, 3.5)}"/>`);
  ui.push(`<circle class="iso-line" data-tone="mid" cx="${f1(x0 + 7.4)}" cy="${f1(-(z1 - 13.1))}" r="1.2"/>`);
  ui.push(t(x0 + 10.6, z1 - 14.2, "Where to?", 2.9, "pc-t"));

  return [
    `<g transform="${planeOf(PHONE.front)}">`,
    `<path class="pc-glass" d="${glass}"/>`,
    `<clipPath id="pc-screen"><path d="${shape}"/></clipPath>`,
    `<g clip-path="url(#pc-screen)"><path class="pc-screen" d="${shape}"/>${ui.join("")}</g>`,
    `<path class="iso-line" data-tone="lo" d="${shape}"/>`,
    `</g>`,
  ].join("");
}

// ---------------------------------------------------------------- assemble
const PLATE_SVG = plate();
const GROUND_SVG = ground();
curbs();
BUILDINGS.forEach(building);
rooftops();
trees();
lamps();
bollards();
const PHONE_SHAPES = [
  A.slab({ x: PHONE.x + 10, y: PHONE.back - 6, w: PHONE.w - 20, d: 6, r: 2 }, ROAD_Z, 60, { name: "phone.rest" }),
  A.box([PHONE.x, PHONE.back, PHONE.z0], [PHONE.x + PHONE.w, PHONE.front, PHONE_TOP], { name: "phone" }),
];
put("phone", [PHONE.x + PHONE.w / 2, 0, PHONE.z0], dockRest() + phone(), PHONE_SHAPES);
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
A.auditOrExit(R, P, { crowd: [] });

// Each item's world box and screen box, in drawing order.
const boxes = R.items.map((item) => {
  let lo = [Infinity, Infinity, Infinity];
  let hi = [-Infinity, -Infinity, -Infinity];
  for (const shape of item.shapes) {
    const b = A.boundsOf(shape);
    const [mn, mx] = Array.isArray(b) ? b : [b.min, b.max];
    lo = lo.map((v, i) => Math.min(v, mn[i]));
    hi = hi.map((v, i) => Math.max(v, mx[i]));
  }
  const corners = [];
  for (const x of [lo[0], hi[0]]) for (const y of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) corners.push(at([x, y, z]));
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  return { b: [...lo, ...hi].map(f2), s: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(f1) };
});
const items = R.items.map((item, i) => `<g data-i="${i}">${item.svg}</g>`).join("");

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "An isometric model of a small city on a bench plate, with a smartphone standing at the end of a road. Cars and people move through the streets; the road runs straight into the phone's screen, where the cars and people carry on as marks on the phone's map of the same city before coming back out.",
  body: [PLATE_SVG, GROUND_SVG, `<g data-items>${items}</g>`],
});

const cam = k.cameraOf(P);
const live = {
  cam: { ox: f2(P.origin[0]), oy: f2(P.origin[1]), k: cam.k, sinA: cam.sinA, cosA: cam.cosA, sinE: cam.sinE, cosE: cam.cosE },
  road: ROAD_Z,
  block: BLOCK_Z,
  front: PHONE.front,
  items: boxes,
  ring: RING,
  circuit: CIRCUIT,
  inside: INSIDE,
  walks: WALKS,
  portalWalks: PORTAL_WALKS,
  map: { x0: SCREEN.x0, top: MAP_TOP, scale: MAP_SCALE, tileX: TILE.x, tileY: TILE.y },
  floors: BUILDINGS.map((b) => Math.round(b.h / FLOOR)),
};

writeFileSync(
  OUT,
  `// Generated by figures/phone-city/build.mjs. Do not edit by hand.\n` +
    `export const CARD = ${JSON.stringify(`<div class="iso-stage">${svg}</div>`)}\n\n` +
    `export const LIVE = ${JSON.stringify(live)}\n`,
);
console.log("wrote", OUT, `${(svg.length / 1024).toFixed(1)} KB`, `${R.items.length} items`);
