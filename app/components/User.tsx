import { Cone, Text } from "@react-three/drei";
import { arrayToEuler, arraytoVector3 } from "../helpers";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface UserProps {
    position: number[]
    rotation: number[]
    userId: string
}

const User = ({ position, rotation, userId }: UserProps) => {
    const textRef = useRef<any>();

    useFrame(({ camera }) => {
        if (textRef.current) {
            textRef.current.lookAt(camera.position);
        }
    });

    return (
        <group position={arraytoVector3(position)} rotation={arrayToEuler(rotation)} key={userId}>
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