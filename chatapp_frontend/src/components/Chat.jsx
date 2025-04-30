import React, { useState, useEffect } from 'react';
import {
    importPublicKey,
    importPrivateKey,
    encryptMessage,
    decryptMessage,
    getPrivateKey
} from '../utils/encryption';

const Chat = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiverPublicKey, setReceiverPublicKey] = useState(null);

    // Fetch messages and decrypt them
    useEffect(() => {
        if (!selectedUser?._id) return;

        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/messages/${selectedUser._id}`);
                const data = await response.json();

                // Decrypt messages
                const privateKeyString = getPrivateKey();
                if (!privateKeyString) {
                    console.error('No private key found');
                    return;
                }

                const privateKey = await importPrivateKey(privateKeyString);
                const decryptedMessages = await Promise.all(
                    data.map(async (message) => {
                        if (message.isEncrypted && message.encryptedText) {
                            try {
                                const decryptedText = await decryptMessage(message.encryptedText, privateKey);
                                return {
                                    ...message,
                                    text: decryptedText
                                };
                            } catch (error) {
                                console.error('Failed to decrypt message:', error);
                                return message;
                            }
                        }
                        return message;
                    })
                );

                setMessages(decryptedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        // Fetch receiver's public key
        const fetchReceiverPublicKey = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/users/${selectedUser._id}`);
                const data = await response.json();
                if (data.publicKey) {
                    const publicKey = await importPublicKey(data.publicKey);
                    setReceiverPublicKey(publicKey);
                }
            } catch (error) {
                console.error('Error fetching public key:', error);
            }
        };

        fetchMessages();
        fetchReceiverPublicKey();
    }, [selectedUser]);

    // Send message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser?._id) return;

        try {
            // Send message to server
            const response = await fetch(`http://localhost:3000/api/messages/send/${selectedUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    text: newMessage
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send message');
            }

            const data = await response.json();

            // Add message to local state
            setMessages([...messages, {
                ...data.data,
                text: newMessage // Use original text for display
            }]);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert(error.message);
        }
    };

    if (!selectedUser) {
        return <div className="flex items-center justify-center h-screen">
            <p>Select a user to start chatting</p>
        </div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-xl font-semibold">{selectedUser.fullName || selectedUser.email}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${message.senderId === localStorage.getItem('userId')
                            ? 'text-right'
                            : 'text-left'
                            }`}
                    >
                        <div
                            className={`inline-block p-3 rounded-lg ${message.senderId === localStorage.getItem('userId')
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 p-2 border rounded"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat; 