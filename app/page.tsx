"use client"

import React, { Suspense, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import Box from "./components/Box"
import Floor from "./components/Floor"
import { Cone, FirstPersonControls, Sphere, Stars, useKeyboardControls, Box as DreiBox } from "@react-three/drei"
import { Vector3 } from "three"
import { RapierRigidBody, RigidBody } from "@react-three/rapier"
import { Controls } from "./clientLayout"
import User from './components/User'
import { arrayToEuler, arraytoVector3, multiplyVector3 } from './helpers'
import { Model as TestGLTF } from './components/gltf/TestGLTF'
import { Model as ChairGLTF } from './components/gltf/Chair'
import { Model as RobotGLTF } from './components/gltf/Robot'
import { Model as OfficeGLTF } from './components/gltf/Office'
import { Model as FieldGLTF } from './components/gltf/Field'
import { SocketContext } from './socket/SocketContext'
import { MessageType, UserStates } from './socket/SocketProvider'
import BulletsManager from './components/Bullets/BulletsManager'

interface User {
  userId: number,
  position: number[]
  rotation: number[]
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])

  const [myPosition, setMyPosition] = useState<number[]>([0, 0, 0])
  const [myRotation, setMyRotation] = useState<number[]>([0, 0, 0])
  const [myUserId, setMyUserId] = useState<number | null>(null)

  const [isFirstPerson, setIsFirstPerson] = useState<boolean>(true)

  const escapePressed = useKeyboardControls<Controls>(state => state.escape)

  const soccerBall = useRef<RapierRigidBody>(null);

  const { camera } = useThree()

  const socket = useContext(SocketContext);

  const handleSocketMessage = useCallback((msg: any) => {
    if (!msg?.data) return;

    const parsed = msg?.data?.split(" ");
    const type = Number(parsed?.[0]) ?? null;
    const userId = Number(parsed?.[1]) ?? null;
    const data1 = parsed?.[2];

    if (type === null) return console.log("Invalid message received from server")

    if (type === MessageType.UserInit && userId !== null) {
      console.log("UserInit", userId)
      setMyUserId(userId)
      const userStates = JSON.parse(data1) as UserStates
      return setUsers(Object.entries(userStates).map(([userId, { position, rotation }]) => ({ userId: Number(userId), position, rotation })) || [])
    }
    if (type === MessageType.UserJoin && userId !== null) {
      setUsers(prev => {
        const filteredUsers = prev.filter(u => u.userId !== userId)
        return [...filteredUsers, ...[{ userId, position: [0, 1, 0], rotation: [0, 0, 0] }]]
      })
    }
    if (type === MessageType.UserLeave && userId !== null) {
      return setUsers(prev => prev.filter(u => u.userId !== userId))
    }
    if (type === MessageType.UserMove && userId !== null && data1) {
      const position = data1.split(",").map((v: string) => parseFloat(v))
      return setUsers(prev => {
        const user = prev.find(u => u.userId === userId)
        const filteredUsers = prev.filter(u => u.userId !== userId)
        const userUpdate = { userId, position: user?.position.map((v, i) => v + position[i]) || [0, 0, 0], rotation: user?.rotation || [0, 0, 0] }
        return [...filteredUsers, ...[userUpdate]]
      })
    }
    if (type === MessageType.UserRotate && userId !== null && data1) {
      const rotation = data1.split(",").map((v: string) => parseFloat(v))
      return setUsers(prev => {
        const user = prev.find(u => u.userId === userId)
        const filteredUsers = prev.filter(u => u.userId !== userId)
        const userUpdate = { userId, position: user?.position || [0, 0, 0], rotation: user?.rotation.map((v, i) => v + rotation[i]) || [0, 0, 0] }
        return [...filteredUsers, ...[userUpdate]]
      })
    }
  }, [])

  useEffect(() => {
    if (escapePressed) {
      setIsFirstPerson(prev => !prev)
    }
  }, [escapePressed])

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
      if (myUserId && socket?.OPEN) {
        const prevPosition = myPosition
        const newPosition = camera.position.toArray()
        setMyPosition(newPosition)

        const prevRotation = myRotation
        const newRotation = camera.rotation.toArray().slice(0, 3) as number[];
        setMyRotation(newRotation)

        const rotationDiff = newRotation.map((v, i) => v - prevRotation[i])
        const positionDiff = newPosition.map((v, i) => v - prevPosition[i])

        if (rotationDiff.some(v => v !== 0)) {
          socket.send(`${MessageType.UserRotate} ${rotationDiff}`)
        }

        if (positionDiff.some(v => v !== 0)) {
          socket.send(`${MessageType.UserMove} ${positionDiff}`)
        }
      }
    }, 1000 / 60)

    return () => {
      clearInterval(interval)
    }
  }, [camera.position, camera.rotation, myPosition, myRotation, myUserId, socket])

  const handleSoccerBallClick = useCallback(() => {
    if (soccerBall.current) {
      const cameraDirection = camera.getWorldDirection(new Vector3())
      soccerBall.current.applyImpulse(multiplyVector3(cameraDirection, 4), true)
    }
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        intensity={0.7}
        castShadow
        shadow-mapSize-height={1024 * 4}
        shadow-mapSize-width={1024 * 4}
        shadow-camera-left={40}
        shadow-camera-right={-40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        position={[100, 80, 75]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      <Box position={[1.2, 2, -5]} color="blue" />
      <Box position={[-1.2, 2, -8]} color="green" />

      <RigidBody colliders={"hull"} restitution={2}>
        <Sphere position={[-5, 1, -10]} args={[2, 5, 5]}>
          <meshPhysicalMaterial attach="material" color="brown" wireframe />
        </Sphere>
      </RigidBody>

      <RigidBody colliders={"hull"} restitution={0.5}>
        <DreiBox position={[15, 0, 0]} args={[2, 2, 15]} castShadow receiveShadow>
          <meshBasicMaterial attach="material" color="brown" />
        </DreiBox>
      </RigidBody>

      <Suspense fallback={null}>
        <RigidBody colliders="hull">
          <TestGLTF position={arraytoVector3([0, -1.1, 0])} />
        </RigidBody>
      </Suspense>

      <Suspense fallback={null}>
        <RigidBody colliders="hull">
          <ChairGLTF position={arraytoVector3([7, -1.1, 4])} />
        </RigidBody>
      </Suspense>

      <Suspense fallback={null}>
        <RigidBody colliders="hull" restitution={0.1}>
          <RobotGLTF position={arraytoVector3([7, 0, -7])} />
        </RigidBody>
      </Suspense>

      <Suspense fallback={null}>
        <RigidBody colliders="hull" restitution={0}>
          <OfficeGLTF position={arraytoVector3([12, -0.5, -15])} />
        </RigidBody>
      </Suspense>

      <Suspense fallback={null}>
        <RigidBody colliders="trimesh" restitution={0}>
          <FieldGLTF position={arraytoVector3([-30, 1, -0])} />
        </RigidBody>

        <RigidBody colliders={"ball"} restitution={1.75} ref={soccerBall}>
          <Sphere position={[-30, 2, 0]} args={[0.5, 20, 20]} onClick={handleSoccerBallClick} castShadow receiveShadow>
            <meshPhysicalMaterial attach="material" color="white" />
          </Sphere>
        </RigidBody>
      </Suspense>

      {
        users.filter(user => user.userId !== myUserId).map((u) => {
          return (
            <User key={u.userId} userId={u.userId} position={u.position} rotation={u.rotation} />
          )
        })
      }

      <BulletsManager />

      <FirstPersonControls makeDefault lookSpeed={0.15} enabled={isFirstPerson} movementSpeed={4} />

      <group position={arraytoVector3(myPosition)} rotation={arrayToEuler(myRotation)}>
        <Cone castShadow args={[0.3, 0.7, 8]} rotation={arrayToEuler([-90, 0, 0])} >
          <meshPhysicalMaterial attach="material" color="gold" />
        </Cone>
      </group>

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Floor />
    </>
  )
}
