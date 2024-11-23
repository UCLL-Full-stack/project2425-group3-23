import React, {useState} from 'react';
import {createMessage} from '@/services/api';
import {Box, Button, MenuItem, Select, TextField} from "@mui/material";

const ChatSendBox: React.FC = () => {
    const [content, setContent] = useState<string>('');

    return (
        <>
            <Box component="form" sx={{ display: 'flex', alignItems: 'center', gap: '0.5em' }} onSubmit={(event) => {
                event.preventDefault();

                const form = event.target as HTMLFormElement;
                const senderSelect = form.sender as HTMLSelectElement;
                const sender = senderSelect.value;

                createMessage(content, sender)
                    .then(() => {
                        setContent('');
                    })
                    .catch((error) => {
                        console.error('Failed to send message:', error);
                    });
            }}>
                <Select name="sender" sx={{ minWidth: '100px' }} defaultValue="Sofie">
                    <MenuItem value="Sofie">Sofie</MenuItem>
                    <MenuItem value="Yorick">Yorick</MenuItem>
                </Select>
                <TextField
                    sx={{ flexGrow: 1 }}
                    placeholder="Type a message..."
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    className="flex-1 bg-[#2c2f33] text-white placeholder-gray-500 p-3 rounded-lg outline-none border border-[#3a3f45] focus:border-[#7289da]"
                />
                <Button
                    variant="contained"
                    type="submit"
                    sx={{ flexShrink: 0, height: '4em' }}
                >
                    Send
                </Button>
            </Box>
        </>
    );
}

export default ChatSendBox;