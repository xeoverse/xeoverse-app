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

    const socket = io("wss://xeoverse.io", {
      path: "/api/socket",
    });

    socket.on('connect', () => {
      console.log("connected")
      socket.send("message", { message: "hello" })
    })

    socket.on('message', (data) => {
      console.log(data)
    })

    socket.on('disconnect', () => {
      console.log("disconnected")
    })

    socket.on('error', (err) => {
      console.log(err)
    })

    return () => {
      socket.disconnect()
    }
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
