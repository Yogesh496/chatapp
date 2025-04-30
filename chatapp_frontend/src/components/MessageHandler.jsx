import React, { useEffect, useState } from 'react';
import {
    importPrivateKey,
    decryptMessage,
    getPrivateKey
} from '../utils/encryption';

const MessageHandler = ({ messages, onDecrypt }) => {
    const [decryptedMessages, setDecryptedMessages] = useState([]);

    useEffect(() => {
        const decryptMessages = async () => {
            try {
                const privateKeyString = getPrivateKey();
                if (!privateKeyString) {
                    console.error('No private key found');
                    return;
                }

                const privateKey = await importPrivateKey(privateKeyString);
                const decrypted = await Promise.all(
                    messages.map(async (message) => {
                        if (message.isEncrypted && message.encryptedText) {
                            try {
                                const decryptedText = await decryptMessage(message.encryptedText, privateKey);
                                return {
                                    ...message,
                                    text: decryptedText,
                                    encryptedText: undefined
                                };
                            } catch (error) {
                                console.error('Failed to decrypt message:', error);
                                return message;
                            }
                        }
                        return message;
                    })
                );

                setDecryptedMessages(decrypted);
                onDecrypt(decrypted);
            } catch (error) {
                console.error('Error decrypting messages:', error);
            }
        };

        if (messages.length > 0) {
            decryptMessages();
        }
    }, [messages, onDecrypt]);

    return null; // This is a utility component, no UI needed
};

export default MessageHandler; 