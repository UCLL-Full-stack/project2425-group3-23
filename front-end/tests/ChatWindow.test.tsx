import React from "react";
import {act, render, screen} from '@testing-library/react';
import ChatWindow from "@components/chatWindow";

window.React = React;

const validContent = "Hello, World!";
const validMessage = {
  id: 1,
  content: validContent,
  deleted: false,
  sender: {
    username: "JohnDoe",
    password: "Password01"
  }
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

test('Chat window renders', async () => {
  await act(async () => {
    render(<ChatWindow messages={[validMessage]} updateMessages={() => {}} user={null} updateUser={() => {}} />);
  });

  // Debug to see what the rendered output is
  screen.debug();

  // Check if the message is rendered
  expect(screen.getByText(validContent));
});