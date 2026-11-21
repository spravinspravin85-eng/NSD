import * as THREE from 'three';

export class OpenWorld {
  constructor(scene) {
    this.scene = scene;
    this.worldGroup = new THREE.Group();
    this.garageGroup = new THREE.Group();
    this.scene.add(this.worldGroup, this.garageGroup);

    this.colliders = [];
    this.waypoints = [];

    this.buildCyberpunkGarage();
    this.buildCityWorld();
  }

  createWetAsphaltTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f1420';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 4 + Math.random() * 28;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 210, 255, 0.09)' : 'rgba(5, 8, 15, 0.3)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(252, 20, 8, 90);
    ctx.fillRect(252, 276, 8, 90);

    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(12, 0, 6, 512);
    ctx.fillRect(494, 0, 6, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(50, 50);
    return tex;
  }

  createSkyscraperTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#070c18';
    ctx.fillRect(0, 0, 256, 512);

    const winColors = ['#00f0ff', '#ff007f', '#38bdf8', '#fde047', '#1e293b'];
    for (let y = 12; y < 500; y += 18) {
      for (let x = 12; x < 244; x += 22) {
        ctx.fillStyle = Math.random() > 0.35 ? winColors[(x + y) % winColors.length] : '#0f172a';
        ctx.fillRect(x, y, 12, 10);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  createChevronTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 15, 30, 0.25)';
    ctx.fillRect(0, 0, 256, 128);

    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, '#00ff88');
    grad.addColorStop(1, '#00f0ff');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 14;

