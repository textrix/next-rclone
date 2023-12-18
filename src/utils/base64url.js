import { randomBytes } from 'crypto'

function make_random_bytes(N) {
    return randomBytes(N)
}

function base64url_encode(byteArray) {
    // Converting the bytes to base64url format
    var base64url = btoa(String.fromCharCode.apply(null, byteArray))
        .replace(/\+/g, '-') // Replace '+' with '-'
        .replace(/\//g, '_') // Replace '/' with '_'
        .replace(/=+$/, '')  // Remove trailing '='

    return base64url
}

function base64url_is_valid(str) {
    const regex = /^[A-Za-z0-9-_]+$/
    return regex.test(str) && (str.length % 4 === 0 || str.length % 4 === 2 || str.length % 4 === 3)
}

function base64url_decode(base64url) {
    //@@ check valid character
    if (base64url_is_valid(base64url)) {
        throw new Error('Invalid base64url string')
    }

    // Convert base64url string to regular base64 string
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')

    // Add padding
    base64 += '=='.slice(0, (4 - base64.length % 4) % 4)

    // Decode base64 string to a binary string
    const binaryString = atob(base64)

    // Convert binary string to a byte array
    //const byteArray = Uint8Array.from(binaryString, (m) => m.codePointAt(0))
    const byteArray = Buffer.from(binaryString, 'binary')

    return byteArray
}
