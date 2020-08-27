export function arrayBufferToString(buffer: ArrayBuffer){
    const arr = new Uint8Array(buffer);
    // @ts-ignore
    const str = String.fromCharCode(...arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}