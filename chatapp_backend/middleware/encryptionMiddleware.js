const { importPublicKey, encryptMessage } = require('../utils/encryption');
const User = require('../model/user');

// Middleware to encrypt outgoing messages
const encryptOutgoingMessage = async (req, res, next) => {
    try {
        if (!req.body.text) return next();

        const receiver = await User.findById(req.body.receiverId);
        if (!receiver || !receiver.publicKey) {
            return res.status(400).json({ error: 'Receiver not found or has no public key' });
        }

        const publicKey = await importPublicKey(receiver.publicKey);
        const encryptedText = await encryptMessage(req.body.text, publicKey);

        req.body.encryptedText = encryptedText;
        req.body.text = undefined; // Remove plain text
        next();
    } catch (error) {
        console.error('Encryption error:', error);
        res.status(500).json({ error: 'Failed to encrypt message' });
    }
};

module.exports = {
    encryptOutgoingMessage
}; 