import React from "react";
import { act, render, screen } from '@testing-library/react';
import ChatFriendsWindow from "@components/chatFriendsWindow";

const validUser = {
    username: "JohnDoe",
    password: "Password01",
    friends: [{
        username: "JaneDoe",
        password: "Password01"
    }]
};

// Mocking react-i18next for translations
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key })
}));

// Mocking userService for fetching user data
jest.mock('@services/userService', () => ({
    getUser: async (username: string, token: string) => {
        return validUser;
    }
}));

// Mocking next router for navigation
jest.mock('next/router', () => ({
    useRouter: () => ({
        query: { username: validUser.username }
    })
}));

window.React = React;

test('Chat friends window renders', async () => {
    await act(async () => {
        render(<ChatFriendsWindow user={validUser} updateUser={() => {}} />);
    });

    // Debug to see the rendered output
    screen.debug();

    // Check if the friend is rendered
    expect(screen.getByText(validUser.friends[0].username));
});
