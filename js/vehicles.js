import * as THREE from 'three';

export function buildVehicleMesh(carSpec, config) {
  const root = new THREE.Group();
  const { width, height, length, cabinOffset } = carSpec.bodyShape;

  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.color),
    metalness: 0.82,
    roughness: 0.16
  });

  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x10141d,
    metalness: 0.5,
    roughness: 0.38
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x060f20,
    metalness: 0.15,
    roughness: 0.05,
    transparent: true,
    opacity: 0.78
  });

  const chassisGroup = new THREE.Group();
  root.add(chassisGroup);

  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(width, height * 0.44, length), bodyMat);
  lowerBody.position.y = 0.5;
  chassisGroup.add(lowerBody);

  [-1, 1].forEach(side => {
    const frontFender = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.34, 1.1), bodyMat);
    frontFender.position.set(side * (width * 0.52), 0.48, length * 0.31);
    const rearFender = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.38, 1.2), bodyMat);
    rearFender.position.set(side * (width * 0.53), 0.5, -length * 0.31);
    const sideSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, length * 0.56), carbonMat);
    sideSkirt.position.set(side * (width * 0.52), 0.26, 0);
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.12), carbonMat);
    mirror.position.set(side * (width * 0.54), 0.86, cabinOffset + length * 0.15);
    chassisGroup.add(frontFender, rearFender, sideSkirt, mirror);
  });

  const hood = new THREE.Mesh(new THREE.BoxGeometry(width * 0.92, height * 0.22, length * 0.36), bodyMat);
  hood.position.set(0, 0.7, length * 0.28);
  hood.rotation.x = 0.09;
  chassisGroup.add(hood);

  const hoodLevel = Number(config.hood || 0);
  if (hoodLevel === 1) {
    [-0.32, 0.32].forEach(vx => {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.55), carbonMat);
      vent.position.set(vx, 0.82, length * 0.28);
      vent.rotation.x = 0.09;
      chassisGroup.add(vent);
    });
  } else if (hoodLevel === 2) {
    const cowl = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 0.85), carbonMat);
    cowl.position.set(0, 0.84, length * 0.24);
    chassisGroup.add(cowl);
  }

  const splitter = new THREE.Mesh(new THREE.BoxGeometry(width * 1.08, 0.07, length * 0.18), carbonMat);
  splitter.position.set(0, 0.25, length * 0.47);
  const grille = new THREE.Mesh(new THREE.BoxGeometry(width * 0.62, 0.2, 0.08), carbonMat);
  grille.position.set(0, 0.42, length * 0.495);
  chassisGroup.add(splitter, grille);

  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 0.18, 0.22), carbonMat);
  diffuser.position.set(0, 0.3, -length * 0.49);
  chassisGroup.add(diffuser);

  const pipeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.92, roughness: 0.18 });
  [-0.38, 0.38].forEach(ex => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.24, 12), pipeMat);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(ex, 0.31, -length * 0.51);
    chassisGroup.add(pipe);
  });

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(width * 0.82, height * 0.44, length * 0.48), glassMat);
  cabin.position.set(0, 0.5 + height * 0.42, cabinOffset);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 0.78, 0.06, length * 0.34), bodyMat);
  roof.position.set(0, 0.5 + height * 0.64, cabinOffset - 0.05);
  chassisGroup.add(cabin, roof);

  // Cockpit Dashboard, Seats & Glowing Steering Wheel
  const dash = new THREE.Mesh(new THREE.BoxGeometry(width * 0.74, 0.22, 0.35), carbonMat);
  dash.position.set(0, 0.76, cabinOffset + length * 0.16);
  const wheelRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.025, 8, 16),
    new THREE.MeshBasicMaterial({ color: 0x00f0ff })
  );
  wheelRim.position.set(-0.32, 0.86, cabinOffset + length * 0.1);
  wheelRim.rotation.x = -0.35;
  chassisGroup.add(dash, wheelRim);

  [-0.32, 0.32].forEach(sx => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.36), carbonMat);
    seat.position.set(sx, 0.66, cabinOffset - 0.12);
    chassisGroup.add(seat);
  });

  const spoilerLevel = Number(config.spoiler || 0);
  if (spoilerLevel > 0) {
    const wingWidth = width * (0.96 + spoilerLevel * 0.06);
    const wingHeight = 0.2 + spoilerLevel * 0.11;
    const wing = new THREE.Mesh(new THREE.BoxGeometry(wingWidth, 0.05, 0.26 + spoilerLevel * 0.05), carbonMat);
    wing.position.set(0, 0.76 + wingHeight, -length * 0.46);
    chassisGroup.add(wing);

    [-0.46, 0.46].forEach(sx => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.05, wingHeight, 0.14), carbonMat);
      strut.position.set(sx, 0.76 + wingHeight * 0.5, -length * 0.45);
      chassisGroup.add(strut);
    });
  }

  const headMat = new THREE.MeshBasicMaterial({ color: 0xffe484 });
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff1133 });
  [-width * 0.34, width * 0.34].forEach(xPos => {
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.06), carbonMat);
    housing.position.set(xPos, 0.61, length * 0.492);
    const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.07), headMat);
    bar1.position.set(xPos, 0.61, length * 0.495);
    bar1.rotation.z = 0.65;
    const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.07), headMat);
    bar2.position.set(xPos, 0.61, length * 0.495);
    bar2.rotation.z = -0.65;
    chassisGroup.add(housing, bar1, bar2);
  });

  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(width * 0.88, 0.09, 0.08), tailMat);
  tailBar.position.set(0, 0.63, -length * 0.495);
  chassisGroup.add(tailBar);

  const headLightSpot = new THREE.SpotLight(0xdff8ff, 3.6, 85, Math.PI * 0.25, 0.5, 1.1);
  headLightSpot.position.set(0, 0.85, length * 0.48);
  headLightSpot.target.position.set(0, 0.2, length * 0.48 + 20);
  chassisGroup.add(headLightSpot, headLightSpot.target);

  const underglow = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 1.24, length * 1.02),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(config.neon || '#00f0ff'),
      transparent: true,
      opacity: 0.52,
      side: THREE.DoubleSide
    })
  );
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.y = 0.05;
  root.add(underglow);

  const nitroFlames = [];
  const outerGeo = new THREE.ConeGeometry(0.14, 1.1, 10);
  outerGeo.rotateX(-Math.PI / 2);
  const innerGeo = new THREE.ConeGeometry(0.075, 0.68, 8);
  innerGeo.rotateX(-Math.PI / 2);

  [-0.38, 0.38].forEach(x => {
    const flameGroup = new THREE.Group();
    const outer = new THREE.Mesh(outerGeo, new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.92 }));
    const inner = new THREE.Mesh(innerGeo, new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    flameGroup.add(outer, inner);
    flameGroup.position.set(x, 0.31, -length * 0.52 - 0.44);
    flameGroup.visible = false;
    chassisGroup.add(flameGroup);
    nitroFlames.push(flameGroup);
  });

  const wheels = [];
  const wheelRadius = carSpec.category === 'SUV' || carSpec.category === 'Offroad' ? 0.44 : 0.37;
  const wheelWidth = 0.3;
  const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 22);
  tireGeo.rotateZ(Math.PI / 2);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.8 });

  const rimColor = Number(config.rims) === 1 ? 0xffcc00 : (Number(config.rims) === 2 ? 0x00f0ff : 0xe2e8f0);
  const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.72, wheelRadius * 0.72, wheelWidth + 0.02, 16);
  rimGeo.rotateZ(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({ color: rimColor, metalness: 0.94, roughness: 0.12 });

  [
    { x: -width * 0.5, z: length * 0.31, front: true },
    { x: width * 0.5, z: length * 0.31, front: true },
    { x: -width * 0.5, z: -length * 0.31, front: false },
    { x: width * 0.5, z: -length * 0.31, front: false }
  ].forEach(wp => {
    const pivot = new THREE.Group();
    pivot.position.set(wp.x, wheelRadius, wp.z);
    const spinMesh = new THREE.Group();
    spinMesh.add(new THREE.Mesh(tireGeo, tireMat), new THREE.Mesh(rimGeo, rimMat));
    pivot.add(spinMesh);
    root.add(pivot);
    wheels.push({ pivot, spinMesh, front: wp.front });
  });

  return { root, chassisGroup, wheels, tailMat, headLightSpot, nitroFlames };
}