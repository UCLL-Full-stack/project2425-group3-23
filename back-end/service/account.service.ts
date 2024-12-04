import bcrypt from "bcrypt";
import userDb from "../repository/user.db";
import {AuthenticationResponse} from "../types";
import generateJwtToken from "../util/jwt";
import {User} from "../model/user";

const authenticate = async ({ username, password } : { username : string, password: string } ) : Promise<AuthenticationResponse> => {
    const user : User | undefined = await userDb.getUserByUsername({username});
    if (!user) {
        throw new Error(`Incorrect credentials.`);
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
        token: generateJwtToken(username, role),
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
        chats: [],
        friends: [],
        friendRequests: []
    });
    await userDb.addUser({user});
}

export default {
    authenticate,
    register
};