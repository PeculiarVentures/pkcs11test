import { WebCrypto as Pkcs11Crypto } from "node-webcrypto-p11";
const OsslCrypto = require("node-webcrypto-ossl");
const osslCrypto = new OsslCrypto() as Crypto;

export interface ICrypto {
    pkcs11: Pkcs11Crypto;
    ossl: Crypto;
}

export const crypto = {
    pkcs11: null as any,
    ossl: osslCrypto,
} as ICrypto;
