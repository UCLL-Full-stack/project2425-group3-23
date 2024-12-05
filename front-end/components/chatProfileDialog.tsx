import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, Dialog, Typography} from "@mui/material";
import {User} from "@/types";
import {sendFriendRequest, getUser, removeFriend, acceptFriendRequest, declineFriendRequest} from "@/services/api";
import {useTranslation} from "next-i18next";

type Props = {
    user: User; // The username of the current user
    selectedUsername: string | null; // The username of the selected user
    updateUser: () => void; // Function to update the user object
    open: boolean; // Whether the dialog is open
    onClose: () => void; // Function to close the dialog
}

const ChatProfileDialog: React.FC<Props> = ({ user, selectedUsername, updateUser, open, onClose }: Props) => {
    const { t } = useTranslation();

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setToken(storedUser.token);
        }

        const fetchSelectedUser = async () => {
            try {
                if (selectedUsername) {
                    setSelectedUser(await getUser(selectedUsername, token));
                }
            } catch (error) {
                console.error('Error fetching selected user:', error);
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

    const hasPendingReceivedFriendRequest = (user : User, sender : User) => {
        if (!user) {
            return false;
        }
        if (!user.friendRequests) {
            return false;
        }

        return user.friendRequests.filter(request => request.sender.username === sender.username).some(request => request.status === 'pending');
    }

    const hasPendingSentFriendRequest = (user : User, recipient : User) => {
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

    const getPendingReceivedFriendRequest = (user : User, sender : User) => {
        if (!user) {
            return null;
        }
        if (!user.friendRequests) {
            return null;
        }

        return user.friendRequests.find(request => request.sender.username === sender.username && request.status === 'pending');
    }

    const addFriendClick = async () => {
        if (selectedUser && selectedUser.username) {
            try {
                await sendFriendRequest(user.username, selectedUser.username, token);
                // Update the user object to reflect the new friend status
                setSelectedUser(await getUser(selectedUser.username, token));
                updateUser();
            } catch (error) {
                console.error('Error adding friend:', error);
            }
        }
    }

    const removeFriendClick = async () => {
        if (selectedUser && selectedUser.username) {
            try {
                await removeFriend(user.username, selectedUser.username, token);
                // Update the user object to reflect the new friend status
                setSelectedUser(await getUser(selectedUser.username, token));
                updateUser();
            } catch (error) {
                console.error('Error removing friend:', error);
            }
        }
    }

    const acceptFriendRequestClick = async () => {
        if (selectedUser && selectedUser.username) {
            const request = getPendingReceivedFriendRequest(user, selectedUser);
            console.log(request);

            if (request) {
                try {
                    await acceptFriendRequest(request.id, token);
                    // Update the user object to reflect the new friend status
                    setSelectedUser(await getUser(selectedUser.username, token));
                    updateUser();
                } catch (error) {
                    console.error('Error accepting friend request:', error);
                }
            }
        }
    }

    const declineFriendRequestClick = async () => {
        if (selectedUser && selectedUser.username) {
            const request = getPendingReceivedFriendRequest(user, selectedUser);
            console.log(request);

            if (request) {
                try {
                    await declineFriendRequest(request.id, token);
                    // Update the user object to reflect the new friend status
                    setSelectedUser(await getUser(selectedUser.username, token));
                    updateUser();
                } catch (error) {
                    console.error('Error declining friend request:', error);
                }
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
                                    <Typography variant="body1" sx={{ textDecoration: "underline", fontWeight: 'bold' }}>{t("chat.profileDialog.friend")}</Typography>
                                    <Button variant="contained" color="error" onClick={removeFriendClick}>{t("chat.profileDialog.remove")}</Button>
                                </>
                            )}
                            {user.username != selectedUser.username && !isFriend(user.username, selectedUser) && !hasPendingSentFriendRequest(user, selectedUser) && !hasPendingReceivedFriendRequest(user, selectedUser) && (
                                <Button variant="contained" color="primary" onClick={addFriendClick}>{t("chat.profileDialog.add")}</Button>
                            )}
                            {hasPendingReceivedFriendRequest(user, selectedUser) && (
                                <>
                                    <Typography variant="body1" sx={{ color: 'text.disabled' }}>{t("chat.profileDialog.received")}</Typography>
                                    <Button variant="contained" color="success" sx={{ mr: '0.5em' }} onClick={acceptFriendRequestClick}>{t("chat.profileDialog.accept")}</Button>
                                    <Button variant="contained" color="error" sx={{ ml: '0.5em' }} onClick={declineFriendRequestClick}>{t("chat.profileDialog.decline")}</Button>
                                </>
                            )}
                            {hasPendingSentFriendRequest(user, selectedUser) && (
                                <>
                                    <Typography variant="body1" sx={{ color: 'text.disabled' }}>{t("chat.profileDialog.pending")}</Typography>
                                    <Button variant="contained" color="error">{t("chat.profileDialog.cancel")}</Button>
                                </>
                            )}
                            {user.username == selectedUser.username && (
                                <Typography variant="body1" sx={{ color: 'text.disabled' }}>{t("chat.profileDialog.thisIsYou")}</Typography>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </Dialog>
    );
};

export default ChatProfileDialog;