/** Letter Explorer — Procedural Animal Geometry Builders
 *  Each function returns a THREE.Group with ~200-400 triangles.
 *  All use MeshLambertMaterial (WebGL 1.0 safe).
 */

import * as THREE from 'three';

// ─── Helpers ────────────────────────────────────────────────────────────

function mat(color: string) {
  return new THREE.MeshLambertMaterial({ color });
}

function sphere(r: number, w = 8, h = 8) {
  return new THREE.SphereGeometry(r, w, h);
}

function cyl(rTop: number, rBot: number, height: number, seg = 8) {
  return new THREE.CylinderGeometry(rTop, rBot, height, seg);
}

function cone(r: number, height: number, seg = 8) {
  return new THREE.ConeGeometry(r, height, seg);
}

function box(w: number, h: number, d: number) {
  return new THREE.BoxGeometry(w, h, d);
}

// ─── Aardvark (A) — elongated body + long snout + big ears ──────────

export function createAardvark(colors: { primary: string; secondary: string; accent: string }): THREE.Group {
  const g = new THREE.Group();
  const p = mat(colors.primary);
  const s = mat(colors.secondary);
  const a = mat(colors.accent);

  // Body — elongated ellipsoid via scaled sphere
  const body = new THREE.Mesh(sphere(0.35, 8, 6), p);
  body.scale.set(1.4, 0.8, 0.8);
  body.position.set(0, 0.4, 0);
  g.add(body);

  // Head
  const head = new THREE.Mesh(sphere(0.2, 8, 6), p);
  head.position.set(0.45, 0.55, 0);
  g.add(head);

  // Snout — long cylinder
  const snout = new THREE.Mesh(cyl(0.06, 0.04, 0.3, 6), s);
  snout.rotation.z = -Math.PI / 2;
  snout.position.set(0.7, 0.5, 0);
  g.add(snout);

  // Ears — two thin cones
  const earL = new THREE.Mesh(cone(0.06, 0.2, 4), s);
  earL.position.set(0.4, 0.78, 0.1);
  g.add(earL);
  const earR = new THREE.Mesh(cone(0.06, 0.2, 4), s);
  earR.position.set(0.4, 0.78, -0.1);
  g.add(earR);

  // Legs (4)
  const legGeo = cyl(0.05, 0.05, 0.3, 4);
  [[-0.2, 0.12, 0.15], [-0.2, 0.12, -0.15], [0.2, 0.12, 0.15], [0.2, 0.12, -0.15]].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, a);
    leg.position.set(x, y, z);
    g.add(leg);
  });

  // Tail
  const tail = new THREE.Mesh(cyl(0.03, 0.02, 0.25, 4), s);
  tail.rotation.z = 0.6;
  tail.position.set(-0.45, 0.5, 0);
  g.add(tail);

  // Eyes
  const eyeGeo = sphere(0.025, 4, 4);
  const eyeMat = mat('#333333');
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(0.58, 0.6, 0.1);
  g.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.58, 0.6, -0.1);
  g.add(eyeR);

  return g;
}

// ─── Baboon (B) — rounded body + distinct face + tail ───────────────

export function createBaboon(colors: { primary: string; secondary: string; accent: string }): THREE.Group {
  const g = new THREE.Group();
  const p = mat(colors.primary);
  const s = mat(colors.secondary);
  const a = mat(colors.accent);

  // Body
  const body = new THREE.Mesh(sphere(0.3, 8, 6), p);
  body.position.set(0, 0.45, 0);
  g.add(body);

  // Head
  const head = new THREE.Mesh(sphere(0.22, 8, 6), p);
  head.position.set(0, 0.8, 0);
  g.add(head);

  // Muzzle
  const muzzle = new THREE.Mesh(sphere(0.1, 6, 4), a);
  muzzle.scale.set(1, 0.8, 1.2);
  muzzle.position.set(0, 0.75, 0.18);
  g.add(muzzle);

  // Eyes
  const eyeGeo = sphere(0.03, 4, 4);
  const eyeMat = mat('#333333');
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.08, 0.85, 0.17);
  g.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.08, 0.85, 0.17);
  g.add(eyeR);

  // Arms
  const armGeo = cyl(0.05, 0.04, 0.35, 4);
  const armL = new THREE.Mesh(armGeo, s);
  armL.rotation.z = 0.4;
  armL.position.set(-0.3, 0.4, 0);
  g.add(armL);
  const armR = new THREE.Mesh(armGeo, s);
  armR.rotation.z = -0.4;
  armR.position.set(0.3, 0.4, 0);
  g.add(armR);

  // Legs
  const legGeo = cyl(0.06, 0.05, 0.3, 4);
  const legL = new THREE.Mesh(legGeo, s);
  legL.position.set(-0.12, 0.12, 0);
  g.add(legL);
  const legR = new THREE.Mesh(legGeo, s);
  legR.position.set(0.12, 0.12, 0);
  g.add(legR);

  // Tail — curved via tilted cylinder
  const tail = new THREE.Mesh(cyl(0.03, 0.02, 0.5, 4), s);
  tail.rotation.z = 0.8;
  tail.rotation.x = 0.3;
  tail.position.set(-0.3, 0.45, -0.15);
  g.add(tail);

  return g;
}

