"use client";

import {
  KeyboardControls,
  KeyboardControlsEntry,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useMemo } from "react";
import Hud from "./components/hud/Hud";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store";
import SocketProvider from "./socket/SocketProvider";

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
  escape = "escape",
  e = "e",
  q = "q",
  one = "one",
  two = "two",
  three = "three",
  tab = "tab",
  tilde = "tilde",
  shift = "shift",
}

const Cursor = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 8,
        height: 8,
        backgroundColor: "red",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        zIndex: 999999999,
      }}
    />
  );
};

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.escape, keys: ["Escape"] },
      { name: Controls.e, keys: ["KeyE"] },
      { name: Controls.q, keys: ["KeyQ"] },
      { name: Controls.one, keys: ["Digit1"] },
      { name: Controls.two, keys: ["Digit2"] },
      { name: Controls.three, keys: ["Digit3"] },
      { name: Controls.tilde, keys: ["Backquote"] },
      { name: Controls.shift, keys: ["ShiftLeft"] },
    ],
    [],
  );

  return (
    <ReduxProvider store={store}>
      <SocketProvider>
        <KeyboardControls map={map}>
          <Canvas shadows>
            <Physics>
              {children}
              <Hud />
            </Physics>
            <Stats />
          </Canvas>
          <Cursor />
        </KeyboardControls>
      </SocketProvider>
    </ReduxProvider>
  );
};

export default ClientLayout;
