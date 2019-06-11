interface ArrayBuffer {
  concat(buffer2: ArrayBuffer): ArrayBuffer
}

interface ArrayBufferConstructor {
  concat(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer;
}

ArrayBuffer.concat = (b1: ArrayBuffer, b2: ArrayBuffer) => {
  let tmp = new Uint8Array(b1.byteLength + b2.byteLength)
  tmp.set(new Uint8Array(b1), 0)
  tmp.set(new Uint8Array(b2), b1.byteLength)
  return tmp.buffer
}

ArrayBuffer.prototype.concat = function(b2: ArrayBuffer) {
  let tmp = new Uint8Array(this.byteLength + b2.byteLength)
  tmp.set(new Uint8Array(this), 0)
  tmp.set(new Uint8Array(b2), this.byteLength)
  return tmp.buffer
}