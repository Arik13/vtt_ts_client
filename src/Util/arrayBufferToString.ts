const MAX_BYTES_LENGTH = Math.pow(2, 16);

export function arrayBufferToString(buffer: ArrayBuffer){
    const bytes = new Uint8Array(buffer);

    // The function to convert bytes to a UTF-16 string takes a variable number of bytes as arguments
    // However the stack places a practical upper bound on the number of function arguments
    // The size of the bound depends on the browser but 2^16 arguments is safe for all browsers
    // Therefore binary data must be processed in chunks of 2^16 bytes in order to avoid a stack overflow
    let str = "";
    for (let i = 0; i < bytes.length; i += MAX_BYTES_LENGTH) {
        let chunk = bytes.slice(i, i + MAX_BYTES_LENGTH);
        str += String.fromCharCode(...chunk);
    }
    // if(/[\u0080-\uffff]/.test(str)){
    //     throw new Error("this string seems to contain (still encoded) multibytes");
    // }
    return str;
}
