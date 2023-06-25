import { Sphere, Text } from "@react-three/drei";
import { arrayToEuler, arraytoVector3 } from "../helpers";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpringValue } from '@react-spring/web'
import { RigidBody } from "@react-three/rapier";

interface UserProps {
    position: number[]
    rotation: number[]
    userId: number
}

const User = ({ position, rotation, userId }: UserProps) => {
    const textRef = useRef<any>();

    const positionXSpring = useSpringValue(position[0])
    const positionYSpring = useSpringValue(position[1])
    const positionZSpring = useSpringValue(position[2])

    const rotationXSpring = useSpringValue(rotation[0])
    const rotationYSpring = useSpringValue(rotation[1])
    const rotationZSpring = useSpringValue(rotation[2])

    useFrame(({ camera }) => {
        if (textRef.current) {
            textRef.current.lookAt(camera.position);
        }

        positionXSpring.set(position[0])
        positionYSpring.set(position[1])
        positionZSpring.set(position[2])

        rotationXSpring.set(rotation[0])
        rotationYSpring.set(rotation[1])
        rotationZSpring.set(rotation[2])
    });

    return (
        <group
            key={userId}
            position={arraytoVector3([positionXSpring.get(), positionYSpring.get(), positionZSpring.get()])}
            rotation={arrayToEuler([rotationXSpring.get(), rotationYSpring.get(), rotationZSpring.get()])}
        >
            <Text color="yellow" fontSize={0.1} anchorX="center" anchorY={-0.6} ref={textRef}>
                {userId}
            </Text>
            <RigidBody colliders="cuboid">
                <Sphere castShadow args={[0.5, 10, 10]}>
                    <meshPhysicalMaterial attach="material" color="gold" />
                </Sphere>
            </RigidBody>
        </group>
    );
};

export default User;