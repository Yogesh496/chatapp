const crypto = require('crypto');

// Generate a key pair for a user
async function generateKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );
    return keyPair;
}

// Export public key to string
async function exportPublicKey(publicKey) {
    const exported = await crypto.subtle.exportKey(
        "spki",
        publicKey
    );
    return Buffer.from(exported).toString('base64');
}

// Export private key to string
async function exportPrivateKey(privateKey) {
    const exported = await crypto.subtle.exportKey(
        "pkcs8",
        privateKey
    );
    return Buffer.from(exported).toString('base64');
}

// Import public key from string
async function importPublicKey(keyString) {
    const keyData = Buffer.from(keyString, 'base64');
    return await crypto.subtle.importKey(
        "spki",
        keyData,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}

// Import private key from string
async function importPrivateKey(keyString) {
    const keyData = Buffer.from(keyString, 'base64');
    return await crypto.subtle.importKey(
        "pkcs8",
        keyData,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["decrypt"]
    );
}

// Encrypt message using receiver's public key
async function encryptMessage(message, publicKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        data
    );
    return Buffer.from(encrypted).toString('base64');
}

// Decrypt message using receiver's private key
async function decryptMessage(encryptedMessage, privateKey) {
    const encryptedData = Buffer.from(encryptedMessage, 'base64');
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey,
        encryptedData
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

module.exports = {
    generateKeyPair,
    exportPublicKey,
    exportPrivateKey,
    importPublicKey,
    importPrivateKey,
    encryptMessage,
    decryptMessage
}; 