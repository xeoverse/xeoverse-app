import { Euler } from "@react-three/fiber";
import { Vector3 } from "three";

export const arraytoVector3 = (arr: number[]) => {
  return new Vector3(arr?.[0], arr?.[1], arr?.[2]);
};

export const arrayToEuler = (arr: number[]) => {
  return [arr?.[0], arr?.[1], arr?.[2], "XYZ"] as Euler;
};

export const multiplyVector3 = (vec: Vector3, multiplier: number) => {
  return new Vector3(
    vec.x * multiplier,
    vec.y * multiplier,
    vec.z * multiplier,
  );
};

export const addVector3 = (vec: Vector3, add: Vector3) => {
  return new Vector3(vec.x + add.x, vec.y + add.y, vec.z + add.z);
};
