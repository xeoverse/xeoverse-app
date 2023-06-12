import { Plane } from "@react-three/drei";
import { DoubleSide } from "three";

const Floor = () => {
    return (
        <group position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <Plane args={[20, 20, 50, 50]} receiveShadow>
                <meshPhysicalMaterial color="white" side={DoubleSide} />
            </Plane>
            <Plane args={[20, 20, 50, 50]}>
                <meshPhysicalMaterial color="pink" side={DoubleSide} wireframe />
            </Plane>
        </group>

    );
};

export default Floor;