"use client"

import useSWR from "swr"
import fetcher from "./swr"
import React, { useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Box from "./components/Box"
import Floor from "./components/Floor"
import { FirstPersonControls, Stars, useKeyboardControls } from "@react-three/drei"
import useSocket from "./hooks/useSocket"
import { Controls } from "./clientLayout"

interface User {
  userId: string,
  direction: number[]
}

export default function Home() {
  // const { data, error, isLoading } = useSWR('/api/hello', fetcher)
  const [users, setUsers] = useState<User[]>([])
  const [myUserId, setMyUserId] = useState<string | null>(null)

  const socket = useSocket()

  const forwardPressed = useKeyboardControls<Controls>(state => state.forward)
  const backPressed = useKeyboardControls<Controls>(state => state.back)
  const leftPressed = useKeyboardControls<Controls>(state => state.left)
  const rightPressed = useKeyboardControls<Controls>(state => state.right)
  const jumpPressed = useKeyboardControls<Controls>(state => state.jump)

  const handleSocketMessage = useCallback((data: any) => {
    const parsed = JSON.parse(data.data)
    console.log(parsed)
    if (parsed.type === "userJoin") {
      setUsers(prev => [...prev, ...[{ userId: parsed.userId, direction: [0, 0, 0] }]])
    }
    if (parsed.type === "userLeave") {
      setUsers(prev => [...prev.filter(u => u.userId !== parsed.userId)])
    }
    if (parsed.type === "move") {
      setUsers(prev => [...prev.filter(u => u.userId !== parsed.userId), ...[{ userId: parsed.userId, direction: parsed.direction }]])
    }
  }, [])

  useEffect(() => {
    if (socket) {
      setMyUserId(Math.random().toString())

      socket.addEventListener('message', (data) => {
        handleSocketMessage(data)
      })
    }
    return () => {
      socket?.removeEventListener('message', () => { })
    }
  }, [handleSocketMessage, socket])

  useEffect(() => {
    if (myUserId && socket && (forwardPressed || backPressed || leftPressed || rightPressed || jumpPressed)) {
      let direction = [0, 0, 0]
      if (forwardPressed) direction[2] = -1
      if (backPressed) direction[2] = 1
      if (leftPressed) direction[0] = -1
      if (rightPressed) direction[0] = 1
      if (jumpPressed) direction[1] = 1
      socket.send(JSON.stringify({ type: "move", direction, userId: myUserId }))
    }
  }, [backPressed, forwardPressed, jumpPressed, leftPressed, myUserId, rightPressed, socket])

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
      {
        users.filter(user => user.userId !== myUserId).map((u) => {
          return (
            <Box position={u.direction} color="yellow" key={u.userId} />
          )
        })
      }
      <FirstPersonControls makeDefault lookSpeed={0.15}>
        <Box color="red" />
      </FirstPersonControls>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  )
}
