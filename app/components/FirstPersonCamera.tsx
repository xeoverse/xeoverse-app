import React, { useContext, useEffect, useRef } from 'react'
import { PerspectiveCamera, PointerLockControls, useKeyboardControls } from "@react-three/drei"
import { PerspectiveCameraProps, useFrame, useThree } from '@react-three/fiber'
import { Controls } from '../clientLayout';
import { useSpringValue } from '@react-spring/web'
import { Vector3 } from 'three';
import { SocketContext } from '../socket/SocketContext';
import { MessageType } from '../socket/SocketProvider';

const FirstPersonCamera = ({ myUserId, ...props }: PerspectiveCameraProps & { myUserId?: number | null }) => {
    const socket = useContext(SocketContext);

    const { gl, camera } = useThree();
    const controls = useRef<any>(null);

    const forwardPressed = useKeyboardControls<Controls>(state => state.forward)
    const backPressed = useKeyboardControls<Controls>(state => state.back)
    const leftPressed = useKeyboardControls<Controls>(state => state.left)
    const rightPressed = useKeyboardControls<Controls>(state => state.right)
    const jumpPressed = useKeyboardControls<Controls>(state => state.jump)
    const ePressed = useKeyboardControls<Controls>(state => state.e)

    const positionXSpring = useSpringValue(0)
    const positionYSpring = useSpringValue(0)
    const positionZSpring = useSpringValue(0)

    const rotationXSpring = useSpringValue(0)
    const rotationYSpring = useSpringValue(0)

    const velocityYSpring = useSpringValue(0)

    useEffect(() => {
        if (camera) {
            camera.rotation.order = 'YXZ'
        }
    }, [camera])

    useEffect(() => {
        const handleFocus = () => {
            controls?.current?.lock();
        };
        document.addEventListener("click", handleFocus);
        return () => {
            document.removeEventListener("click", handleFocus);
        };
    }, [gl]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!controls.current.isLocked) return
            const sensitivity = 0.001
            const prevRotationX = rotationXSpring.get()
            const prevRotationY = rotationYSpring.get()

            const newRotationX = prevRotationX - event.movementY * sensitivity
            const newRotationY = prevRotationY - event.movementX * sensitivity

            rotationXSpring.set(newRotationX)
            rotationYSpring.set(newRotationY)

            const rotationDiff = [newRotationX - prevRotationX, newRotationY - prevRotationY, 0]

            if (myUserId && socket?.OPEN) {
                if (rotationDiff.some(v => v !== 0)) {
                    socket.send(`${MessageType.UserRotate} ${rotationDiff}`)
                }
            }
        }
        document.addEventListener('mousemove', handleMouseMove)
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [myUserId, rotationXSpring, rotationYSpring, socket])

    useFrame(() => {
        if (!camera) return

        const forward = forwardPressed ? 1 : 0
        const back = backPressed ? 1 : 0
        const left = leftPressed ? 1 : 0
        const right = rightPressed ? 1 : 0
        const jump = jumpPressed ? 1 : 0
        const speed = 0.05
        const jumpSpeed = 0.1
        const gravity = -0.0025

        const prevPosition = [positionXSpring.get(), positionYSpring.get(), positionZSpring.get()]

        if (prevPosition[1] > 0) {
            velocityYSpring.set(velocityYSpring.get() + gravity)
        }

        if (jump) {
            velocityYSpring.set(jumpSpeed)
        }

        if (positionYSpring.get() < 0) {
            positionYSpring.set(0)
            velocityYSpring.set(0)
        }

        const newPosition = [
            positionXSpring.get() + speed * (-forward * Math.sin(camera.rotation.y) + back * Math.sin(camera.rotation.y) + left * Math.sin(camera.rotation.y - Math.PI / 2) + right * Math.sin(camera.rotation.y + Math.PI / 2)),
            positionYSpring.get() + velocityYSpring.get(),
            positionZSpring.get() + speed * (-forward * Math.cos(camera.rotation.y) + back * Math.cos(camera.rotation.y) + left * Math.cos(camera.rotation.y - Math.PI / 2) + right * Math.cos(camera.rotation.y + Math.PI / 2))
        ]

        positionXSpring.set(newPosition[0])
        positionYSpring.set(newPosition[1])
        positionZSpring.set(newPosition[2])

        camera.position.x = positionXSpring.get()
        camera.position.y = positionYSpring.get()
        camera.position.z = positionZSpring.get()

        camera.rotation.x = rotationXSpring.get()
        camera.rotation.y = rotationYSpring.get()

        camera.updateProjectionMatrix()

        if (myUserId && socket?.OPEN) {
            const positionDiff = prevPosition.map((v, i) => newPosition[i] - v)

            if (positionDiff.some(v => v !== 0)) {
                socket.send(`${MessageType.UserMove} ${positionDiff}`)
            }
        }
    })

    useEffect(() => {
        if (ePressed && camera) {
            const cameraDirection = camera.getWorldDirection(new Vector3())
            const multiplier = 10
            positionXSpring.set(positionXSpring.get() + cameraDirection.x * multiplier)
            positionYSpring.set(positionYSpring.get() + cameraDirection.y * multiplier)
            positionZSpring.set(positionZSpring.get() + cameraDirection.z * multiplier)
        }
    }, [camera, ePressed, positionXSpring, positionYSpring, positionZSpring])

    return (
        <>
            <PerspectiveCamera makeDefault {...props} />
            <PointerLockControls
                ref={controls}
            />
        </>
    )
}

export default FirstPersonCamera