/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 ./public/gltf/office.glb --shadows --output ./app/components/gltf/Office.tsx --types --root ./public/ --debug
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Floor: THREE.Mesh;
    Plane014: THREE.Mesh;
    Plane014_1: THREE.Mesh;
    Plane013: THREE.Mesh;
    Plane013_1: THREE.Mesh;
    Plane012: THREE.Mesh;
    Plane012_1: THREE.Mesh;
    Plane011: THREE.Mesh;
    Plane011_1: THREE.Mesh;
    Glass001: THREE.Mesh;
    Glass002: THREE.Mesh;
    Profile: THREE.Mesh;
    Profile001: THREE.Mesh;
    TopProfile: THREE.Mesh;
  };
  materials: {
    _Black: THREE.MeshStandardMaterial;
    aluminum2: THREE.MeshStandardMaterial;
    _White: THREE.MeshStandardMaterial;
    _GlassReal: THREE.MeshStandardMaterial;
    ["Real glass"]: THREE.MeshStandardMaterial;
    ["_White.001"]: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | "Glass Building"
  | "Floor"
  | "Floor.001"
  | "Floor.002"
  | "Floor.003"
  | "Glass"
  | "Glass.001"
  | "Glass.002"
  | "Profile"
  | "Profile.001"
  | "TopProfile";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Model(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<any>();
  const { nodes, materials, animations } = useGLTF(
    "/gltf/office.glb",
  ) as GLTFResult;
  const { actions } = useAnimations<any>(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Glass_Building">
          <mesh
            name="Floor"
            castShadow
            receiveShadow
            geometry={nodes.Floor.geometry}
            material={materials._Black}
          />
          <group name="Floor001">
            <mesh
              name="Plane014"
              castShadow
              receiveShadow
              geometry={nodes.Plane014.geometry}
              material={materials.aluminum2}
            />
            <mesh
              name="Plane014_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane014_1.geometry}
              material={materials._White}
            />
          </group>
          <group name="Floor002">
            <mesh
              name="Plane013"
              castShadow
              receiveShadow
              geometry={nodes.Plane013.geometry}
              material={materials.aluminum2}
            />
            <mesh
              name="Plane013_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane013_1.geometry}
              material={materials._White}
            />
          </group>
          <group name="Floor003">
            <mesh
              name="Plane012"
              castShadow
              receiveShadow
              geometry={nodes.Plane012.geometry}
              material={materials.aluminum2}
            />
            <mesh
              name="Plane012_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane012_1.geometry}
              material={materials._White}
            />
          </group>
          <group name="Glass">
            <mesh
              name="Plane011"
              castShadow
              receiveShadow
              geometry={nodes.Plane011.geometry}
              material={materials.aluminum2}
            />
            <mesh
              name="Plane011_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane011_1.geometry}
              material={materials._GlassReal}
            />
          </group>
          <mesh
            name="Glass001"
            castShadow
            receiveShadow
            geometry={nodes.Glass001.geometry}
            material={materials["Real glass"]}
          />
          <mesh
            name="Glass002"
            castShadow
            receiveShadow
            geometry={nodes.Glass002.geometry}
            material={materials._GlassReal}
          />
          <mesh
            name="Profile"
            castShadow
            receiveShadow
            geometry={nodes.Profile.geometry}
            material={materials["_White.001"]}
          />
          <mesh
            name="Profile001"
            castShadow
            receiveShadow
            geometry={nodes.Profile001.geometry}
            material={materials["_White.001"]}
          />
          <mesh
            name="TopProfile"
            castShadow
            receiveShadow
            geometry={nodes.TopProfile.geometry}
            material={materials._Black}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/gltf/office.glb");
