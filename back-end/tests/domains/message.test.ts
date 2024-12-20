import {Message} from '../../model/message';
import {User} from "../../model/user";
import {Chat} from "../../model/chat";

const validId = 1;
const validContent = "Hello, world!";
const validUser : User = new User({
    username: "JohnDoe",
    role: "user",
    password: "Password01"
});
const validChat : Chat = new Chat({
    id: 1,
    type: "public",
    users: [validUser],
    messages: []
});

test("given: a valid message, when: message is created, then: message is created with those values", () => {
    // given
    // Do nothing

    // when
    const message : Message = new Message({
        id: validId,
        content: validContent,
        deleted: false,
        sender: validUser,
        chat: validChat
    })

    // then
    expect(message.getId()).toEqual(validId);
    expect(message.getContent()).toEqual(validContent);
    expect(message.getDeleted()).toEqual(false);
    expect(message.getSender()).toEqual(validUser);
    expect(message.getChat()).toEqual(validChat);
});

test("given: a message without content, when: message is created, then: message is created throws an error", () => {
    // given
    // Do nothing

    // when
    const createMessage = () => {
        new Message({
            id: validId,
            content: "",
            sender: validUser,
            chat: validChat
        })
    }

    // then
    expect(createMessage).toThrowError();
});

test("given: a message without sender, when: message is created, then: message is created throws an error", () => {
    // given
    // Do nothing

    // when
    const createMessage = () => {
        new Message({
            id: validId,
            content: validContent,
            sender: undefined,
            chat: validChat
        })
    }

    // then
    expect(createMessage).toThrowError();
});

test("given: a message without chat, when: message is created, then: message is created throws an error", () => {
    // given
    // Do nothing

    // when
    const createMessage = () => {
        new Message({
            id: validId,
            content: validContent,
            sender: validUser,
            chat: undefined
        })
    }

    // then
    expect(createMessage).toThrowError();
});

test("given: a message without id, when: message is created, then: message is created with id as undefined", () => {
    // given
    // Do nothing

    // when
    const message : Message = new Message({
        id: undefined,
        content: validContent,
        sender: validUser,
        chat: validChat
    })

    // then
    expect(message.getId()).toBeUndefined();
    expect(message.getContent()).toEqual(validContent);
    expect(message.getDeleted()).toEqual(false);
    expect(message.getSender()).toEqual(validUser);
    expect(message.getChat()).toEqual(validChat);
});

test("given: a message without deleted, when: message is created, then: message is created with deleted as false", () => {
    // given
    // Do nothing

    // when
    const message : Message = new Message({
        id: validId,
        content: validContent,
        sender: validUser,
        chat: validChat
    })

    // then
    expect(message.getId()).toEqual(validId);
    expect(message.getContent()).toEqual(validContent);
    expect(message.getDeleted()).toEqual(false);
    expect(message.getSender()).toEqual(validUser);
    expect(message.getChat()).toEqual(validChat);
});