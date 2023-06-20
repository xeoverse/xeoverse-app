/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 ./public/gltf/test1.glb --shadows --output ./app/components/gltf/TestGLTF.tsx --types --root ./public/ --debug
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Plane: THREE.Mesh
    Cube: THREE.Mesh
    Cone: THREE.Mesh
    Suzanne: THREE.Mesh
    Torus: THREE.Mesh
    Sphere: THREE.Mesh
    Sphere001: THREE.Mesh
    Cylinder: THREE.Mesh
  }
  materials: {
    pink: THREE.MeshStandardMaterial
    jade: THREE.MeshPhysicalMaterial
    cobolt: THREE.MeshPhysicalMaterial
    ['yellow-shine']: THREE.MeshPhysicalMaterial
    ['Material.001']: THREE.MeshPhysicalMaterial
    copper: THREE.MeshPhysicalMaterial
    ['Material.003']: THREE.MeshPhysicalMaterial
    Material: THREE.MeshStandardMaterial
  }
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/gltf/test1.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Plane.geometry} material={materials.pink} position={[-1.401, 0, -4.563]} scale={[30, 10, 30]} />
      <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} material={materials.jade} position={[1.768, 1.019, -0.361]} />
      <mesh castShadow receiveShadow geometry={nodes.Cone.geometry} material={materials.cobolt} position={[-2.99, 1.014, 1.397]} />
      <mesh castShadow receiveShadow geometry={nodes.Suzanne.geometry} material={materials['yellow-shine']} position={[1.635, 2.575, -0.355]} rotation={[-0.653, 0.29, 0.274]} scale={[1, 1, 0.88]} />
      <mesh castShadow receiveShadow geometry={nodes.Torus.geometry} material={materials['Material.001']} position={[-0.462, 0.291, 1.279]} />
      <mesh castShadow receiveShadow geometry={nodes.Sphere.geometry} material={materials.copper} position={[-1.962, 2.979, -0.885]} />
      <mesh castShadow receiveShadow geometry={nodes.Sphere001.geometry} material={materials['Material.003']} position={[0.659, 1.013, -5.046]} />
      <mesh castShadow receiveShadow geometry={nodes.Cylinder.geometry} material={materials.Material} position={[-1.897, 0.994, -0.912]} />
    </group>
  )
}

useGLTF.preload('/gltf/test1.glb')
