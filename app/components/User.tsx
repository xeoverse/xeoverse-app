import { Cone, Text } from "@react-three/drei";
import { arrayToEuler, arraytoVector3 } from "../helpers";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "framer-motion"

interface UserProps {
    position: number[]
    rotation: number[]
    userId: string
}

const User = ({ position, rotation, userId }: UserProps) => {
    const textRef = useRef<any>();

    const positionXSpring = useSpring(position[0])
    const positionYSpring = useSpring(position[1])
    const positionZSpring = useSpring(position[2])

    const rotationXSpring = useSpring(rotation[0])
    const rotationYSpring = useSpring(rotation[1])
    const rotationZSpring = useSpring(rotation[2])

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
            <Cone castShadow args={[0.3, 0.7, 8]} rotation={arrayToEuler([-90, 0, 0])}>
                <meshPhysicalMaterial attach="material" color="gold" />
            </Cone>
        </group>
    );
};

export default User;