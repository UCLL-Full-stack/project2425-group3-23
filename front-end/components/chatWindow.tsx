import React, {useEffect} from 'react';
import {Message} from '@/types';
import {Avatar, List, ListItem, ListItemText} from "@mui/material";
import {Box} from "@mui/system";
import ChatSendBox from "@/components/chatSendBox";

interface ChatWindowProps {
    messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{
                width: '50%',
                minWidth: '400px',
                maxWidth: '800px',
                m: '0 auto',
                p: '1em',
                bgcolor: '#F3F3F3',
                borderRadius: '1em',
            }}>
                <Box
                    sx={{
                        maxHeight: '75vh', // Fixed height for scrolling
                        overflow: 'auto' // Enable scrolling
                    }}
                >
                    <List>
                        {messages.map((message : Message) => (
                            <ListItem key={message.id}>
                                {message.sender.username === 'Sofie' && (
                                    <>
                                        <Avatar sx={{ bgcolor: '#3399FF', mr: '0.5em' }}>
                                            {message.sender.username[0].toUpperCase()}
                                        </Avatar>
                                        <ListItemText
                                            sx={{
                                                bgcolor: '#FFFFFF',
                                                p: '1em',
                                                borderRadius: '0.5em',
                                            }}
                                        >
                                            {message.content}
                                        </ListItemText>
                                    </>
                                )}
                                {message.sender.username === 'Yorick' && (
                                    <>
                                        <ListItemText
                                            sx={{
                                                bgcolor: '#FFFFFF',
                                                p: '1em',
                                                borderRadius: '0.5em',
                                            }}
                                        >
                                            {message.content}
                                        </ListItemText>
                                        <Avatar sx={{ bgcolor: '#FF9933', ml: '0.5em' }}>
                                            {message.sender.username[0].toUpperCase()}
                                        </Avatar>
                                    </>
                                )}
                            </ListItem>
                        ))}
                        {/* Ref to ensure scrolling happens */}
                        <div ref={messagesEndRef}></div>
                    </List>
                </Box>
                <ChatSendBox />
            </Box>
        </Box>
    );
};

export default ChatWindow;
