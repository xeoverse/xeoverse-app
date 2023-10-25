import React, { Suspense, useLayoutEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import { Plane } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Mesh, PlaneGeometry } from "three";

const Terrain = () => {
  const mesh = useRef<Mesh<PlaneGeometry>>(null!);

  useLayoutEffect(() => {
    mesh.current.rotation.z += 0.001;
    const geometry = mesh.current.geometry;
    const noise = createNoise2D(Math.random);
    let pos = geometry.getAttribute("position");
    let pa = pos.array;
    console.log(geometry);
    const hVerts = geometry.parameters.heightSegments + 1;
    const wVerts = geometry.parameters.widthSegments + 1;
    for (let j = 0; j < hVerts; j++) {
      for (let i = 0; i < wVerts; i++) {
        const ex = 1.4;
        pa[3 * (j * wVerts + i) + 2] =
          (noise(i / 100, j / 100) +
            noise((i + 200) / 50, j / 50) * Math.pow(ex, 1) +
            noise((i + 400) / 25, j / 25) * Math.pow(ex, 2) +
            noise((i + 600) / 12.5, j / 12.5) * Math.pow(ex, 3) +
            +(noise((i + 800) / 6.25, j / 6.25) * Math.pow(ex, 4))) /
          2;
      }
    }

    pos.needsUpdate = true;
  }, []);

  return (
    <Suspense fallback={null}>
      <RigidBody
        colliders="trimesh"
        restitution={0}
        gravityScale={0}
        lockRotations
        lockTranslations
        position={[160, -1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <Plane args={[200, 200, 75, 75]} ref={mesh}>
          <meshPhongMaterial
            attach="material"
            color={"hotpink"}
            specular={"hotpink"}
            shininess={3}
            flatShading
          />
        </Plane>
      </RigidBody>
    </Suspense>
  );
};

export default Terrain;
