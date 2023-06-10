"use client"

import useSWR from "swr"
import fetcher from "./swr"
import React from 'react'
import { Canvas } from '@react-three/fiber'
import Box from "./components/Box"

export default function Home() {
  const { data, error, isLoading } = useSWR('/api/hello', fetcher)

  console.log(data)

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}
