import React, {useEffect} from 'react';
import {Message, User} from '@/types';
import ClearIcon from '@mui/icons-material/Clear';
import {Avatar, Button, Dialog, List, ListItem, ListItemText, Typography} from "@mui/material";
import {Box} from "@mui/system";
import ChatSendBox from "@/components/chatSendBox";
import ChatProfileDialog from "@/components/chatProfileDialog";
import ChatFriendsWindow from "@/components/chatFriendsWindow";
import {deleteMessage} from "@services/api";
import GenericErrorDialog from "@components/genericErrorDialog";

interface ChatWindowProps {
    messages: Message[];
    updateMessages: () => void;
    user: User | null;
    updateUser: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, updateMessages, user, updateUser }) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const [chatProfiledialogOpen, setChatProfiledialogOpen] = React.useState<boolean>(false);
    const [warningDialogOpen, setWarningDialogOpen] = React.useState<boolean>(false);
    const [selectedUserName, setSelectedUserName] = React.useState<string | null>(null);
    const [selectedMessageId, setSelectedMessageId] = React.useState<number | null>(null);
    const [error, setError] = React.useState<string | null>('');
    const [openError, setOpenError] = React.useState<boolean>(false);
    const [token, setToken] = React.useState<string>('');
    const [role, setRole] = React.useState<string>('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setToken(storedUser.token);
            setRole(storedUser.role);
        }
    }, []);

    const handleAvatarClick = (username: string) => {
        setSelectedUserName(username);
        setChatProfiledialogOpen(true);
    }

    const handleDeleteClick = async (messageId: number) => {
        const message = messages.find(message => message.id === messageId);

        if (!message.deleted) {
            await deleteMessage(messageId, token)
            updateMessages();
        } else {
            setSelectedMessageId(messageId);
            setWarningDialogOpen(true);
        }
    }

    const handleChatProfileDialogClose = () => {
        setChatProfiledialogOpen(false);
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
            <Box sx={{ display: 'flex', gap: '1em' }}>
                <Box
                    sx={{
                        width: '60%',
                        minWidth: '400px',
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
                                <ListItem key={message.id} sx={{ bgcolor: message.deleted ? '#FFCCCB' : 'inherit' }}>
                                    {user && message.sender?.username === user.username && (
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
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    {message.content}
                                                    <ClearIcon
                                                        sx={{
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                color: 'red'
                                                            },
                                                            color: message.deleted ? 'red' : 'inherit'
                                                        }}
                                                        onClick={async () => {
                                                            await handleDeleteClick(message.id);
                                                        }} />
                                                </Box>
                                            </ListItemText>
                                        </>
                                    )}
                                    {(!user || message.sender.username !== user.username) && (
                                        <>
                                            <ListItemText
                                                sx={{
                                                    bgcolor: '#FFFFFF',
                                                    p: '1em',
                                                    borderRadius: '0.5em',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    {message.content}
                                                        {role === 'admin' &&
                                                        <ClearIcon
                                                            sx={{
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    color: 'red'
                                                                },
                                                                color: message.deleted ? 'red' : 'inherit'
                                                            }}
                                                            onClick={async () => {
                                                                await handleDeleteClick(message.id);
                                                            }} />
                                                    }
                                                </Box>
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
                    {user && <ChatSendBox senderUsername={user.username} />}
                </Box>
                {user && <ChatFriendsWindow user={user} updateUser={updateUser} />}
            </Box>
            <Dialog open={warningDialogOpen} onClose={() => setWarningDialogOpen(false)}>
                <Box sx={{ p: '1em' }}>
                    <Typography variant='h4'>Warning ⚠️</Typography>
                    <Typography variant='body1' sx={{ mt: '1em', mb: '1em' }}>Are you sure you want to <strong>PERMANENTLY</strong> delete this message?</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1em' }}>
                        <Button variant='outlined' onClick={async () => {
                            setWarningDialogOpen(false);
                        }}>
                            Cancel
                        </Button>
                        <Button variant='contained' color='error' onClick={async () => {
                            try {
                                await deleteMessage(selectedMessageId, token);
                                updateMessages();
                            } catch (error) {
                                setError(error.message);
                                setOpenError(true);
                            }
                            setWarningDialogOpen(false);
                        }}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Dialog>
            <ChatProfileDialog
                selectedUsername={selectedUserName}
                user={user}
                updateUser={updateUser}
                open={chatProfiledialogOpen}
                onClose={handleChatProfileDialogClose}
            />
            {openError && <GenericErrorDialog open={openError} errorMessage={error} onClose={() => setOpenError(false)} />}
        </>
    );
};

export default ChatWindow;
