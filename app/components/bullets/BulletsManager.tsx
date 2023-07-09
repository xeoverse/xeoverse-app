import { useCallback, useEffect, useRef, useState } from "react";
import { InstancedMesh, Vector3 } from "three";
import { useThree } from "@react-three/fiber";
import { socket } from "../../socket/SocketContext";
import { MessageType } from "../../socket/SocketProvider";
import { arraytoVector3 } from "../../helpers";
import { useAppSelector } from "../../redux/hooks";
import {
  InstancedRigidBodies,
  InstancedRigidBodyProps,
  RapierRigidBody,
} from "@react-three/rapier";

const instanceCount = 1000;

const BulletsManager = () => {
  const [instanceIndex, setInstanceIndex] = useState(0);
  const [instances, setInstances] = useState<InstancedRigidBodyProps[]>([]);

  const { camera } = useThree();
  const { activeHotbar } = useAppSelector((state) => state.hud);

  const rigidBodies = useRef<RapierRigidBody[]>(null);
  const instancedMeshRef = useRef<InstancedMesh>(null);

  const addInstance = useCallback(
    (position: Vector3, linearVelocity: Vector3) => {
      if (instanceIndex >= instanceCount) return setInstanceIndex(0);
      const newInstances = [...instances];
      newInstances[instanceIndex] = {
        key: "instance_" + Math.random(),
        position,
        linearVelocity: linearVelocity.toArray(),
      };
      setInstances(newInstances);
      setInstanceIndex((prev) => prev + 1);
    },
    [instanceIndex, instances],
  );

  useEffect(() => {
    if (socket?.OPEN) {
      socket.addEventListener("message", (data) => {
        if (!data?.data || typeof data?.data !== "string") return;
        const parsed = data?.data?.split(" ");
        const type = Number(parsed?.[0]) ?? null;
        const userId = Number(parsed?.[1]) ?? null;
        const data1 = parsed?.[2];

        if (type === null)
          return console.log("Invalid message received from server");

        if (type === MessageType.UserShoot && userId !== null && data1) {
          const data2 = parsed?.[3];
          const initialPosition = data1
            .split(",")
            .map((v: string) => parseFloat(v));
          const cameraDirection = data2
            .split(",")
            .map((v: string) => parseFloat(v));
          addInstance(
            arraytoVector3(initialPosition),
            arraytoVector3(cameraDirection).multiplyScalar(20),
          );
        }
      });
    }
  }, [addInstance]);

  useEffect(() => {
    if (activeHotbar !== 1) return;
    const mouseClick = (e: MouseEvent) => {
      if (e.button === 0) {
        const cameraDirection = camera
          .getWorldDirection(new Vector3())
          .toArray();
        const frontOfMe = camera.position
          .clone()
          .add(arraytoVector3(cameraDirection).multiplyScalar(2));
        addInstance(
          frontOfMe,
          arraytoVector3(cameraDirection).multiplyScalar(20),
        );
        socket.send(
          `${MessageType.UserShoot} ${frontOfMe.toArray()} ${cameraDirection}`,
        );
      }
    };
    window.addEventListener("mousedown", mouseClick);
    return () => {
      window.removeEventListener("mousedown", mouseClick);
    };
  }, [activeHotbar, addInstance, camera, instanceIndex]);

  return (
    <InstancedRigidBodies
      ref={rigidBodies}
      instances={instances}
      colliders="ball"
    >
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, instanceCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshPhysicalMaterial attach="material" color="silver" />
      </instancedMesh>
    </InstancedRigidBodies>
  );
};

export default BulletsManager;
