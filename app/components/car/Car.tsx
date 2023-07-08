import { Box, Sphere, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
    RapierRigidBody,
    RigidBody,
    Vector3Tuple,
    useRevoluteJoint,
} from "@react-three/rapier";
import { createRef, RefObject, useEffect, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { Controls } from "../../clientLayout";
import { useDispatch } from "react-redux";
import { setIsDriving } from "../../redux/slices/app";
import { useAppSelector } from "../../redux/hooks";

enum WheelSide {
    FrontLeft,
    FrontRight,
    BackLeft,
    BackRight
}

interface WheelJointProps {
    body: RefObject<RapierRigidBody>
    wheel: RefObject<RapierRigidBody>
    bodyAnchor: Vector3Tuple
    wheelAnchor: Vector3Tuple
    rotationAxis: Vector3Tuple
    wheelSide: WheelSide
    isDriving: boolean
}

const WheelJoint = ({
    body,
    wheel,
    bodyAnchor,
    wheelAnchor,
    rotationAxis,
    wheelSide,
    isDriving
}: WheelJointProps) => {
    const forwardPressed = useKeyboardControls<Controls>(state => state.forward)
    const backPressed = useKeyboardControls<Controls>(state => state.back)
    const leftPressed = useKeyboardControls<Controls>(state => state.left)
    const rightPressed = useKeyboardControls<Controls>(state => state.right)

    const joint = useRevoluteJoint(body, wheel, [
        bodyAnchor,
        wheelAnchor,
        rotationAxis
    ]);

    useFrame(() => {
        if (joint.current && isDriving) {
            if (forwardPressed) {
                if (leftPressed && wheelSide === WheelSide.FrontRight || rightPressed && wheelSide === WheelSide.BackLeft) {
                    joint.current.configureMotorVelocity(100, 10);
                } else if (rightPressed && wheelSide === WheelSide.FrontLeft || leftPressed && wheelSide === WheelSide.BackRight) {
                    joint.current.configureMotorVelocity(100, 10);
                } else if (!leftPressed && !rightPressed) {
                    joint.current.configureMotorVelocity(20, 10);
                } else {
                    joint.current.configureMotorVelocity(0, 0);
                }
            } else if (backPressed) {
                if (leftPressed && wheelSide === WheelSide.FrontRight || rightPressed && wheelSide === WheelSide.BackLeft) {
                    joint.current.configureMotorVelocity(-100, 10);
                } else if (rightPressed && wheelSide === WheelSide.FrontLeft || leftPressed && wheelSide === WheelSide.BackRight) {
                    joint.current.configureMotorVelocity(-100, 10);
                } else if (!leftPressed && !rightPressed) {
                    joint.current.configureMotorVelocity(-20, 10);
                } else {
                    joint.current.configureMotorVelocity(0, 0);
                }
            } else {
                joint.current.configureMotorVelocity(0, 0);
            }
        }
    });

    return null;
};

interface CarProps {
    initialPosition: Vector3
}

const Car = ({ initialPosition }: CarProps) => {
    const bodyRef = useRef<RapierRigidBody>(null);
    const bodyMeshRef = useRef<Mesh>(null);
    const dispatch = useDispatch();

    const { isDriving } = useAppSelector(state => state.app)
    const ePressed = useKeyboardControls<Controls>(state => state.e)

    useEffect(() => {
        if (ePressed && isDriving) {
            console.log('asda')
            dispatch(setIsDriving(false))
        }
    }, [ePressed, dispatch, isDriving]);

    const { camera } = useThree();

    const wheelPositions: [number, number, number][] = [
        [-3, 0, 2],
        [-3, 0, -2],
        [3, 0, 2],
        [3, 0, -2]
    ];

    const wheelRefs = useRef(
        wheelPositions.map(() => createRef<RapierRigidBody>())
    );

    useFrame(() => {
        if (bodyMeshRef.current && camera && isDriving) {
            const position = new Vector3();
            position.setFromMatrixPosition(bodyMeshRef.current.matrixWorld);
            position.y += 2;
            camera.position.copy(position);
        }
    })

    return (
        <group onClick={() => dispatch(setIsDriving(true))}>
            <RigidBody colliders="cuboid" ref={bodyRef} type="dynamic" gravityScale={2} position={initialPosition}>
                <Box ref={bodyMeshRef} scale={[6, 1, 1.9]} castShadow receiveShadow name="chassis">
                    <meshStandardMaterial color={"red"} />
                </Box>
            </RigidBody>
            {wheelPositions.map((wheelPosition, index) => (
                <RigidBody
                    position={wheelPosition}
                    colliders="ball"
                    key={index}
                    ref={wheelRefs.current[index]}
                    restitution={0.1}
                >
                    <Sphere args={[0.75, 32, 32]} castShadow receiveShadow>
                        <meshStandardMaterial color={"grey"} />
                    </Sphere>
                </RigidBody>
            ))}
            {wheelPositions.map((wheelPosition, index) => (
                <WheelJoint
                    key={index}
                    body={bodyRef}
                    wheel={wheelRefs.current[index]}
                    bodyAnchor={wheelPosition}
                    wheelAnchor={[0, 0, 0]}
                    rotationAxis={[0, 0, 1]}
                    wheelSide={index as WheelSide}
                    isDriving={isDriving}
                />
            ))}
        </group>
    );
};

export default Car