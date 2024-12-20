import {FriendRequest} from "../../model/friendRequest";
import {User} from "../../model/user";

const validId = 1;
const validStatus = "accepted";
const validSender = new User({
    username: "JohnDoe",
    role: "user",
    password: "Password01"
});
const validReceiver = new User({
    username: "JaneDoe",
    role: "user",
    password: "Password01"
});

test("given: a valid friend request, when: friend request is created, then: friend request is created with those values", () => {
    // given
    // Do nothing

    // when
    const friendRequest : FriendRequest = new FriendRequest({
        id: validId,
        status: validStatus,
        sender: validSender,
        receiver: validReceiver
    })

    // then
    expect(friendRequest.getId()).toEqual(validId);
    expect(friendRequest.getStatus()).toEqual(validStatus);
    expect(friendRequest.getSender()).toEqual(validSender);
    expect(friendRequest.getReceiver()).toEqual(validReceiver);
});

test("given: a friend request without sender, when: friend request is created, then: friend request is created throws an error", () => {
    // given
    // Do nothing

    // when
    const createFriendRequest = () => {
        new FriendRequest({
            id: validId,
            status: validStatus,
            sender: undefined,
            receiver: validReceiver
        })
    }

    // then
    expect(createFriendRequest).toThrowError();
});

test("given: a friend request without receiver, when: friend request is created, then: friend request is created throws an error", () => {
    // given
    // Do nothing

    // when
    const createFriendRequest = () => {
        new FriendRequest({
            id: validId,
            status: validStatus,
            sender: validSender,
            receiver: undefined
        })
    }

    // then
    expect(createFriendRequest).toThrowError();
});

test("given: a friend request without status, when: friend request is created, then: friend request is created with default status", () => {
    // given
    // Do nothing

    // when
    const friendRequest : FriendRequest = new FriendRequest({
        id: validId,
        sender: validSender,
        receiver: validReceiver
    })

    // then
    expect(friendRequest.getStatus()).toEqual("pending");
});

test("given: a friend request without id, when: friend request is created, then: friend request is created without an id", () => {
    // given
    // Do nothing

    // when
    const friendRequest : FriendRequest = new FriendRequest({
        status: validStatus,
        sender: validSender,
        receiver: validReceiver
    })

    // then
    expect(friendRequest.getId()).toBeUndefined();
});