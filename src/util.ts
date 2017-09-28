import { crypto } from "./crypto";

export function equal(buf1: ArrayBuffer, buf2: ArrayBuffer, message?: string) {
    const res = new Buffer(buf1).equals(new Buffer(buf2));
    if (!res) {
        throw new Error(message || "buf1 is not equal to buf2");
    }
}

export function hasAlgorithm(algorithms: string[], algorithm: string) {
    return algorithms.indexOf(algorithm) !== -1;
}

export async function ConvertPublicKey(publicKey: CryptoKey, keyUsages: string[]) {
    if (publicKey.type !== "public") {
        throw new Error("Wrong type format of given key");
    }
    const raw = await crypto.pkcs11.subtle.exportKey("jwk", publicKey);
    const algorithm = Object.assign({}, publicKey.algorithm);
    const key = await crypto.ossl.subtle.importKey("jwk", raw, algorithm as any, true, keyUsages);
    return key;
}
