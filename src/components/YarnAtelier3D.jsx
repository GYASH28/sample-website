import { useEffect, useRef } from "react";
import * as THREE from "three";

const BRAND = {
  teal: 0x40aaa7,
  tealDark: 0x176967,
  tealLight: 0x83d3ce,
  rose: 0xd889a1,
  roseLight: 0xf2b8c8,
  wicker: 0xc78d52,
  wickerDark: 0x7e4e2a,
  cream: 0xf4f1ec,
  mulberry: 0x452735,
};

function addYarnBall(parent, { color, position, radius, rotation }) {
  const ball = new THREE.Group();
  const baseMaterial = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.58,
    metalness: 0.04,
    clearcoat: 0.12,
    clearcoatRoughness: 0.72,
  });
  const strandMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).offsetHSL(0, -0.03, 0.06),
    roughness: 0.74,
    metalness: 0,
  });
  const base = new THREE.Mesh(
    new THREE.IcosahedronGeometry(radius * 0.93, 3),
    baseMaterial,
  );
  ball.add(base);

  for (let index = 0; index < 8; index += 1) {
    const strand = new THREE.Mesh(
      new THREE.TorusGeometry(
        radius * (0.94 + (index % 3) * 0.012),
        radius * 0.027,
        6,
        56,
      ),
      strandMaterial,
    );
    strand.rotation.set(
      Math.PI * (0.15 + index * 0.18),
      Math.PI * (0.1 + index * 0.27),
      Math.PI * index * 0.11,
    );
    ball.add(strand);
  }

  ball.position.copy(position);
  ball.rotation.set(...rotation);
  parent.add(ball);
  return ball;
}

function makeNeedle() {
  const needle = new THREE.Group();
  const wood = new THREE.MeshPhysicalMaterial({
    color: BRAND.wicker,
    roughness: 0.34,
    metalness: 0.04,
    clearcoat: 0.45,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: 0xe7dfd8,
    roughness: 0.18,
    metalness: 0.86,
  });
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 4.4, 14),
    wood,
  );
  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.078, 0.62, 14),
    metal,
  );
  tip.position.y = -2.48;
  tip.rotation.z = Math.PI;
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 18, 12),
    metal,
  );
  cap.position.y = 2.24;
  needle.add(shaft, tip, cap);
  needle.rotation.set(0.2, -0.45, 0.8);
  needle.position.set(0.55, -0.35, 1.28);
  return needle;
}

function makeCrochetHalo() {
  const halo = new THREE.Group();
  const rose = new THREE.MeshPhysicalMaterial({
    color: BRAND.rose,
    roughness: 0.68,
    metalness: 0,
    clearcoat: 0.05,
  });
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.35, 0.045, 8, 112),
    rose,
  );
  halo.add(ring);

  for (let index = 0; index < 28; index += 1) {
    const angle = (index / 28) * Math.PI * 2;
    const loop = new THREE.Mesh(
      new THREE.TorusGeometry(0.27, 0.032, 6, 24),
      rose,
    );
    loop.position.set(Math.cos(angle) * 2.48, Math.sin(angle) * 2.48, 0);
    loop.rotation.z = angle + Math.PI / 2;
    loop.scale.set(1, 1.65, 1);
    halo.add(loop);
  }
  return halo;
}

function disposeScene(scene, renderer) {
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (Array.isArray(object.material)) {
      object.material.forEach((material) => material.dispose());
    } else if (object.material) {
      object.material.dispose();
    }
  });
  renderer.dispose();
}