// ─── Cheetah (C) — sleek body + spotted pattern ─────────────────────

export function createCheetah(colors: { primary: string; secondary: string; accent: string }): THREE.Group {
  const g = new THREE.Group();
  const p = mat(colors.primary);
  const s = mat(colors.secondary);
  const spotMat = mat(colors.accent);

  // Body — elongated
  const body = new THREE.Mesh(sphere(0.3, 8, 6), p);
  body.scale.set(1.6, 0.7, 0.7);
  body.position.set(0, 0.4, 0);
  g.add(body);

  // Head
  const head = new THREE.Mesh(sphere(0.16, 8, 6), p);
  head.position.set(0.5, 0.55, 0);
  g.add(head);

  // Nose
  const nose = new THREE.Mesh(sphere(0.04, 4, 4), spotMat);
  nose.position.set(0.65, 0.52, 0);
  g.add(nose);

  // Eyes
  const eyeGeo = sphere(0.025, 4, 4);
  const eyeMat = mat('#333333');
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(0.58, 0.6, 0.1);
  g.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.58, 0.6, -0.1);
  g.add(eyeR);

  // Tear marks (cheetah signature)
  const tearGeo = cyl(0.015, 0.015, 0.08, 3);
  const tearL = new THREE.Mesh(tearGeo, spotMat);
  tearL.position.set(0.6, 0.53, 0.1);
  g.add(tearL);
  const tearR = new THREE.Mesh(tearGeo, spotMat);
  tearR.position.set(0.6, 0.53, -0.1);
  g.add(tearR);

  // Spots — small dark spheres on body
  const spotGeo = sphere(0.03, 4, 4);
  [[-0.1, 0.48, 0.2], [0.1, 0.45, -0.18], [0.25, 0.5, 0.15],
   [-0.2, 0.42, -0.15], [0.0, 0.5, -0.2], [0.15, 0.42, 0.2]].forEach(([x, y, z]) => {
    const spot = new THREE.Mesh(spotGeo, spotMat);
    spot.position.set(x, y, z);
    g.add(spot);
  });

  // Legs — long and thin
  const legGeo = cyl(0.04, 0.03, 0.35, 4);
  [[-0.2, 0.1, 0.12], [-0.2, 0.1, -0.12], [0.25, 0.1, 0.12], [0.25, 0.1, -0.12]].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, s);
    leg.position.set(x, y, z);
    g.add(leg);
  });

  // Tail — long
  const tail = new THREE.Mesh(cyl(0.025, 0.02, 0.5, 4), s);
  tail.rotation.z = 0.5;
  tail.position.set(-0.5, 0.4, 0);
  g.add(tail);

  // Ears
  const earGeo = cone(0.04, 0.1, 4);
  const earL = new THREE.Mesh(earGeo, s);
  earL.position.set(0.45, 0.72, 0.1);
  g.add(earL);
  const earR = new THREE.Mesh(earGeo, s);
  earR.position.set(0.45, 0.72, -0.1);
  g.add(earR);

  return g;
}

// ─── Dung Beetle (D) — round body + legs + horn ─────────────────────

