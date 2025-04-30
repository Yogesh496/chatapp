
async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
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

async function exportPublicKey(publicKey) {
    const exported = await window.crypto.subtle.exportKey(
        "spki",
        publicKey
    );
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

async function exportPrivateKey(privateKey) {
    const exported = await window.crypto.subtle.exportKey(
        "pkcs8",
        privateKey
    );
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

async function importPublicKey(keyString) {
    const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
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

async function importPrivateKey(keyString) {
    const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
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

async function encryptMessage(message, publicKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        data
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

async function decryptMessage(encryptedMessage, privateKey) {
    const encryptedData = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey,
        encryptedData
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

function storePrivateKey(privateKey) {
    localStorage.setItem('privateKey', privateKey);
}

function getPrivateKey() {
    return localStorage.getItem('privateKey');
}

export {
    generateKeyPair,
    exportPublicKey,
    exportPrivateKey,
    importPublicKey,
    importPrivateKey,
    encryptMessage,
    decryptMessage,
    storePrivateKey,
    getPrivateKey
};