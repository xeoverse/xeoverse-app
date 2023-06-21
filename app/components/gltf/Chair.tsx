/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 ./public/gltf/chair.glb --shadows --output ./app/components/gltf/Chair.tsx --types --root ./public/ --debug
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    ArmChair_01: THREE.Mesh
  }
  materials: {
    Armchair_01: THREE.MeshStandardMaterial
  }
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/gltf/chair.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.ArmChair_01.geometry} material={materials.Armchair_01} />
    </group>
  )
}

useGLTF.preload('/gltf/chair.glb')
