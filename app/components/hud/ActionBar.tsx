import {
  useKeyboardControls,
  Box,
  Sphere,
  Text,
  Circle,
  Cylinder,
  Cone,
} from "@react-three/drei";
import { useEffect } from "react";
import { Controls } from "../../clientLayout";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setActiveHotbar } from "../../redux/slices/hud";
import { Vector3 } from "three";

interface ActionBarItemProps {
  children: React.ReactNode;
  active: boolean;
  position: Vector3;
  index: number;
}

const ActionBarItem = ({
  children,
  active,
  position,
  index,
}: ActionBarItemProps) => {
  return (
    <group position={position}>
      {active && (
        <Box receiveShadow castShadow>
          <meshBasicMaterial attach="material" color="purple" wireframe />
        </Box>
      )}
      {children}
      <group position={[-0.5, 0.5, 0.5]}>
        <Circle args={[0.1, 10]} castShadow receiveShadow>
          <meshPhysicalMaterial attach="material" color="black" />
        </Circle>
        <Text fontSize={0.1} color="white" anchorX="center" anchorY="middle">
          {index}
        </Text>
      </group>
    </group>
  );
};

const ActionBar = () => {
  const onePressed = useKeyboardControls<Controls>((state) => state.one);
  const twoPressed = useKeyboardControls<Controls>((state) => state.two);
  const threePressed = useKeyboardControls<Controls>((state) => state.three);

  const dispatch = useAppDispatch();
  const { activeHotbar } = useAppSelector((state) => state.hud);

  useEffect(() => {
    if (onePressed) {
      dispatch(setActiveHotbar(1));
    } else if (twoPressed) {
      dispatch(setActiveHotbar(2));
    } else if (threePressed) {
      dispatch(setActiveHotbar(3));
    }
  }, [dispatch, onePressed, threePressed, twoPressed]);

  return (
    <group>
      <ActionBarItem
        active={activeHotbar === 1}
        position={new Vector3(-2, -2, 4)}
        index={1}
      >
        <Sphere args={[0.5, 10, 10]} castShadow receiveShadow>
          <meshPhysicalMaterial attach="material" color="silver" />
        </Sphere>
      </ActionBarItem>
      <ActionBarItem
        active={activeHotbar === 2}
        position={new Vector3(0, -2, 4)}
        index={2}
      >
        <group>
          <Cylinder
            args={[0.1, 0.1, 0.5, 10]}
            position={[0, -0.2, 0]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial attach="material" color="silver" />
          </Cylinder>
          <Cone
            args={[0.12, 0.2, 10]}
            position={[0, 0.16, 0]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial attach="material" color="red" />
          </Cone>
        </group>
      </ActionBarItem>
    </group>
  );
};

export default ActionBar;
