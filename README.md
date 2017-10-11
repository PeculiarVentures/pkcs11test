# pkcs11test

Simple CLI application for PKCS#11 testing based on WebCrypto library

## Install

```
npm install pkcs11test -g
```

## Using

```
Params:
  help   Help info about pkcs11test program
  pin    PIN for PKCS#11 user session
  slot   index of slot in PKCS#11 module. Default is 0
  write  sets token to read/write mode

Examples
  pkcs11test /usr/local/lib/softhsm/libsofthsm2.so -p password -w
  pkcs11test /usr/local/lib/libeTPkcs11.dylib --pin password --slot 0 --write
```

## Example

Output for SoftHSMv2
```
PKCS#11 info:
  Name: My slot 0
  Reader: SoftHSM slot ID 0x70c89a3c
  Serial number: 40091ac070c89a3c
  Slot: 0
  Type: Software
  Algorithms: SHA-1, SHA-256, SHA-384, SHA-512, RSASSA-PKCS1-v1_5, RSA-OAEP, RSA-PSS, AES-CBC, ECDSA, ECDH

Tests:
  Digest
    SHA-1: Done
    SHA-256: Done
    SHA-384: Done
    SHA-512: Done
  EC
    Generate ECDSA P-256: Done
    Generate ECDSA P-384: Done
    Generate ECDSA P-521: Done
    Generate ECDH P-256: Done
    Generate ECDH P-384: Done
    Generate ECDH P-521: Done
    Sign/verify ECDSA P-256 SHA-1: Done
    Sign/verify ECDSA P-256 SHA-256: Done
    Sign/verify ECDSA P-256 SHA-384: Done
    Sign/verify ECDSA P-256 SHA-512: Done
    Sign/verify ECDSA P-384 SHA-1: Done
    Sign/verify ECDSA P-384 SHA-256: Done
    Sign/verify ECDSA P-384 SHA-384: Done
    Sign/verify ECDSA P-384 SHA-512: Done
    Sign/verify ECDSA P-521 SHA-1: Done
    Sign/verify ECDSA P-521 SHA-256: Done
    Sign/verify ECDSA P-521 SHA-384: Done
    Sign/verify ECDSA P-521 SHA-512: Done
  RSA
    Generate RSASSA-PKCS1-v1_5 1024 3 SHA-1: Done
    Generate RSASSA-PKCS1-v1_5 1024 3 SHA-256: Done
    Generate RSASSA-PKCS1-v1_5 1024 3 SHA-384: Done
    Generate RSASSA-PKCS1-v1_5 1024 3 SHA-512: Done
    Generate RSASSA-PKCS1-v1_5 1024 65537 SHA-1: Done
    Generate RSASSA-PKCS1-v1_5 1024 65537 SHA-256: Done
    Generate RSASSA-PKCS1-v1_5 1024 65537 SHA-384: Done
    Generate RSASSA-PKCS1-v1_5 1024 65537 SHA-512: Done
    Sign/verify RSASSA-PKCS1-v1_5 1024 3 SHA-1: Done
    Sign/verify RSASSA-PKCS1-v1_5 1024 3 SHA-256: Done
    Sign/verify RSASSA-PKCS1-v1_5 1024 3 SHA-384: Done
    Sign/verify RSASSA-PKCS1-v1_5 1024 3 SHA-512: Done
    Sign/verify RSASSA-PKCS1-v1_5 1024 65537 SHA-1: Done
    Sign/verify RSASSA-PKCS1-v1_5 1024 65537 SHA-256: Done
    Sign/verify RSASSA-PKCS1-v1_5 1024 65537 SHA-384: Done
    Sign/verify RSASSA-PKCS1-v1_5 1024 65537 SHA-512: Done
```