const libCrypto = require('@waves/waves-transactions').libs.crypto

class SignerWrapper {

    constructor(SEED) {
        this.SEED = SEED
        this.PUBLIC_KEY = libCrypto.publicKey(SEED)
    }

    dataToBites = (data) =>  {
        return libCrypto.base58Decode(data)
    }

    dataFromBites = (bites) => {
        return libCrypto.base58Encode(bites)
    }

    sign = (data) => {
        const dataInBite = this.dataToBites(data)
        return  libCrypto.signBytes(this.SEED, dataInBite)
    }

    verify = (dataInBite, signedData) => {
        return libCrypto.verifySignature(this.PUBLIC_KEY, dataInBite, signedData)
    }

}

const SEED = "fire demand ignore yellow play voice common finish sponsor bunker issue silly whisper camp job"
const DATA = "Waves"
const DATA2 = "Waves2"

const signerWrapper = new SignerWrapper(SEED)
const signedData = signerWrapper.sign(DATA)
const dataInBites = signerWrapper.dataToBites(DATA)
const dataInBites2 = signerWrapper.dataToBites(DATA2)

console.log(signerWrapper.verify(dataInBites, signedData)) // true
console.log(signerWrapper.verify(dataInBites2, signedData)) // false
