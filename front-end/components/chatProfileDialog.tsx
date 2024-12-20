import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, Dialog, Typography} from "@mui/material";
import {User} from "@/types";
import {
    acceptFriendRequest,
    banUser,
    declineFriendRequest,
    getUser,
    removeFriend,
    sendFriendRequest
} from "@services/userService";
import {useTranslation} from "next-i18next";
import useSWR, {mutate} from "swr";
import GenericErrorDialog from "@components/genericErrorDialog";

type Props = {
    user: User; // The username of the current user
    selectedUsername: string | null; // The username of the selected user
    updateUser: () => void; // Function to update the user object
    open: boolean; // Whether the dialog is open
    onClose: () => void; // Function to close the dialog
};

const ChatProfileDialog: React.FC<Props> = ({
    user,
    selectedUsername,
    updateUser,
    open,
    onClose,
}: Props) => {
    const { t } = useTranslation();
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ role, setRole ] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");
        setRole(storedUser ? JSON.parse(storedUser).role : "");
    }, [user]);

    const fetcher = async () => {
        try {
            return await getUser(selectedUsername, user.token);
        } catch (error) {
            return null;
        }
    }
    const { data: selectedUser } = useSWR('selectedUserProfile', fetcher);

    useEffect(() => {
        mutate('selectedUserProfile');
    }, [selectedUsername, open]);

    const handleBanUserClick = async () => {
        try {
            await banUser(selectedUser.username, user.token);
            await mutate('selectedUserProfile');
            onClose();
        } catch (error) {
            setErrorMessage(error.message);
            onClose();
        }
    };
    

    const isFriend = (myUsername: string, user: User) => {
        if (!user.friends) {
            return false;
        }

        return user.friends.some((friend) => friend.username === myUsername);
    };

    const hasPendingReceivedFriendRequest = (user: User, sender: User) => {
        if (!user) {
            return false;
        }
        if (!user.friendRequests) {
            return false;
        }

        return user.friendRequests
            .filter((request) => request.sender.username === sender.username)
            .some((request) => request.status === "pending");
    };

    const hasPendingSentFriendRequest = (user: User, recipient: User) => {
        if (!user) {
            return false;
        }
        if (!user.friends) {
            return false;
        }
        if (!recipient.friendRequests) {
            return false;
        }

        return recipient.friendRequests
            .filter((request) => request.sender.username === user.username)
            .some((request) => request.status === "pending");
    };

    const getPendingReceivedFriendRequest = (user: User, sender: User) => {
        if (!user) {
            return null;
        }
        if (!user.friendRequests) {
            return null;
        }

        return user.friendRequests.find(
            (request) =>
                request.sender.username === sender.username &&
                request.status === "pending"
        );
    };

    const addFriendClick = async () => {
        if (selectedUser && selectedUser.username) {
            try {
                await sendFriendRequest(user.username, selectedUser.username, user.token);
                // Update the user object to reflect the new friend status
                mutate('selectedUserProfile');
                updateUser();
            } catch (error) {
                setErrorMessage(error.message);
            }
        }
    };

    const removeFriendClick = async () => {
        if (selectedUser && selectedUser.username) {
            try {
                await removeFriend(user.username, selectedUser.username, user.token);
                // Update the user object to reflect the new friend status
                mutate('selectedUserProfile');
                updateUser();
            } catch (error) {
                setErrorMessage(error.message);
            }
        }
    };

    const acceptFriendRequestClick = async () => {
        if (selectedUser && selectedUser.username) {
            const request = getPendingReceivedFriendRequest(user, selectedUser);
            if (request) {
                try {
                    await acceptFriendRequest(request.id, user.token);
                    // Update the user object to reflect the new friend status
                    mutate('selectedUserProfile');
                    updateUser();
                } catch (error) {
                    setErrorMessage(error.message);
                }
            }
        }
    };

    const declineFriendRequestClick = async () => {
        if (selectedUser && selectedUser.username) {
            const request = getPendingReceivedFriendRequest(user, selectedUser);
            if (request) {
                try {
                    await declineFriendRequest(request.id, user.token);
                    // Update the user object to reflect the new friend status
                    mutate('selectedUserProfile');
                    updateUser();
                } catch (error) {
                    setErrorMessage(error.message);
                }
            }
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <Box
                    sx={{
                        p: "1em",
                        display: "flex",
                    }}
                >
                    {selectedUser && (
                        <>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    marginRight: "1em",
                                }}
                            />
                            <Box>
                                <Typography variant="h5">{selectedUser?.username}</Typography>
                                {selectedUser?.isBanned && (
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "red",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {t("chat.profileDialog.banned")}
                                    </Typography>
                                )}
                                {isFriend(user.username, selectedUser) && (
                                    <>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                textDecoration: "underline",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {t("chat.profileDialog.friend")}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={removeFriendClick}
                                        >
                                            {t("chat.profileDialog.remove")}
                                        </Button>
                                    </>
                                )}
                                {user.username !== selectedUser.username &&
                                    !isFriend(user.username, selectedUser) &&
                                    !hasPendingSentFriendRequest(user, selectedUser) &&
                                    !hasPendingReceivedFriendRequest(user, selectedUser) && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={addFriendClick}
                                        >
                                            {t("chat.profileDialog.add")}
                                        </Button>
                                    )}
                                {hasPendingReceivedFriendRequest(user, selectedUser) && (
                                    <>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "text.disabled" }}
                                        >
                                            {t("chat.profileDialog.received")}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ mr: "0.5em" }}
                                            onClick={acceptFriendRequestClick}
                                        >
                                            {t("chat.profileDialog.accept")}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            sx={{ ml: "0.5em" }}
                                            onClick={declineFriendRequestClick}
                                        >
                                            {t("chat.profileDialog.decline")}
                                        </Button>
                                    </>
                                )}
                                {hasPendingSentFriendRequest(user, selectedUser) && (
                                    <Typography
                                        variant="body1"
                                        sx={{ color: "text.disabled" }}
                                    >
                                        {t("chat.profileDialog.pending")}
                                    </Typography>
                                )}
                                {role === "admin" && !selectedUser.isBanned && user.username !== selectedUser.username && !selectedUser.isBanned && (
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={handleBanUserClick}
                                        sx={{ mt: "1em" }}
                                    >
                                        {t("chat.profileDialog.ban")}
                                    </Button>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            </Dialog>
            <GenericErrorDialog open={!!errorMessage} errorMessage={errorMessage} onClose={() => {setErrorMessage("")}} />
        </>
    );
};

export default ChatProfileDialog;
