import { HASH_ALGS, SPACE, TEST_DATA } from "./const";
import { crypto } from "./crypto";
import { ConvertPublicKey, hasAlgorithm } from "./util";

const publicExponents = [new Uint8Array([3]), new Uint8Array([1, 0, 1])];

const modulusLengths = [1024];

async function GenerateKeys(algorithm: string) {
    const keys: CryptoKeyPair[] = [];
    for (const publicExponent of publicExponents) {
        for (const modulusLength of modulusLengths) {
            const usages = [];
            if (algorithm === "RSASSA-PKCS1-v1_5" || algorithm === "RSA-PSS") {
                usages.push("sign");
                usages.push("verify");
            } else if (algorithm === "RSA-OAEP") {
                usages.push("encrypt");
                usages.push("decrypt");
            } else {
                throw new Error(`Unknown algorithm ${algorithm}`);
            }
            // Create one keyPair. Another algs will be received via getItem
            const message = `${SPACE}${SPACE}Generate ${algorithm} ${modulusLength} ${publicExponent.length === 1 ? "3" : "65537"}`;
            try {
                let keyPair = await crypto.pkcs11.subtle.generateKey({ name: algorithm, hash: "SHA-256", publicExponent, modulusLength }, false, usages) as CryptoKeyPair;
                const privateKeyIndex = await crypto.pkcs11.keyStorage.setItem(keyPair.privateKey);
                const publicKeyIndex = await crypto.pkcs11.keyStorage.setItem(keyPair.publicKey);
                for (const hash of HASH_ALGS) {
                    const alg = { name: algorithm, hash } as any;
                    const privateKey = await crypto.pkcs11.keyStorage.getItem(privateKeyIndex, alg, keyPair.privateKey.usages);
                    const publicKey = await crypto.pkcs11.keyStorage.getItem(publicKeyIndex, alg, keyPair.publicKey.usages);
                    keys.push({
                        privateKey,
                        publicKey,
                    });
                    console.log(`${message} ${hash}: Done`);
                }
            } catch (e) {
                // Cannot generate key
                console.log(`${message}: ${e.message}`);
            }
        }
    }
    return keys;
}

async function Sign(keys: CryptoKeyPair[]) {
    for (const keyPair of keys) {
        if (!(keyPair.privateKey.algorithm.name === "RSASSA-PKCS1-v1_5" || keyPair.privateKey.algorithm.name === "RSA-PSS")) {
            continue;
        }
        const algorithm = keyPair.publicKey.algorithm as any;
        const message = `${SPACE}${SPACE}Sign/verify ${algorithm.name} ${algorithm.modulusLength} ${algorithm.publicExponent.length === 1 ? "3" : "65537"} ${algorithm.hash.name}`;
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

function Derive() {

}

export async function TestRSA() {
    const algorithms = crypto.pkcs11.info.algorithms.filter((algorithm) => {
        if (algorithm === "RSASSA-PKCS1-v1_5") {
            return true;
        }
    });
    if (!algorithms.length) {
        return;
    }
    console.log(`${SPACE}RSA`);
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
        if (index && indexes.indexOf(index) === -1) {
            indexes.push(index);
        }
    }
}
