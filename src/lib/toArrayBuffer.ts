export function toArrayBuffer(
  input: Buffer | ArrayBuffer | SharedArrayBuffer | ArrayBufferView,
): ArrayBuffer {
  // Create a Uint8Array from the input and use .slice() to force a new TypedArray
  // backed by a plain ArrayBuffer; then return that ArrayBuffer.
  return new Uint8Array(input as any).slice().buffer;
}
