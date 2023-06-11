"use client"

import useSWR from "swr"
import fetcher from "./swr"
import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Box from "./components/Box"

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
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}
