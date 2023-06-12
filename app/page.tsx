"use client"

import useSWR from "swr"
import fetcher from "./swr"
import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Box from "./components/Box"
import Floor from "./components/Floor"
import { FirstPersonControls, Stars } from "@react-three/drei"

export default function Home() {
  const { data, error, isLoading } = useSWR('/api/hello', fetcher)

  useEffect(() => {
    const main = async () => {

      const socket = new WebSocket("wss://rust.xeoverse.io/ws")

      socket.addEventListener('open', () => {
        console.log("WS connected")
        socket.send("Text")
      })

      socket.addEventListener('message', (data) => {
        console.log(data)
      })

      socket.addEventListener('close', () => {
        console.log("WS disconnected")
      })

      socket.addEventListener('error', (err) => {
        console.log(err)
      })
    }
    main()
  }, [])

  return (
    <Canvas shadows>
      <ambientLight intensity={0.4} />
      <directionalLight
        intensity={0.5}
        castShadow
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
        position={[10, 10, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Box position={[-1.2, 0, 1]} color="purple" />
      <Box position={[1.2, 0, 2]} color="brown" />

      <Box position={[1.2, 2, -1]} color="blue" />
      <Box position={[-1.2, 2, -2]} color="green" />
      <Floor />
      <FirstPersonControls makeDefault lookSpeed={0.15} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  )
}