export function createDungBeetle(colors: { primary: string; secondary: string; accent: string }): THREE.Group {
  const g = new THREE.Group();
  const p = mat(colors.primary);
  const s = mat(colors.secondary);
  const a = mat(colors.accent);

  // Body — round
  const body = new THREE.Mesh(sphere(0.25, 8, 6), p);
  body.scale.set(1.1, 0.8, 1.0);
  body.position.set(0, 0.25, 0);
  g.add(body);

  // Head
  const head = new THREE.Mesh(sphere(0.14, 6, 6), s);
  head.position.set(0.25, 0.3, 0);
  g.add(head);

  // Horn
  const horn = new THREE.Mesh(cone(0.03, 0.15, 4), a);
  horn.rotation.z = -0.5;
  horn.position.set(0.35, 0.42, 0);
  g.add(horn);

  // Eyes
  const eyeGeo = sphere(0.02, 4, 4);
  const eyeMat = mat('#FFD700');
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(0.34, 0.35, 0.08);
  g.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.34, 0.35, -0.08);
  g.add(eyeR);

  // Legs (6 — it's a beetle!)
  const legGeo = cyl(0.02, 0.02, 0.15, 3);
  [[-0.12, 0.08, 0.2], [0.0, 0.08, 0.22], [0.12, 0.08, 0.2],
   [-0.12, 0.08, -0.2], [0.0, 0.08, -0.22], [0.12, 0.08, -0.2]].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, s);
    leg.rotation.x = z > 0 ? 0.5 : -0.5;
    leg.position.set(x, y, z);
    g.add(leg);
  });

  // Wing shell line (ridge on back)
  const ridge = new THREE.Mesh(box(0.02, 0.01, 0.3), a);
  ridge.position.set(0, 0.38, 0);
  g.add(ridge);

  // Dung ball (signature!)
  const ball = new THREE.Mesh(sphere(0.12, 6, 6), mat('#5D4037'));
  ball.position.set(-0.35, 0.12, 0);
  g.add(ball);

  return g;
}

// ─── Elephant (E) — large body + trunk + big ears + tusks ───────────

export function createElephant(colors: { primary: string; secondary: string; accent: string }): THREE.Group {
  const g = new THREE.Group();
  const p = mat(colors.primary);
  const s = mat(colors.secondary);
  const a = mat(colors.accent);

  // Body — large
  const body = new THREE.Mesh(sphere(0.4, 8, 6), p);
  body.scale.set(1.2, 0.9, 0.9);
  body.position.set(0, 0.5, 0);
  g.add(body);

  // Head
  const head = new THREE.Mesh(sphere(0.25, 8, 6), p);
  head.position.set(0.35, 0.75, 0);
  g.add(head);

  // Trunk — tapered cylinder, angled down
  const trunk = new THREE.Mesh(cyl(0.08, 0.04, 0.4, 6), s);
  trunk.rotation.z = -0.8;
  trunk.position.set(0.6, 0.55, 0);
  g.add(trunk);

  // Ears — large flat spheres
  const earGeo = sphere(0.18, 6, 4);
  const earL = new THREE.Mesh(earGeo, a);
  earL.scale.set(0.3, 1, 1);
  earL.position.set(0.25, 0.8, 0.25);
  g.add(earL);
  const earR = new THREE.Mesh(earGeo, a);
  earR.scale.set(0.3, 1, 1);
  earR.position.set(0.25, 0.8, -0.25);
  g.add(earR);

  // Tusks
  const tuskGeo = cyl(0.025, 0.01, 0.2, 4);
  const tuskMat = mat('#FFFFF0');
  const tuskL = new THREE.Mesh(tuskGeo, tuskMat);
  tuskL.rotation.z = -0.4;
  tuskL.position.set(0.5, 0.6, 0.1);
  g.add(tuskL);
  const tuskR = new THREE.Mesh(tuskGeo, tuskMat);
  tuskR.rotation.z = -0.4;
  tuskR.position.set(0.5, 0.6, -0.1);
  g.add(tuskR);

  // Eyes
  const eyeGeo = sphere(0.03, 4, 4);
  const eyeMat = mat('#333333');
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(0.48, 0.82, 0.15);
  g.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.48, 0.82, -0.15);
  g.add(eyeR);

  // Legs — thick
  const legGeo = cyl(0.08, 0.08, 0.35, 6);
  [[-0.2, 0.12, 0.18], [-0.2, 0.12, -0.18], [0.2, 0.12, 0.18], [0.2, 0.12, -0.18]].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, s);
    leg.position.set(x, y, z);
    g.add(leg);
  });

  // Tail
  const tail = new THREE.Mesh(cyl(0.02, 0.015, 0.25, 3), s);
  tail.rotation.z = 0.5;
  tail.position.set(-0.45, 0.5, 0);
  g.add(tail);

  return g;
}

