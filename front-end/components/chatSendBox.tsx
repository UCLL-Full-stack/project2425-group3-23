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
            }}className="bg-[#23272a] p-4 flex items-center gap-2 border-t border-[#2c2f33]">
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