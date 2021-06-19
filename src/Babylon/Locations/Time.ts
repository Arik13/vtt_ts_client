export const setTimeOfDayLighting = (
    hour: number,
    minute: number,
    second: number,
    scene: BABYLON.Scene,
    light: BABYLON.Light,
) => {
    // DECLARATIONS
    // const orderOfMagnitude = (x: number) => Math.floor(Math.log10(x));
    // const gaussian = (x: number, amplitude: number, pos: number, width: number) => amplitude * Math.exp(-(Math.pow(x-pos, 2)/Math.pow(width, 2)));
    const sigmoid = (x: number, xComp: number, centerX: number) => 1 / (1 + Math.pow(Math.E, -xComp*(x-centerX)));
    const sin2 = (x: number) => (Math.sin(((x) * 2 * Math.PI) - Math.PI/2) + 1)/2;
    const normalizeLux = (x: number) => Math.log10(x)/10 + 0.5;

    // const NOON_COLOR = new BABYLON.Color4(0, 0.5, 1, 1);
    // const MIDNIGHT_COLOR = new BABYLON.Color4(0, 0, 0, 1);
    // const SUNSET_COLOR = new BABYLON.Color4(0.51, 0.31, 0.17, 1);

    const secondsToMillis = (seconds: number) => 1000 * seconds;
    const minutesToMillis = (minutes: number) => secondsToMillis(60 * minutes);
    const hoursToMillis = (hours: number) => minutesToMillis(60 * hours);
    const daysToMillis = (days: number) => hoursToMillis(24 * days);

    const DAY_MILLIS = daysToMillis(1);
    const MAX_LUX = 100000;

    const luxAtTime = (t: number) => {
        let xComp = 32;
        let sigCenter = 0.75;
        let normalizedTime = t / DAY_MILLIS;
        let sinOut = sin2(normalizedTime);
        let sigOut = sigmoid(sinOut, xComp, sigCenter);
        return sigOut * MAX_LUX;
    }

    let t = hoursToMillis(hour) + minutesToMillis(minute) + secondsToMillis(second);
    let lux = luxAtTime(t);
    let normalizedLux = normalizeLux(lux);

    const SKY_SIGMOID_COMPRESSION = 10;
    const SKY_SIGMOID_INFLECTION_X = 0.8;
    const LIGHT_SIGMOID_COMPRESSION = 7;
    const LIGHT_SIGMOID_INFLECTION_X = 0.5;

    let skyHSV = new BABYLON.Color3(
        210,                                  // Hue
        0.7,                                  // Saturation
        sigmoid(normalizedLux, SKY_SIGMOID_COMPRESSION,  SKY_SIGMOID_INFLECTION_X),     // Value
    );
    let lightHSV = new BABYLON.Color3(
        210,                                  // Hue
        0,                                    // Saturation
        sigmoid(normalizedLux, LIGHT_SIGMOID_COMPRESSION,  LIGHT_SIGMOID_INFLECTION_X),     // Value
    );
    let skyColor = hsvToRGB(skyHSV);
    let lightColor = hsvToRGB(lightHSV);
    scene.clearColor = skyColor.toColor4();
    light.diffuse = lightColor;
}
function hsvToRGB(hsvVector: BABYLON.Color3) {
    let r, g, b, i, f, p, q, t, h, s, v;
    h = hsvVector.r / 360, s = hsvVector.g, v = hsvVector.b,
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return new BABYLON.Color3(
        r,
        g,
        b
    );
}

// let i = 0;
// const NOON_COLOR = new BABYLON.Color4(0, 0.5, 1, 1);
// const MIDNIGHT_COLOR = new BABYLON.Color4(0, 0, 0, 1);
// const SUNSET_COLOR = new BABYLON.Color4(0.51, 0.31, 0.17, 1);

// const hoursToMillis = (hours: number) => 1000 * 60 * 60 * hours;
// const minutesToMillis = (minutes: number) => 1000 * 60 * minutes;
// const DAY_MILLIS = hoursToMillis(24);
// const NOON_MILLIS = hoursToMillis(12);

// const scaleColor = (scalingFactor: number, color: BABYLON.Color4) => {
//     return new BABYLON.Color4(
//         color.r * scalingFactor,
//         color.g * scalingFactor,
//         color.b * scalingFactor,
//         1,
//     );
// }
// const washColor = (color: BABYLON.Color3) => {
//     let magnitude = Math.sqrt(color.r * color.r + color.g * color.g + color.b * color.b);
//     const washColorChannel = (colorChannel: number) => {
//         const WASH_CONSTANT = 0.5;
//         return (colorChannel * colorChannel) * (WASH_CONSTANT);
//     }
//     let baseBrightness = 0.9;
//     color.r = 0.1 + baseBrightness * magnitude + washColorChannel(color.r);
//     color.g = 0.1 + baseBrightness * magnitude + washColorChannel(color.g);
//     color.b = 0.1 + baseBrightness * magnitude + washColorChannel(color.b);
//     return color;
// }

// const generateColor = () => {
//     let millisElapsed = hoursToMillis(i);
//     let sinFunc1 = (x: number) => (Math.sin(((x) * 2 * Math.PI) - Math.PI/2) + 1)/2;
//     let compressedLows = (x: number) => (Math.sin(x) < 0)? sinFunc1(x)*x : sinFunc1(x);
//     let scalingFactor = sinFunc1(millisElapsed/DAY_MILLIS);
//     console.log(`${i % 24}:00 -- ${scalingFactor.toFixed(2)} -- ${compressedLows(millisElapsed/DAY_MILLIS).toFixed(2)}`);
//     i++;
//     // return scaleColor(scalingFactor, SUNSET_COLOR);
//     return scaleColor(scalingFactor, NOON_COLOR);
// }
// const interpolateColors = (
//     color1: BABYLON.Color3,
//     color2: BABYLON.Color3,
//     mixScalar: number,
// ) => {
//     color1.toHSV()
// }