/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 ./public/gltf/robot.glb --shadows --output ./app/components/gltf/Robot.tsx --types --root ./public/ --debug
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Jackhammer_low002: THREE.Mesh;
    Golem_low: THREE.SkinnedMesh;
    Golem_low001: THREE.SkinnedMesh;
    Golem_low002: THREE.SkinnedMesh;
    Golem_low003: THREE.SkinnedMesh;
    Bone: THREE.Bone;
    Bone004R004: THREE.Bone;
    Bone003R003: THREE.Bone;
    Bone007R007: THREE.Bone;
    Bone004L004: THREE.Bone;
    Bone003L003: THREE.Bone;
    Bone007L007: THREE.Bone;
    neutral_bone: THREE.Bone;
  };
  materials: {
    Jackhammer_01: THREE.MeshStandardMaterial;
    Golem_2: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | "Golem_Attack_1"
  | "Golem_Attack_2"
  | "Golem_Run"
  | "Golem_Walk"
  | "Jackhammer_low.002";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Model(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<any>();
  const { nodes, materials, animations } = useGLTF(
    "/gltf/robot.glb",
  ) as GLTFResult;
  const { actions } = useAnimations<any>(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Stone_Golem">
          <group name="Golem001" position={[0, 3.001, 0.104]} scale={0.645}>
            <primitive object={nodes.Bone} />
            <primitive object={nodes.Bone004R004} />
            <primitive object={nodes.Bone003R003} />
            <primitive object={nodes.Bone007R007} />
            <primitive object={nodes.Bone004L004} />
            <primitive object={nodes.Bone003L003} />
            <primitive object={nodes.Bone007L007} />
            <primitive object={nodes.neutral_bone} />
          </group>
          <skinnedMesh
            name="Golem_low"
            geometry={nodes.Golem_low.geometry}
            material={materials.Golem_2}
            skeleton={nodes.Golem_low.skeleton}
          />
          <skinnedMesh
            name="Golem_low001"
            geometry={nodes.Golem_low001.geometry}
            material={materials.Golem_2}
            skeleton={nodes.Golem_low001.skeleton}
          />
          <skinnedMesh
            name="Golem_low002"
            geometry={nodes.Golem_low002.geometry}
            material={materials.Golem_2}
            skeleton={nodes.Golem_low002.skeleton}
          />
          <skinnedMesh
            name="Golem_low003"
            geometry={nodes.Golem_low003.geometry}
            material={materials.Golem_2}
            skeleton={nodes.Golem_low003.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/gltf/robot.glb");
