import { DoubleSide } from "three";

const Floor = () => {
    return (
    <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20, 50, 50]} />
        <meshBasicMaterial color="hotpink" side={DoubleSide} wireframe />
    </mesh>
    );
};

export default Floor;