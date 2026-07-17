import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  PresentationControls,
  useGLTF,
} from "@react-three/drei";
import type { Group } from "three";

/**
 * Drop-in replacement for ClayAvatar that loads a REAL stylized/cartoon
 * humanoid GLB instead of primitive shapes.
 *
 * DEFAULT: the vendored model in /public/avatar.glb (verified-working, no
 * network/CORS dependency — guaranteed to render from localhost).
 *
 * Pass `url` to load any remote GLB instead, e.g. the three.js rigged humans
 * or quaternius/kenney characters. For Draco-compressed GLBs set
 * `draco` to true (or a custom decoder path); for meshopt set `meshopt`.
 */
export default function GltfAvatar({
  url = "/avatar.glb",
  draco = false,
  meshopt = false,
  scale = 1,
  position = [0, -0.9, 0],
}: {
  url?: string;
  draco?: boolean | string;
  meshopt?: boolean;
  scale?: number | [number, number, number];
  position?: [number, number, number];
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 4.2], fov: 42 }}
      className="!h-full !w-full"
    >
      <color attach="background" args={["#faf5e8"]} />
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#b8a4ed" />
      <Suspense fallback={null}>
        <PresentationControls
          global
          polar={[-0.2, 0.2]}
          azimuth={[-0.6, 0.6]}
          snap
        >
          <AvatarModel url={url} draco={draco} meshopt={meshopt} scale={scale} position={position} />
        </PresentationControls>
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.35}
          scale={8}
          blur={2.6}
          far={3}
          color="#0a0a0a"
        />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}

function AvatarModel({
  url,
  draco,
  meshopt,
  scale,
  position,
}: {
  url: string;
  draco: boolean | string;
  meshopt: boolean;
  scale: number | [number, number, number];
  position: [number, number, number];
}) {
  // useGLTF loads a .glb from a local path OR a remote URL directly.
  // - draco: true uses drei's default CDN decoder; pass a string for a custom path.
  // - meshopt: true wires up the meshopt decoder.
  const { scene } = useGLTF(url, draco, meshopt);
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.18;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the default so it's cached before first paint.
useGLTF.preload("/avatar.glb");
