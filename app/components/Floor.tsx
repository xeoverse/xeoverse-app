import { Plane } from "@react-three/drei";
import { CuboidCollider } from "@react-three/rapier";
import { DoubleSide } from "three";

const Floor = () => {
  return (
    <CuboidCollider position={[0, -1, 0]} args={[400, 0, 400]}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Plane args={[150, 150, 50, 50]} receiveShadow>
          <meshPhysicalMaterial color="white" side={DoubleSide} />
        </Plane>
        <Plane args={[150, 150, 50, 50]}>
          <meshPhysicalMaterial color="pink" side={DoubleSide} wireframe />
        </Plane>
      </group>
    </CuboidCollider>
  );
};

export default Floor;
