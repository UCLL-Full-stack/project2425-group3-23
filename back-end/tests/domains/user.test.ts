import {User} from "../../model/user";

const validUsername = "JohnDoe";
const validRole = "user";
const validPassword = "Password01";
const validIsBanned = false;

test("given: a valid user, when: user is created, then: user is created with those values", () => {
    // given
    // Do nothing

    // when
    const user : User = new User({
        username: validUsername,
        role: validRole,
        password: validPassword,
        isBanned: validIsBanned
    })

    // then
    expect(user.getUsername()).toEqual(validUsername);
    expect(user.getRole()).toEqual(validRole);
    expect(user.getPassword()).toEqual(validPassword);
    expect(user.isUserBanned()).toEqual(validIsBanned);
    expect(user.getMessages()).toEqual([]);
    expect(user.getFriends()).toEqual([]);
    expect(user.getFriendRequests()).toEqual([]);
});

test("given: an user without username, when: user is created, then: throw error", () => {
    // given
    const invalidUsername = "";

    // when
    const createUser = () => new User({
        username: invalidUsername,
        role: validRole,
        password: validPassword
    });

    // then
    expect(createUser).toThrow();
});

test("given: an user without role, when: user is created, then: throw error", () => {
    // given
    const invalidRole = "";

    // when
    const createUser = () => new User({
        username: validUsername,
        role: invalidRole,
        password: validPassword
    });

    // then
    expect(createUser).toThrow();
});

test("given: an user without password, when: user is created, then: throw error", () => {
    // given
    const invalidPassword = "";

    // when
    const createUser = () => new User({
        username: validUsername,
        role: validRole,
        password: invalidPassword
    });

    // then
    expect(createUser).toThrow();
});

test("given: an user with an username longer than 20 characters, when: user is created, then: throw error", () => {
    // given
    let invalidUsername = "";
    for (let i = 0; i < 21; i++) {
        invalidUsername += "a";
    }

    // when
    const createUser = () => new User({
        username: invalidUsername,
        role: validRole,
        password: validPassword
    });

    // then
    expect(createUser).toThrow();
});

test("given: an user with a password longer than 100 characters, when: user is created, then: throw error", () => {
    // given
    let invalidPassword = "";
    for (let i = 0; i < 101; i++) {
        invalidPassword += "a";
    }

    // when
    const createUser = () => new User({
        username: validUsername,
        role: validRole,
        password: invalidPassword
    });

    // then
    expect(createUser).toThrow();
});

test("given: an user with a password shorter than 8 characters, when: user is created, then: throw error", () => {
    // given
    const invalidPassword = "short";

    // when
    const createUser = () => new User({
        username: validUsername,
        role: validRole,
        password: invalidPassword
    });

    // then
    expect(createUser).toThrow();
});

test("given: an user with a password without a lowercase letter, when: user is created, then: throw error", () => {
    // given
    const invalidPassword = "PASSWORD01";

    // when
    const createUser = () => new User({
        username: validUsername,
        role: validRole,
        password: invalidPassword
    });

    // then
    expect(createUser).toThrow();
});

test("given: an user with a password without an uppercase letter, when: user is created, then: throw error", () => {
    // given
    const invalidPassword = "password01";

    // when
    const createUser = () => new User({
        username: validUsername,
        role: validRole,
        password: invalidPassword
    });

    // then
    expect(createUser).toThrow();
});

test("given: an user with a password without a number, when: user is created, then: throw error", () => {
    // given
    const invalidPassword = "Password";

    // when
    const createUser = () => new User({
        username: validUsername,
        role: validRole,
        password: invalidPassword
    });

    // then
    expect(createUser).toThrow();
});

test("given: an user without isBanned, when: user is created, then: user is created with isBanned as false", () => {
    // given
    // Do nothing

    // when
    const user : User = new User({
        username: validUsername,
        role: validRole,
        password: validPassword
    });

    // then
    expect(user.isUserBanned()).toEqual(false);
});
