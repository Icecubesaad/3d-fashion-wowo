import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  PresentationControls,
  useGLTF,
  Float,
} from "@react-three/drei";
import type { Group } from "three";

/**
 * Loads a stylized low-poly human character bundled locally at /avatar.glb.
 * Bundling avoids any runtime DNS/CORS dependency. The model ships with a
 * built-in clip which we play so the character feels alive.
 */
function Character() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/michelle.glb");

  return (
    <group ref={group} position={[0, -1.15, 0]} rotation={[0, 0.4, 0]} scale={1.35}>
      <primitive object={scene} />
    </group>
  );
}

function FloatingBits() {
  const clay = (color: string) => ({
    color,
    roughness: 0.9,
    metalness: 0.03,
  });
  return (
    <>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[1.5, 1.4, -0.2]} castShadow>
          <icosahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial {...clay("#e8b94a")} />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.6}>
        <mesh position={[-1.6, 0.9, -0.1]} castShadow>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial {...clay("#a4d4c5")} />
        </mesh>
      </Float>
      <Float speed={2.4} rotationIntensity={1.2} floatIntensity={1.8}>
        <mesh position={[1.3, 0.3, 0.4]} castShadow>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial {...clay("#ff6b5a")} />
        </mesh>
      </Float>
    </>
  );
}

export default function ClayAvatar() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 5], fov: 42 }}
      className="!h-full !w-full"
    >
      <color attach="background" args={["#faf5e8"]} />
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 2, -2]} intensity={0.45} color="#b8a4ed" />
      <Suspense fallback={null}>
        <PresentationControls
          global
          polar={[-0.15, 0.25]}
          azimuth={[-0.7, 0.7]}
          snap
        >
          <Character />
          <FloatingBits />
        </PresentationControls>
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.35}
          scale={9}
          blur={2.6}
          far={3}
          color="#0a0a0a"
        />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/michelle.glb");
