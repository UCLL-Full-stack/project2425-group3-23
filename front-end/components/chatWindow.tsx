import React, {useEffect} from 'react';
import {Message, User} from '@/types';
import {Avatar, List, ListItem, ListItemText} from "@mui/material";
import {Box} from "@mui/system";
import ChatSendBox from "@/components/chatSendBox";
import ChatProfileDialog from "@/components/chatProfileDialog";

interface ChatWindowProps {
    messages: Message[];
    user: User;
    updateUser: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, user, updateUser }) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
    const [selectedUserName, setSelectedUserName] = React.useState<string | null>(null);

    const handleAvatarClick = (username: string) => {
        setSelectedUserName(username);
        setDialogOpen(true);
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedUserName(null);
    }

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Box
                    sx={{
                        width: '50%',
                        minWidth: '400px',
                        maxWidth: '800px',
                        m: '0 auto',
                        p: '1em',
                        bgcolor: '#F3F3F3',
                        borderRadius: '1em',
                    }}
                >
                    <Box
                        sx={{
                            maxHeight: '75vh', // Fixed height for scrolling
                            overflow: 'auto', // Enable scrolling
                        }}
                    >
                        <List>
                            {messages.map((message: Message) => (
                                <ListItem key={message.id}>
                                    {message.sender?.username === 'Sofie' && (
                                        <>
                                            <Avatar
                                                sx={{ bgcolor: '#3399FF', mr: '0.5em' }}
                                                onClick={() => handleAvatarClick(message.sender.username)} // Add onClick handler
                                            >
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
                                            <Avatar
                                                sx={{ bgcolor: '#FF9933', ml: '0.5em' }}
                                                onClick={() => handleAvatarClick(message.sender.username)} // Add onClick handler
                                            >
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
            <ChatProfileDialog
                user={user}
                selectedUsername={selectedUserName}
                updateUser={updateUser}
                open={dialogOpen}
                onClose={handleDialogClose}
            />
        </>
    );
};

export default ChatWindow;