// ─── Flamingo (F) — thin body + long neck + long legs + curved beak ─

export function createFlamingo(colors: { primary: string; secondary: string; accent: string }): THREE.Group {
  const g = new THREE.Group();
  const p = mat(colors.primary);
  const s = mat(colors.secondary);
  const a = mat(colors.accent);

  // Body — small oval
  const body = new THREE.Mesh(sphere(0.2, 8, 6), p);
  body.scale.set(1.0, 0.7, 0.8);
  body.position.set(0, 0.7, 0);
  g.add(body);

  // Neck — long thin cylinder, angled
  const neck = new THREE.Mesh(cyl(0.04, 0.04, 0.45, 6), s);
  neck.rotation.z = 0.15;
  neck.position.set(0.05, 1.05, 0);
  g.add(neck);

  // Head
  const head = new THREE.Mesh(sphere(0.1, 6, 6), p);
  head.position.set(0.1, 1.3, 0);
  g.add(head);

  // Beak — angled cone, distinctive downward curve
  const beak = new THREE.Mesh(cone(0.03, 0.12, 4), a);
  beak.rotation.z = -1.2;
  beak.position.set(0.22, 1.25, 0);
  g.add(beak);

  // Beak tip (black)
  const beakTip = new THREE.Mesh(cone(0.02, 0.05, 4), mat('#333333'));
  beakTip.rotation.z = -1.2;
  beakTip.position.set(0.28, 1.2, 0);
  g.add(beakTip);

  // Eyes
  const eyeGeo = sphere(0.02, 4, 4);
  const eyeMat = mat('#333333');
  const eye = new THREE.Mesh(eyeGeo, eyeMat);
  eye.position.set(0.15, 1.33, 0.07);
  g.add(eye);

  // Legs — long and thin
  const legGeo = cyl(0.025, 0.025, 0.55, 4);
  const legL = new THREE.Mesh(legGeo, a);
  legL.position.set(-0.06, 0.25, 0);
  g.add(legL);
  const legR = new THREE.Mesh(legGeo, a);
  legR.position.set(0.06, 0.25, 0);
  g.add(legR);

  // Knee joints (slight bump)
  const kneeGeo = sphere(0.03, 4, 4);
  const kneeL = new THREE.Mesh(kneeGeo, a);
  kneeL.position.set(-0.06, 0.35, 0);
  g.add(kneeL);
  const kneeR = new THREE.Mesh(kneeGeo, a);
  kneeR.position.set(0.06, 0.35, 0);
  g.add(kneeR);

  // Wing hint
  const wing = new THREE.Mesh(sphere(0.1, 6, 4), s);
  wing.scale.set(0.4, 0.8, 1.2);
  wing.position.set(-0.08, 0.72, 0);
  g.add(wing);

  // Tail feathers
  const tailGeo = cone(0.06, 0.12, 4);
  const tail = new THREE.Mesh(tailGeo, s);
  tail.rotation.z = 0.8;
  tail.position.set(-0.18, 0.7, 0);
  g.add(tail);

  return g;
}

// ─── Factory ────────────────────────────────────────────────────────

const BUILDERS: Record<string, (c: { primary: string; secondary: string; accent: string }) => THREE.Group> = {
  aardvark: createAardvark,
  baboon: createBaboon,
  cheetah: createCheetah,
  dungBeetle: createDungBeetle,
  elephant: createElephant,
  flamingo: createFlamingo,
};

/** Build a procedural animal mesh by id. Returns a THREE.Group (~200-400 tris). */
export function buildAnimal(
  id: string,
  colors: { primary: string; secondary: string; accent: string },
): THREE.Group {
  const builder = BUILDERS[id];
  if (!builder) throw new Error(`Unknown animal: ${id}`);
  return builder(colors);
}
