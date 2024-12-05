import {Chat, FriendRequest, Message, User} from "../types";

const prepareUser = (user: User) => {
    delete user.password;
    delete user.messages;

    if (user.chats) {
        user.chats = user.chats.map((chat) => {
            return {
                id: chat.id,
                type: chat.type
            }
        });
    }
    if (user.friends) {
        user.friends = user.friends.map((friend) => {
            return {
                username: friend.username
            }
        });
    }
    if (user.friendRequests) {
        user.friendRequests = user.friendRequests.map((friendRequest) => {
            return {
                id: friendRequest.id,
                status: friendRequest.status,
                sender: {
                    username: friendRequest.sender?.username
                }
            }
        });
    }
}

const prepareFriend = (friend: User) => {
    prepareUser(friend);
    delete friend.chats;
    delete friend.friends;
    delete friend.friendRequests;
}

const prepareMessage = (message: Message) => {
    if (message.sender) {
        message.sender = {
            username: message.sender.username
        }
    }
    if (message.chat) {
        message.chat = {
            id: message.chat.id,
            type: message.chat.type
        }
    }
}

const prepareChat = (chat: Chat) => {
    delete chat.messages;
    chat.users = chat.users?.map((user) => {
        return {
            username: user.username
        }
    });
}

const prepareFriendRequest = (friendRequest: FriendRequest) => {
    friendRequest.sender = {
        username: friendRequest.sender?.username
    }
    friendRequest.receiver = {
        username: friendRequest.receiver?.username
    }
}

/**
 * Prepares a User object by removing sensitive information and filtering
 * the user's chats, friends, and friend requests to only include those
 * involving the logged-in user.
 *
 * @param user - The User object to be prepared.
 * @param loggedInUser - The currently logged-in User object.
 */
const prepareUserStrict = (user: User, loggedInUser: User) => {
    prepareUser(user);
    if (user.chats) {
        user.chats = user.chats.filter((chat) => {
            return chat.users?.some((chatUser) => {
                return chatUser.username === loggedInUser.username;
            });
        });
    }
    if (user.friends) {
        user.friends = user.friends.filter((friend) => {
            return friend.username === loggedInUser.username;
        });
    }
    if (user.friendRequests) {
        user.friendRequests = user.friendRequests.filter((friendRequest) => {
            return friendRequest.sender?.username === loggedInUser.username;
        });
    }
}

export {
    prepareUser,
    prepareFriend,
    prepareMessage,
    prepareChat,
    prepareFriendRequest,
    prepareUserStrict
};