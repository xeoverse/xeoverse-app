import { Sphere } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import { Camera, Vector3 } from "three";
import { multiplyVector3 } from "../helpers";

const Bullet = ({ initialPosition, camera }: { initialPosition: Vector3, camera: Camera }) => {
    const bullet = useRef<any>(null);

    useEffect(() => {
        const api = bullet.current;
        if (api) {
            setTimeout(() => {
                const cameraDirection = camera.getWorldDirection(new Vector3());
                api.applyImpulse(multiplyVector3(cameraDirection, 1), true);
            }, 1000 / 60);
        }
    }, [camera]);

    return (
        <RigidBody colliders={"ball"} restitution={1.5} ref={bullet} position={initialPosition}>
            <Sphere args={[0.2, 6, 6]} castShadow>
                <meshPhysicalMaterial attach="material" color="silver" />
            </Sphere>
        </RigidBody>
    )
}

export default Bullet;