    [45, 115, 185].forEach(offsetX => {
      ctx.beginPath();
      ctx.moveTo(offsetX, 20);
      ctx.lineTo(offsetX + 36, 64);
      ctx.lineTo(offsetX, 108);
      ctx.stroke();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }

  buildCyberpunkGarage() {
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(4.4, 4.8, 0.26, 48),
      new THREE.MeshStandardMaterial({ color: 0x091122, metalness: 0.9, roughness: 0.14 })
    );
    platform.position.y = -0.13;
    this.garageGroup.add(platform);

    const ringSpecs = [
      { r: 3.6, color: 0x2979ff },
      { r: 4.1, color: 0xff007f },
      { r: 4.55, color: 0x00f0ff }
    ];
    ringSpecs.forEach(rs => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(rs.r, 0.055, 12, 64),
        new THREE.MeshBasicMaterial({ color: rs.color })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.02;
      this.garageGroup.add(ring);
    });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 36),
      new THREE.MeshStandardMaterial({ color: 0x060b16, metalness: 0.85, roughness: 0.16 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.26;
    this.garageGroup.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0b1222, roughness: 0.45, metalness: 0.55 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(36, 12, 0.5), wallMat);
    backWall.position.set(0, 5.5, -13);
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 12, 36), wallMat);
    leftWall.position.set(-14, 5.5, 0);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 12, 36), wallMat);
    rightWall.position.set(14, 5.5, 0);
    this.garageGroup.add(backWall, leftWall, rightWall);

    [-4.5, 0, 4.5].forEach((zPos, i) => {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(13, 0.14, 0.24),
        new THREE.MeshBasicMaterial({ color: i === 1 ? 0x00f0ff : 0xff007f })
      );
      bar.position.set(0, 7.0, zPos);
      bar.rotation.z = 0.08;
      this.garageGroup.add(bar);
    });

    const tireGeo = new THREE.TorusGeometry(0.38, 0.15, 12, 24);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x151821, roughness: 0.65 });
    for (let t = 0; t < 3; t++) {
      const spare = new THREE.Mesh(tireGeo, tireMat);
      spare.rotation.x = Math.PI / 2;
      spare.position.set(4.9, -0.1 + t * 0.28, 2.3);
      this.garageGroup.add(spare);
    }

    const spot1 = new THREE.PointLight(0x00f0ff, 28, 28);
    spot1.position.set(5, 5, 5);
    const spot2 = new THREE.PointLight(0xff007f, 24, 28);
    spot2.position.set(-5, 4, -4);
    this.garageGroup.add(spot1, spot2);
  }

  buildCityWorld() {
    this.worldGroup.visible = false;
    const roadTex = this.createWetAsphaltTexture();
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2400, 2400),
      new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.16, metalness: 0.72 })
    );
    ground.rotation.x = -Math.PI / 2;
    this.worldGroup.add(ground);

    const rawLoop = [
      [0, 0], [0, 220], [90, 390], [280, 460], [490, 410],
      [620, 240], [640, 20], [560, -210], [380, -380],
      [150, -430], [-140, -400], [-360, -280], [-440, -90],
      [-350, 90], [-160, 40]
    ];
    this.waypoints = rawLoop.map(([x, z]) => new THREE.Vector3(x, 0, z));

    const curve = new THREE.CatmullRomCurve3(this.waypoints, true);
    const trackPoints = curve.getPoints(180);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x151c2c, roughness: 0.12, metalness: 0.76 });
    const chevronTex = this.createChevronTexture();
    const chevronMat = new THREE.MeshBasicMaterial({ map: chevronTex, transparent: true, side: THREE.DoubleSide });

    for (let i = 0; i < trackPoints.length; i++) {
      const p1 = trackPoints[i];
      const p2 = trackPoints[(i + 1) % trackPoints.length];
      const segLen = p1.distanceTo(p2);
      const seg = new THREE.Mesh(new THREE.BoxGeometry(24, 0.08, segLen + 1.4), trackMat);
      seg.position.copy(p1).lerp(p2, 0.5);
      seg.position.y = 0.04;
      seg.lookAt(p2.x, 0.04, p2.z);
      this.worldGroup.add(seg);

      if (i % 6 === 0) {
        const wallPanel = new THREE.Mesh(new THREE.PlaneGeometry(segLen * 2.2, 2.6), chevronMat);
        const normal = new THREE.Vector3(-(p2.z - p1.z), 0, p2.x - p1.x).normalize();
        wallPanel.position.copy(p1).addScaledVector(normal, 13.0);
        wallPanel.position.y = 1.45;
        wallPanel.lookAt(p1.x, 1.45, p1.z);
        this.worldGroup.add(wallPanel);
      }

      if (i % 45 === 0) {
        const bridge = new THREE.Mesh(
          new THREE.BoxGeometry(28, 1.4, 3.2),
          new THREE.MeshBasicMaterial({ color: 0x00f0ff })
        );
        bridge.position.copy(p1);
        bridge.position.y = 9.5;
        bridge.lookAt(p2.x, 9.5, p2.z);
        this.worldGroup.add(bridge);
      }
    }

    const skyTex = this.createSkyscraperTexture();
    const bldgMat = new THREE.MeshStandardMaterial({
      map: skyTex,
      emissiveMap: skyTex,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.48,
      roughness: 0.3
    });
    const neonMats = [
      new THREE.MeshBasicMaterial({ color: 0x00f0ff }),
      new THREE.MeshBasicMaterial({ color: 0xff007f }),
      new THREE.MeshBasicMaterial({ color: 0x2979ff }),
      new THREE.MeshBasicMaterial({ color: 0xffaa00 })
    ];

    // Trees & Vegetation along outer parkways
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3f2e21, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x0d4f3c, roughness: 0.7 });

    for (let i = 0; i < 165; i++) {
      const bx = (Math.random() - 0.5) * 1800;
      const bz = (Math.random() - 0.5) * 1800;
      if (trackPoints.some(tp => Math.hypot(tp.x - bx, tp.z - bz) < 35)) continue;

      if (i % 5 === 0) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 4, 8), trunkMat);
        trunk.position.set(bx, 2, bz);
        const crown = new THREE.Mesh(new THREE.ConeGeometry(3.2, 8, 8), leafMat);
        crown.position.set(bx, 7, bz);
        this.worldGroup.add(trunk, crown);
        continue;
      }

      const w = 18 + Math.random() * 28;
      const d = 18 + Math.random() * 28;
      const h = bx > 0 && bz > 0 ? 50 + Math.random() * 95 : 18 + Math.random() * 38;

      const bldg = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bldgMat);
      bldg.position.set(bx, h / 2, bz);
      this.worldGroup.add(bldg);
      this.colliders.push({ x: bx, z: bz, hw: w / 2 + 1.2, hd: d / 2 + 1.2 });

      if (i % 2 === 0) {
        const sign = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, 2.2, d + 0.5), neonMats[i % neonMats.length]);
        sign.position.set(bx, h * 0.65, bz);
        this.worldGroup.add(sign);
      }
    }
  }

  setMode(inRace) {
    this.garageGroup.visible = !inRace;
    this.worldGroup.visible = inRace;
  }

  getDistrictName(pos) {
    if (pos.x > 250 && pos.z > 150) return 'DOWNTOWN NEON DISTRICT';
    if (pos.x > 300 && pos.z <= 150) return 'COASTAL WANGAN HIGHWAY';
    if (pos.z < -250) return 'MOUNTAIN TOUGE PASS';
    if (pos.x < -250) return 'NSD INTERNATIONAL AIRPORT';
    return 'APEX RACING CIRCUIT';
  }
}