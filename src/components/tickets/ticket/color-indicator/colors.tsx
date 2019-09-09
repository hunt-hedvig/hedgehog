export const RED: IColor = {
  red: 236,
  green: 54,
  blue: 54,
  alpha: 1.0,
}

export const ORANGE: IColor = {
  red: 233,
  green: 110,
  blue: 36,
  alpha: 1.0,
}

export const YELLOW: IColor = {
  red: 233,
  green: 200,
  blue: 58,
  alpha: 1.0,
}

export const GREEN: IColor = {
  red: 110,
  green: 209,
  blue: 80,
  alpha: 1.0,
}

// t = [0 ... 1]
export const interpolateBetweenColors = (
  colorA: IColor,
  colorB: IColor,
  t: number,
): string => {
  const red = Math.min(colorA.red * (1 - t) + colorB.red * t, 255)
  const green = Math.min(colorA.green * (1 - t) + colorB.green * t, 255)
  const blue = Math.min(colorA.blue * (1 - t) + colorB.blue * t)
  const alpha = Math.min(colorA.alpha * (1 - t) + colorB.alpha * t, 1)
  const result =
    'rgba(' +
    red.toFixed(0) +
    ',' +
    green.toFixed(0) +
    ',' +
    blue.toFixed(0) +
    ',' +
    alpha +
    ')'
  return result
}

export interface IColor {
  red: number
  green: number
  blue: number
  alpha: number
}
