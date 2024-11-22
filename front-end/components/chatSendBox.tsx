import { useRouter } from 'next/router';
import { useState } from 'react';
import { createMessage } from '../services/api';

const ChatSendBox: React.FC = () => {
    const router = useRouter();
    const [content, setContent] = useState<string>('');

    return (
        <>
            <form onSubmit={(event) => {
                event.preventDefault();
                // Send the message
                createMessage(content, 'Yorick')
                    .then(() => {
                        // Clear the input field
                        setContent('');
                    })
                    .catch((error) => {
                        console.error('Failed to send message:', error);
                    });
            }}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                />
                <button
                    type="submit"
                >
                    Send
                </button>
            </form>
        </>
    );
}

export default ChatSendBox;