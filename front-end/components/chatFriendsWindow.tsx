import {User} from "@/types";
import {Box, Button, Dialog, Icon, TextField, Typography} from "@mui/material";
import {
    acceptFriendRequest,
    declineFriendRequest,
    getFriendRequests,
    removeFriend,
    sendFriendRequest
} from "@/services/api";
import React, {useEffect} from "react";
import GenericErrorDialog from "@/components/genericErrorDialog";
import NotificationsIcon from '@mui/icons-material/Notifications';

type chatFriendsWindowProps = {
    user: User;
    updateUser: () => void;
}

const ChatFriendsWindow: React.FC<chatFriendsWindowProps> = ({ user, updateUser }) => {
    const [friendUsername, setFriendUsername] = React.useState('');
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = React.useState('');
    const [friendRequestsDialogOpen, setFriendRequestsDialogOpen] = React.useState(false);
    const [friendRequests, setFriendRequests] = React.useState(user.friendRequests);

    useEffect(() => {
        updateFriendRequests();
    }, [user]);

    const updateFriendRequests = async () => {
        const friendRequests = await getFriendRequests(user.username);
        setFriendRequests(friendRequests.filter(request => request.status === 'pending'));
    }

    const openErrorDialog = (message: string) => {
        setErrorDialogMessage(message);
        setErrorDialogOpen(true);
    }

    const closeErrorDialog = () => {
        setErrorDialogOpen(false);
    }

    const removeFriendClick = async (friend: string) => {
        try {
            await removeFriend(user.username, friend);
            updateUser();
        } catch (error : any) {
            openErrorDialog(error.message);
        }
    }

    const sendFriendRequestClick = async () => {
        try {
            await sendFriendRequest(user.username, friendUsername);
            updateUser();
            setFriendUsername('');
        } catch (error : any) {
            openErrorDialog(error.message);
        }
    }

    const acceptFriendRequestClick = async (id: number) => {
        try {
            await acceptFriendRequest(id);
            updateUser();
            await updateFriendRequests();
        } catch (error : any) {
            openErrorDialog(error.message);
        }
    }

    const declineFriendRequestClick = async (id: number) => {
        try {
            await declineFriendRequest(id);
            updateUser();
            await updateFriendRequests();
        } catch (error : any) {
            openErrorDialog(error.message);
        }
    }

    const openFriendRequestsDialog = async () => {
        setFriendRequestsDialogOpen(true);

        try {
            await updateFriendRequests();
        } catch (error : any) {
            openErrorDialog(error.message);
        }
    }

    return (
        <Box sx={{
            width: '25%',
            minWidth: '400px',
            m: '0 auto',
            p: '1em',
            bgcolor: '#F3F3F3',
            borderRadius: '1em',
            maxHeight: '75vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Typography variant='h4' sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                    Friends
                </Typography>
                <Box sx={{ position: 'absolute', right: 0 }}>
                    <NotificationsIcon
                        sx={{
                            fontSize: '2rem',
                            cursor: 'pointer',
                            color: friendRequests.length > 0 ? 'yellow' : 'inherit'
                        }}
                        onClick={openFriendRequestsDialog}
                    />
                </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {user.friends && user.friends.map(friend => (
                    <Box key={friend.username} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: '0.5em',
                        borderBottom: '1px solid #D3D3D3'
                    }}>
                        <Typography variant='h6'>{friend.username}</Typography>
                        <Box sx={{ display: 'flex', gap: '0.5em' }}>
                            <Button variant='contained' color='info'>Chat</Button>
                            <Button variant='contained' color='error' onClick={() => removeFriendClick(friend.username)}>Remove</Button>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box>
                <Typography variant="h5">Send friend request</Typography>
                <Box sx={{
                    display: 'flex',
                    gap: '1em',
                    alignItems: 'center'
                }}>
                    <TextField
                        fullWidth
                        placeholder={'User\'s username'}
                        value={friendUsername}
                        onChange={(event) => setFriendUsername(event.target.value)}
                    />
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={sendFriendRequestClick}
                        sx={{ height: '4em', width: '8em' }}
                    >
                        Send
                    </Button>
                </Box>
            </Box>
            <Dialog open={friendRequestsDialogOpen} onClose={() => setFriendRequestsDialogOpen(false)}>
                <Box sx={{ p: '2em', minWidth: '300px' }}>
                    <Typography variant='h4' sx={{ mb: '1em', textAlign: 'center' }}>Friend Requests</Typography>
                    {friendRequests.length > 0 ? (
                        friendRequests.map(request => (
                            <Box key={request.sender.username} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1em' }}>
                                <Typography variant='h6'>{request.sender.username}</Typography>
                                <Box sx={{ display: 'flex', gap: '0.5em' }}>
                                    <Button variant='contained' color='primary' onClick={() => acceptFriendRequestClick(request.id)}>Accept</Button>
                                    <Button variant='contained' color='error' onClick={() => declineFriendRequestClick(request.id)}>Decline</Button>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography variant='body1' sx={{ textAlign: 'center' }}>No friend requests</Typography>
                    )}
                </Box>
            </Dialog>
            <GenericErrorDialog open={errorDialogOpen} errorMessage={errorDialogMessage} onClose={closeErrorDialog} />
        </Box>
    )
}

export default ChatFriendsWindow;