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

export {prepareUser, prepareFriend, prepareMessage, prepareChat, prepareFriendRequest};