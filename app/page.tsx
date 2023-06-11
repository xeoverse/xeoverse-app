"use client"

import useSWR from "swr"
import fetcher from "./swr"
import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Box from "./components/Box"
import { io } from "socket.io-client"

export default function Home() {
  const { data, error, isLoading } = useSWR('/api/hello', fetcher)

  useEffect(() => {
    const socket = io('', {
      path: "/api/socket",
      addTrailingSlash: false
    });

    socket.on('connect', () => {
      console.log("connected")
    })
  }, [])

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}
