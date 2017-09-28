import { HASH_ALGS, SPACE, TEST_DATA } from "./const";
import { crypto } from "./crypto";
import { ConvertPublicKey, hasAlgorithm } from "./util";

const namedCurves = ["P-256", "P-384", "P-521"];

async function GenerateKeys(algorithm: string) {
    const keys: CryptoKeyPair[] = [];
    for (const namedCurve of namedCurves) {
        const alg = { name: algorithm, namedCurve };
        let keyPair: CryptoKeyPair | null = null;
        try {
            if (algorithm === "ECDSA") {
                keyPair = await crypto.pkcs11.subtle.generateKey(alg, false, ["sign", "verify"]);
            } else if (algorithm === "ECDH") {
                keyPair = await crypto.pkcs11.subtle.generateKey(alg, false, ["deriveKey", "deriveBits"]);
            } else {
                throw new Error(`Unknown algorithm ${algorithm}`);
            }
            // NOTE: crypto with keys on token can be different with keys from session
            // add keys to token
            const privateKeyIndex = await crypto.pkcs11.keyStorage.setItem(keyPair.privateKey);
            const privateKey = await crypto.pkcs11.keyStorage.getItem(privateKeyIndex);
            const publicKeyIndex = await crypto.pkcs11.keyStorage.setItem(keyPair.publicKey);
            const publicKey = await crypto.pkcs11.keyStorage.getItem(publicKeyIndex);
            keys.push({
                privateKey,
                publicKey,
            });
            console.log(`${SPACE}${SPACE}Generate ${algorithm} ${namedCurve}: Done`);
        } catch (e) {
            // Cannot generate key
            console.log(`${SPACE}${SPACE}Generate ${algorithm} ${namedCurve}: ${e.message}`);
        }
    }
    return keys;
}

async function Sign(keys: CryptoKeyPair[]) {
    for (const keyPair of keys) {
        if (keyPair.privateKey.algorithm.name !== "ECDSA") {
            continue;
        }
        for (const hashAlg of HASH_ALGS) {
            const algorithm = Object.assign({ hash: hashAlg }, keyPair.publicKey.algorithm) as any;
            const message = `${SPACE}${SPACE}Sign/verify ${algorithm.name} ${algorithm.namedCurve} ${algorithm.hash}`;
            try {
                const signature = await crypto.pkcs11.subtle.sign(algorithm, keyPair.privateKey, TEST_DATA);
                const p11Verify = await crypto.pkcs11.subtle.verify(algorithm, keyPair.publicKey, signature, TEST_DATA);
                if (!p11Verify) {
                    console.log(`${message}: Signature is invalid`);
                    continue;
                }
                const osslKey = await ConvertPublicKey(keyPair.publicKey, ["verify"]);
                const osslVerify = await crypto.ossl.subtle.verify(algorithm, osslKey, signature, TEST_DATA);
                if (p11Verify === osslVerify) {
                    console.log(`${message}: Done`);
                } else {
                    console.log(`${message}: Signature has different value from OpenSSL`);
                }
            } catch (err) {
                console.log(`${message}: ${err.message}`);
            }
        }
    }
}

function Derive() {

}

export async function TestEC() {
    const algorithms = crypto.pkcs11.info.algorithms.filter((algorithm) => {
        if (algorithm === "ECDSA" || algorithm === "ECDH") {
            return true;
        }
    });
    if (!algorithms.length) {
        return;
    }
    console.log(`${SPACE}EC`);
    let keys: CryptoKeyPair[] = [];
    for (const algorithm of algorithms) {
        const keys2 = await GenerateKeys(algorithm);
        keys = keys.concat(keys2);
    }

    await Sign(keys);

    // Delete keys
    const indexes: string[] = [];
    for (const keyPair of keys) {
        try {
            await GetIndex(keyPair.privateKey);
            await GetIndex(keyPair.publicKey);
        } catch {
            //
        }
    }
    for (const index of indexes) {
        try {
            await crypto.pkcs11.keyStorage.removeItem(index);
            // console.log(`Remove: ${index}`);
        } catch (err) {
        }
    }

    async function GetIndex(key: CryptoKey) {
        const index = await crypto.pkcs11.keyStorage.indexOf(key);
        if (index) {
            indexes.push(index);
        }
    }
}
