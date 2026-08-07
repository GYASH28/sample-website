import { readFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";

const lock = readFileSync("package-lock.json");
const encoded = deflateRawSync(lock, { level: 9 }).toString("base64");
const chunkSize = 3600;
const total = Math.ceil(encoded.length / chunkSize);

console.log(`LOCKFILE_EXPORT_BEGIN:${total}`);
for (let index = 0; index < total; index += 1) {
  console.log(`LOCKFILE_EXPORT:${String(index).padStart(3, "0")}:${encoded.slice(index * chunkSize, (index + 1) * chunkSize)}`);
}
console.log("LOCKFILE_EXPORT_END");
