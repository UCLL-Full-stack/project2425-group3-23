import React from 'react';
import { Message } from '../types';

interface ChatWindowProps {
    messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    return (
        <div style={styles.chatContainer}>
            {messages.map((message) => (
                <div key={message.id} style={styles.messageContainer}>
                    <div style={styles.avatar}>
                        {message.sender.username[0].toUpperCase()}
                    </div>
                    <div style={styles.messageContent}>
                        <p style={styles.username}>{message.sender.username}</p>
                        <div style={styles.bubble}>
                            <p style={styles.content}>{message.content}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const styles = {
    chatContainer: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f3f3f3',
        borderRadius: '8px',
    },
    messageContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#0070f3',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginRight: '10px',
    },
    messageContent: {
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    username: {
        fontWeight: 'bold',
        marginBottom: '5px',
        fontSize: '0.9em',
        color: '#333',
    },
    bubble: {
        backgroundColor: '#e0e0e0',
        borderRadius: '12px',
        padding: '10px',
        maxWidth: '80%',
    },
    content: {
        margin: 0,
        fontSize: '1em',
        color: '#333',
    },
};

export default ChatWindow;
