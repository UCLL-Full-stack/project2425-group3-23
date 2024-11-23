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
                    className="flex-1 bg-[#2c2f33] text-white placeholder-gray-500 p-3 rounded-lg outline-none border border-[#3a3f45] focus:border-[#7289da]"
                />
                <button
                    type="submit"
                    className="bg-[#7289da] text-white px-4 py-2 rounded-lg hover:bg-[#5b6eae]"
                >
                    Send
                </button>
            </form>
        </>
    );
}

export default ChatSendBox;