export default function YarnAtelier3D() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const compact = window.matchMedia("(max-width: 700px)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !compact,
        powerPreference: compact ? "low-power" : "high-performance",
      });
    } catch {
      stage.dataset.fallback = "true";
      return undefined;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.05, 8.1);

    const atelier = new THREE.Group();
    atelier.rotation.set(-0.06, -0.08, 0.02);
    scene.add(atelier);

    const halo = makeCrochetHalo();
    halo.position.z = -0.58;
    atelier.add(halo);

    const haloInner = new THREE.Mesh(
      new THREE.TorusGeometry(1.82, 0.075, 8, 96),
      new THREE.MeshPhysicalMaterial({
        color: BRAND.wicker,
        roughness: 0.42,
        metalness: 0.02,
        clearcoat: 0.3,
      }),
    );
    haloInner.position.z = -0.22;
    atelier.add(haloInner);

    const balls = [
      addYarnBall(atelier, {
        color: BRAND.teal,
        position: new THREE.Vector3(-0.72, 0.58, 0.46),
        radius: 0.96,
        rotation: [0.2, 0.1, -0.24],
      }),
      addYarnBall(atelier, {
        color: BRAND.tealLight,
        position: new THREE.Vector3(0.83, 0.47, 0.18),
        radius: 0.84,
        rotation: [-0.18, 0.36, 0.18],
      }),
      addYarnBall(atelier, {
        color: BRAND.tealDark,
        position: new THREE.Vector3(0.27, -0.89, 0.88),
        radius: 1.04,
        rotation: [0.34, -0.28, 0.1],
      }),
    ];

    const needle = makeNeedle();
    atelier.add(needle);

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -0.24);
    heartShape.bezierCurveTo(-0.78, -0.78, -1.15, 0.12, -0.52, 0.5);
    heartShape.bezierCurveTo(-0.2, 0.7, 0, 0.5, 0, 0.32);
    heartShape.bezierCurveTo(0, 0.5, 0.2, 0.7, 0.52, 0.5);
    heartShape.bezierCurveTo(1.15, 0.12, 0.78, -0.78, 0, -0.24);
    const heart = new THREE.Mesh(
      new THREE.ExtrudeGeometry(heartShape, {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.05,
        bevelThickness: 0.05,
      }),
      new THREE.MeshPhysicalMaterial({
        color: BRAND.roseLight,
        roughness: 0.28,
        clearcoat: 0.75,
        metalness: 0.02,
      }),
    );
    heart.scale.setScalar(0.25);
    heart.position.set(1.82, 1.3, 0.72);
    heart.rotation.set(0.18, -0.25, 0.12);
    atelier.add(heart);

    const particleCount = compact ? 90 : 210;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 2.6 + Math.random() * 1.25;
      const angle = Math.random() * Math.PI * 2;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(angle) * radius;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: BRAND.rose,
        size: compact ? 0.018 : 0.024,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );
    atelier.add(particles);

    scene.add(new THREE.HemisphereLight(BRAND.cream, BRAND.mulberry, 2.45));
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.4);
    keyLight.position.set(4, 5, 7);
    scene.add(keyLight);
    const roseLight = new THREE.PointLight(BRAND.rose, 18, 11);
    roseLight.position.set(-3.4, -1.6, 4.5);
    scene.add(roseLight);
    const tealLight = new THREE.PointLight(BRAND.teal, 12, 10);
    tealLight.position.set(3.4, 2, 3.6);
    scene.add(tealLight);

    const target = { x: 0, y: 0 };
    let pointerFrame = 0;
    let animationFrame = 0;
    let visible = true;
    let pageVisible = !document.hidden;

    const render = () => renderer.render(scene, camera);

    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };

    const onPointerMove = (event) => {
      if (reducedMotion) return;
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const bounds = stage.getBoundingClientRect();
        target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        target.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      });
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const animate = (timestamp = performance.now()) => {
      if (!visible || !pageVisible || reducedMotion) {
        animationFrame = 0;
        render();
        return;
      }
      const elapsed = timestamp * 0.001;
      atelier.rotation.y += (target.x * 0.17 - atelier.rotation.y) * 0.035;
      atelier.rotation.x += (-target.y * 0.11 - 0.05 - atelier.rotation.x) * 0.035;
      atelier.position.y = Math.sin(elapsed * 0.7) * 0.06;
      halo.rotation.z = elapsed * 0.035;
      particles.rotation.z = -elapsed * 0.018;
      balls[0].rotation.y += 0.0018;
      balls[1].rotation.x -= 0.0014;
      balls[2].rotation.z += 0.0011;
      needle.position.y = -0.35 + Math.sin(elapsed * 0.92) * 0.035;
      heart.rotation.y = Math.sin(elapsed * 0.8) * 0.2 - 0.25;
      render();
      animationFrame = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!animationFrame && visible && pageVisible && !reducedMotion) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        render();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible && animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        } else {
          start();
        }
      },
      { rootMargin: "120px", threshold: 0.02 },
    );
    visibilityObserver.observe(stage);

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (!pageVisible && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else {
        start();
      }
    };

    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    resize();
    stage.dataset.ready = "true";
    start();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      disposeScene(scene, renderer);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="yarn-atelier"
      aria-label="Interactive three-dimensional arrangement of Fakhri Mart yarn, crochet and knitting materials"
    >
      <picture className="yarn-atelier__fallback">
        <source
          srcSet="/assets/brand/fakhri-logo-640.avif"
          type="image/avif"
        />
        <img
          src="/assets/brand/fakhri-logo-640.webp"
          alt="Fakhri Mart Yarn Store logo with teal yarn, knitting needle and a pink crochet border"
          width="640"
          height="640"
          decoding="async"
        />
      </picture>
      <canvas ref={canvasRef} className="yarn-atelier__canvas" aria-hidden="true" />
      <div className="yarn-atelier__ring" aria-hidden="true" />
      <div className="yarn-atelier__status" aria-hidden="true">
        <span />
        Interactive yarn atelier
      </div>
      <picture className="yarn-atelier__brand-seal">
        <source srcSet="/assets/brand/fakhri-logo-256.webp" type="image/webp" />
        <img
          src="/assets/brand/fakhri-logo-256.webp"
          alt=""
          width="256"
          height="256"
        />
      </picture>
    </div>
  );
}
