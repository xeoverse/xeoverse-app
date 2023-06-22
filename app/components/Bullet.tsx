import { Sphere } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef, useEffect, useState, memo } from "react";
import { Vector3 } from "three";
import { multiplyVector3 } from "../helpers";
import { Camera } from "@react-three/fiber";

export interface BulletProps {
    initialPosition: Vector3,
    direction?: Vector3
    camera?: Camera
    userId?: number
}

const Bullet = memo(({ initialPosition, direction, camera, userId }: BulletProps) => {
    const bullet = useRef<RapierRigidBody>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const api = bullet.current;
        if (api) {
            setTimeout(() => {
                const bulletDirection = (direction || camera?.getWorldDirection(new Vector3())) as Vector3
                api.applyImpulse(multiplyVector3(bulletDirection, 0.5), true);
            }, 1000 / 60);
            setTimeout(() => {
                setIsVisible(false);
            }, 1000 * 20);
        }
    }, [camera, direction]);

    return (
        <>
            {
                isVisible ? (
                    <RigidBody colliders={"ball"} restitution={1.5} ref={bullet} position={initialPosition} >
                        <Sphere args={[0.2, 6, 6]} castShadow>
                            <meshPhysicalMaterial attach="material" color="silver" />
                        </Sphere>
                    </RigidBody >
                ) : null
            }
        </>
    )
});

export default Bullet;
