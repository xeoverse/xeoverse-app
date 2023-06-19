import { Euler } from "@react-three/fiber"
import { Vector3 } from "three"

export const arraytoVector3 = (arr: number[]) => {
    return new Vector3(arr?.[0], arr?.[1], arr?.[2])
}

export const arrayToEuler = (arr: number[]) => {
    return [arr?.[0], arr?.[1], arr?.[2], "XYZ"] as Euler
}