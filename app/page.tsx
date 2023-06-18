"use client"

import useSWR from "swr"
import fetcher from "./swr"
import React, { useCallback, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import Box from "./components/Box"
import Floor from "./components/Floor"
import { FirstPersonControls, Sphere, Stars } from "@react-three/drei"
import useSocket from "./hooks/useSocket"
import { Vector3 } from "three"

const arraytoVector3 = (arr: number[]) => {
  return new Vector3(arr[0], arr[1], arr[2])
}

interface User {
  userId: string,
  position: number[]
}

export default function Home() {
  // const { data, error, isLoading } = useSWR('/api/hello', fetcher)
  const [users, setUsers] = useState<User[]>([])

  const [myPosition, setMyPosition] = useState<number[]>([0, 0, 0])
  const [myUserId, setMyUserId] = useState<string | null>(null)

  const { camera } = useThree()

  const socket = useSocket()

  const handleSocketMessage = useCallback((data: any) => {
    const parsed = JSON.parse(data?.data || "{}")
    if (parsed.type === "userInit") {
      setMyUserId(parsed.userId)
      setUsers(Object.entries(parsed.userPositions).map(([userId, position]) => ({ userId, position: position as number[] })) || [])
    }
    if (parsed.type === "userJoin") {
      setUsers(prev => [...prev.filter(u => u.userId !== parsed.userId), ...[{ userId: parsed.userId, position: [0, 0, 0] }]])
    }
    if (parsed.type === "userLeave") {
      setUsers(prev => [...prev.filter(u => u.userId !== parsed.userId)])
    }
    if (parsed.type === "userMove") {
      setUsers(prev => {
        const user = prev.find(u => u.userId === parsed.userId)
        if (user) {
          return [...prev.filter(u => u.userId !== parsed.userId), ...[{ userId: parsed.userId, position: user.position.map((v, i) => v + parsed.position[i]) }]]
        } else {
          return [...prev, ...[{ userId: parsed.userId, position: parsed.position }]]
        }
      })
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (data) => {
        handleSocketMessage(data)
      })

      socket.addEventListener('open', (data) => {
        handleSocketMessage(data)
      })
    }
    return () => {
      socket?.removeEventListener('message', () => { })
      socket?.removeEventListener('open', () => { })
    }
  }, [handleSocketMessage, socket])

  useEffect(() => {
    const interval = setInterval(() => {
      if (myUserId && socket) {
        const prevPosition = myPosition
        const newPosition = camera.position.toArray()
        setMyPosition(newPosition)

        const positionDiff = newPosition.map((v, i) => v - prevPosition[i])

        if (positionDiff.some(v => v !== 0)) {
          socket.send(JSON.stringify({ type: "userMove", position: positionDiff, userId: myUserId }))
        }

      }
    }, 1000 / 60)

    return () => {
      clearInterval(interval)
    }
  }, [camera.position, myPosition, myUserId, socket])

  return (
    <>
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
            <Sphere position={arraytoVector3(u.position)} key={u.userId} castShadow args={[0.2, 20, 20]}>
              <meshPhysicalMaterial attach="material" color="gold" />
            </Sphere>
          )
        })
      }
      <FirstPersonControls makeDefault lookSpeed={0.15} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  )
}
