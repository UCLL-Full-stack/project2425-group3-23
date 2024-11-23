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

                const form = event.target as HTMLFormElement;
                const senderSelect = form.sender as HTMLSelectElement;
                const sender = senderSelect.value;

                // Send the message
                createMessage(content, sender)
                    .then(() => {
                        // Clear the input field
                        setContent('');
                    })
                    .catch((error) => {
                        console.error('Failed to send message:', error);
                    });
            }}>
                <select name="sender">
                    <option value="Sofie">Sofie</option>
                    <option value="Yorick">Yorick</option>
                </select>
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