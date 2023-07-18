import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Matrix4, Quaternion, Vector3 } from "three";
import { useAppSelector } from "../../redux/hooks";

const instanceCount = 2000;
const positionOffset = -100;

const Pencil = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [instanceIndex, setInstanceIndex] = useState(0);

  const instancedMeshRef = useRef<InstancedMesh>(null);
  const { activeHotbar } = useAppSelector((state) => state.hud);

  useEffect(() => {
    const mouseDown = (e: MouseEvent) => {
      if (e.button === 0 && activeHotbar === 2) {
        setIsDrawing(true);
      }
    };
    const mouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsDrawing(false);
      }
    };
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [activeHotbar]);

  useFrame(({ camera }) => {
    if (isDrawing && instancedMeshRef.current && activeHotbar === 2) {
      if (instanceIndex >= instanceCount) return setInstanceIndex(0);
      const frontofMe = camera.position
        .clone()
        .add(camera.getWorldDirection(new Vector3()).multiplyScalar(2));
      frontofMe.y -= positionOffset;
      const matrix = new Matrix4().compose(
        frontofMe,
        new Quaternion(),
        new Vector3(1, 1, 1),
      );
      instancedMeshRef.current.setMatrixAt(instanceIndex, matrix);
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      setInstanceIndex(instanceIndex + 1);
    }
  });

  return (
    <group>
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, instanceCount]}
        frustumCulled={false}
        position={[0, positionOffset, 0]}
      >
        <sphereGeometry args={[0.05, 6]} />
        <meshStandardMaterial color={0xff0000} />
      </instancedMesh>
    </group>
  );
};

export default Pencil;
