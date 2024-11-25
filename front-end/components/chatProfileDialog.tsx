import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, Dialog, Typography} from "@mui/material";
import {User} from "@/types";
import {addFriend, getUser, removeFriend} from "@/services/api";

type Props = {
    user: User; // The username of the current user
    selectedUsername: string | null; // The username of the selected user
    updateUser: () => void; // Function to update the user object
    open: boolean; // Whether the dialog is open
    onClose: () => void; // Function to close the dialog
}

const ChatProfileDialog: React.FC<Props> = ({ user, selectedUsername, updateUser, open, onClose }: Props) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchSelectedUser = async () => {
            if (selectedUsername) {
                setSelectedUser(await getUser(selectedUsername));
            }
        }

        fetchSelectedUser();
    }, [selectedUsername, open]);

    const isFriend = (myUsername : string, user : User) => {
        if (!user.friends) {
            return false;
        }

        return user.friends.some(friend => friend.username === myUsername);
    }

    const hasPendingFriendRequest = (user : User, recipient : User) => {
        if (!user) {
            return false;
        }
        if (!user.friends) {
            return false;
        }
        if (!recipient.friendRequests) {
            return false;
        }

        return recipient.friendRequests.filter(request => request.sender.username === user.username).some(request => request.status === 'pending');
    }

    const addFriendClick = async () => {
        if (selectedUser && selectedUser.username) {
            try {
                await addFriend(user.username, selectedUser.username);
                // Update the user object to reflect the new friend status
                setSelectedUser(await getUser(selectedUser.username));
                updateUser();
            } catch (error) {
                console.error('Error adding friend:', error);
            }
        }
    }

    const removeFriendClick = async () => {
        if (selectedUser && selectedUser.username) {
            try {
                await removeFriend(user.username, selectedUser.username);
                // Update the user object to reflect the new friend status
                setSelectedUser(await getUser(selectedUser.username));
                updateUser();
            } catch (error) {
                console.error('Error removing friend:', error);
            }
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <Box sx={{
                p: '1em',
                display: 'flex'
            }}>
                {selectedUser && (
                    <>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                marginRight: '1em'
                            }}
                        />
                        <Box>
                            <Typography variant="h5">{selectedUser?.username}</Typography>
                            {isFriend(user.username, selectedUser) && (
                                <>
                                    <Typography variant="body1" sx={{ textDecoration: "underline", fontWeight: 'bold' }}>Friend</Typography>
                                    <Button variant="contained" color="error" onClick={removeFriendClick}>Remove Friend</Button>
                                </>
                            )}
                            {user.username != selectedUser.username && !isFriend(user.username, selectedUser) && !hasPendingFriendRequest(user, selectedUser) && (
                                <Button variant="contained" color="primary" onClick={addFriendClick}>Add Friend</Button>
                            )}
                            {hasPendingFriendRequest(user, selectedUser) && (
                                <Typography variant="body1" sx={{ color: 'text.disabled' }}>Friend request pending...</Typography>
                            )}
                            {user.username == selectedUser.username && (
                                <Typography variant="body1" sx={{ color: 'text.disabled' }}>This is you!</Typography>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </Dialog>
    );
};

export default ChatProfileDialog;