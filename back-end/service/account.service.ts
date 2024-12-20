import bcrypt from "bcrypt";
import userDb from "../repository/user.db";
import {AuthenticationResponse} from "../types";
import jwtUtils from "../util/jwt";
import {User} from "../model/user";
import chatService from "../service/chat.service";

const authenticate = async ({ username, password } : { username : string, password: string } ) : Promise<AuthenticationResponse> => {
    const user : User | undefined = await userDb.getUserByUsername({username});
    if (!user) {
        throw new Error(`Incorrect credentials.`);
    }
    if (user.isUserBanned()){
        throw new Error(`User with username: ${username} is banned`);
    }

    const isValidPassword : boolean = await bcrypt.compare(password, user.getPassword());
    if (!isValidPassword) {
        throw new Error('Incorrect credentials.');
    }

    const role = user.getRole();
    if (user.getRole() !== role) {
        throw new Error(`User with username: ${username} does not have a role.`);
    }

    return {
        token: jwtUtils.generateJwtToken(username, role),
        username: username,
        role: role
    };
}

const register = async ({ username, password } : { username: string, password: string }) : Promise<void> => {
    const existingUser : User | undefined = await userDb.getUserByUsername({username: username});
    if (existingUser) {
        throw new Error(`User with username: ${username} already exists.`);
    }

    const user : User = new User({
        username: username,
        password: password,
        role: 'user',
        messages: [],
        friends: [],
        friendRequests: []
    });
    await userDb.addUser({user});

    const publicChat = await chatService.getPublicChat();
    await chatService.addUserToChat(publicChat.getId() as number, username);
}

const banUser = async ({ adminUsername, targetUsername }: { adminUsername: string; targetUsername: string }): Promise<void> => {
    const admin: User | undefined = await userDb.getUserByUsername({ username: adminUsername });
    const targetUser: User | undefined = await userDb.getUserByUsername({ username: targetUsername });

    if (!admin || admin.getRole() !== 'admin') {
        throw new Error(`User ${adminUsername} does not have permission to ban users.`);
    }
    if (!targetUser) {
        throw new Error(`User ${targetUsername} does not exist.`);
    }
    if (targetUser.getRole() === 'admin') {
        throw new Error(`Cannot ban another admin user.`);
    }

    await userDb.banUser(targetUser.getUsername());
};


export default {
    authenticate,
    register,
    banUser
};