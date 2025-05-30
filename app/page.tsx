"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const textContainer = textContainerRef.current;
    if (!container || !textContainer) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const baseColor = new THREE.Color("#ffa600");
    const highlightColor = new THREE.Color("#3c2700");

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        baseColor: { value: baseColor },
        highlightColor: { value: highlightColor },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec3 baseColor;
        uniform vec3 highlightColor;
        varying vec2 vUv;
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float len = length(p);
          float wave = sin(u_time * 2.0 + len * 10.0) * 0.1;
          vec2 distort = vec2(
            p.x + wave * cos(len * 8.0 + u_time),
            p.y + wave * sin(len * 8.0 + u_time)
          );
          float mixFactor = 0.5 + 0.5 * sin(distort.x * 5.0 + distort.y * 5.0 + u_time);
          vec3 color = mix(baseColor, highlightColor, mixFactor);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const animate = () => {
      material.uniforms.u_time.value += 0.01;

      // Animate individual letters
      const letters = textContainer.querySelectorAll("span");
      letters.forEach((letter, index) => {
        const time = material.uniforms.u_time.value;
        const offset = index * 0.1;
        const wiggleX = Math.sin(time * 3 + offset) * 5;
        const wiggleY = Math.cos(time * 3 + offset) * 5;
        (
          letter as HTMLElement
        ).style.transform = `translate(${wiggleX}px, ${wiggleY}px)`;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      container.removeChild(renderer.domElement);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="absolute inset-0" ref={containerRef}>
      <div className="absolute inset-0 backdrop-blur-lg flex items-center justify-center">
        <div
          ref={textContainerRef}
          className="flex text-[#804010]/60 font-semibold text-3xl sm:text-6xl md:text-7xl lg:text-8xl [text-shadow:_1px_1px_0_rgba(0,0,0,0.3)]"
        >
          {"Under Construction".split("").map((letter, index) => (
            <span key={index} className="inline-block">
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
