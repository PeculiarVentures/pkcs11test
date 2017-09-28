import { SPACE, TEST_DATA } from "./const";
import { crypto } from "./crypto";
import { equal } from "./util";

async function TestDigest(algorithm: string) {
    let res = "Done";
    try {
        const p11Hash = await crypto.pkcs11.subtle.digest(algorithm, TEST_DATA);
        const osslHash = await crypto.ossl.subtle.digest(algorithm, TEST_DATA);
        equal(p11Hash, osslHash, "");
    } catch (err) {
        res = err.message;
    }
    console.log(`${SPACE}${SPACE}${algorithm}: ${res}`);
}

export async function TestDigests() {
    console.log(`${SPACE}Digest`);
    const digestAlgorithms = crypto.pkcs11.info.algorithms.filter((algorithm) => {
        if (
            algorithm === "SHA-1" ||
            algorithm === "SHA-256" ||
            algorithm === "SHA-384" ||
            algorithm === "SHA-512"
        ) {
            return true;
        }
    });

    for (const algorithm of digestAlgorithms) {
        await TestDigest(algorithm);
    }
}
