import React from 'react';
import { Message } from '../types';
import {Avatar, List, ListItem, ListItemText, Typography} from "@mui/material";
import {Box} from "@mui/system";
import ChatSendBox from "@/components/chatSendBox";

interface ChatWindowProps {
    messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    return (
        <Box sx={{ width: '50%', minWidth: '400px', maxWidth: '800px', m: '0 auto', p: '1em', bgcolor: '#F3F3F3', borderRadius: '1em' }}>
            <List>
            {messages.map((message : Message, index) => (
                <ListItem key={ index }>
                    {message.sender.username == "Sofie" &&
                        <>
                            <Avatar sx={{bgcolor: '#3399FF', mr: '0.5em'}}>
                                {message.sender.username[0].toUpperCase()}
                            </Avatar><ListItemText sx={{bgcolor: '#FFFFFF', p: '1em', borderRadius: '0.5em'}}>
                                {message.content}
                            </ListItemText>
                        </>
                    }
                    {message.sender.username == "Yorick" &&
                        <>
                            <ListItemText sx={{bgcolor: '#FFFFFF', p: '1em', borderRadius: '0.5em'}}>
                                {message.content}
                            </ListItemText>
                            <Avatar sx={{bgcolor: '#FF9933', ml: '0.5em'}}>
                                {message.sender.username[0].toUpperCase()}
                            </Avatar>
                        </>
                    }
                </ListItem>
            ))}
            </List>
            <ChatSendBox></ChatSendBox>
        </Box>
    );
};

export default ChatWindow;
