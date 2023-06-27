import { useContext, useEffect, useRef, useState } from "react";
import { PerspectiveCamera, PointerLockControls, Sphere, useKeyboardControls } from "@react-three/drei";
import { Controls } from "../clientLayout";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { useSpringValue } from "@react-spring/web";
import { SocketContext } from "../socket/SocketContext";
import { MessageType } from "../socket/SocketProvider";

interface MyUserProps {
    userId?: number | null;
}

const MyUser = ({ userId }: MyUserProps) => {
    const userRef = useRef<RapierRigidBody>(null);
    const meshRef = useRef<Mesh>(null);
    const controls = useRef<any>(null);

    const { gl, camera } = useThree();

    const socket = useContext(SocketContext);

    const forwardPressed = useKeyboardControls<Controls>(state => state.forward)
    const backPressed = useKeyboardControls<Controls>(state => state.back)
    const leftPressed = useKeyboardControls<Controls>(state => state.left)
    const rightPressed = useKeyboardControls<Controls>(state => state.right)
    const jumpPressed = useKeyboardControls<Controls>(state => state.jump)
    const shiftPressed = useKeyboardControls<Controls>(state => state.shift)

    const rotationXSpring = useSpringValue(0)
    const rotationYSpring = useSpringValue(0)

    const [prevPosition, setPrevPosition] = useState<Vector3>(new Vector3());

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
            if (!controls?.current?.isLocked) return
            const sensitivity = 0.001

            const prevRotationX = rotationXSpring.get()
            const prevRotationY = rotationYSpring.get()

            const newRotationX = prevRotationX - event.movementY * sensitivity
            const newRotationY = prevRotationY - event.movementX * sensitivity

            rotationXSpring.set(newRotationX)
            rotationYSpring.set(newRotationY)

            const rotationDiff = [newRotationX - prevRotationX, newRotationY - prevRotationY, 0]

            if (rotationDiff.some(v => v !== 0) && userId && socket?.OPEN) {
                socket.send(`${MessageType.UserRotate} ${rotationDiff}`)
            }
        }
        document.addEventListener('mousemove', handleMouseMove)
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [userId, rotationXSpring, rotationYSpring, socket])

    useFrame(() => {
        const position = camera?.getWorldPosition(new Vector3())
        setPrevPosition(position)

        const positionDiff = position.clone().sub(prevPosition).toArray().map(v => v.toFixed(32))

        if (positionDiff.some(v => v !== Number(0.0).toFixed(32)) && userId && socket?.OPEN) {
            socket.send(`${MessageType.UserMove} ${positionDiff}`)
        }

        const cameraDirection = camera.getWorldDirection(new Vector3()).clone()
        const velocity = userRef.current?.linvel()
        const upwardVelocity = new Vector3(0, velocity?.y ?? 0, 0)

        if (forwardPressed && leftPressed) {
            cameraDirection.multiplyScalar(-1)
            cameraDirection.applyAxisAngle(new Vector3(0, -1, 1), -Math.PI / 4)
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(-5)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        }
        if (forwardPressed && rightPressed) {
            cameraDirection.multiplyScalar(-1)
            cameraDirection.applyAxisAngle(new Vector3(0, -1, 1), Math.PI / 4)
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(-5)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        }
        if (forwardPressed && shiftPressed) {
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(20)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        }
        if (forwardPressed) {
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(5)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        }
        if (backPressed && leftPressed) {
            cameraDirection.negate()
            cameraDirection.multiplyScalar(-1)
            cameraDirection.applyAxisAngle(new Vector3(0, -1, 1), Math.PI / 4)
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(-5)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        }
        if (backPressed && rightPressed) {
            cameraDirection.negate()
            cameraDirection.multiplyScalar(-1)
            cameraDirection.applyAxisAngle(new Vector3(0, -1, 1), -Math.PI / 4)
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(-5)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        }
        if (backPressed) {
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(-5)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        }
        if (leftPressed) {
            cameraDirection.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 4)
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(5)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        }
        if (rightPressed) {
            cameraDirection.applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2)
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(5)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        } else {
            setTimeout(() => {
                userRef?.current?.resetForces(true)
            }, 100)
        }
    })

    useEffect(() => {
        if (jumpPressed) {
            const linvel = userRef?.current?.linvel()
            const vector3 = new Vector3(linvel?.x, (linvel?.y ?? 0) + 5, linvel?.z)
            return userRef.current?.setLinvel(vector3, true)
        }
    }, [jumpPressed])

    useEffect(() => {
        if (shiftPressed && !forwardPressed) {
            const cameraDirection = camera.getWorldDirection(new Vector3()).clone()
            const velocity = userRef.current?.linvel()
            const upwardVelocity = new Vector3(0, velocity?.y ?? 0, 0)
            const forwardVelocity = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize().multiplyScalar(20)
            const newVelocity = forwardVelocity.add(upwardVelocity)
            return userRef.current?.setLinvel(newVelocity, true)
        }
    }, [camera, forwardPressed, shiftPressed])

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={meshRef?.current?.getWorldPosition(new Vector3()).add(new Vector3(0, 0.5, 0))}
                rotation={[rotationXSpring.get(), rotationYSpring.get(), 0]}
            />
            <RigidBody ref={userRef} colliders="cuboid">
                <Sphere castShadow args={[0.5, 10, 10]} ref={meshRef}>
                    <meshPhysicalMaterial attach="material" opacity={0} transparent />
                </Sphere>
            </RigidBody>
            <PointerLockControls
                ref={controls}
            />
        </>
    );
}

export default MyUser;