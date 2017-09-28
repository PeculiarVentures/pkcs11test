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
