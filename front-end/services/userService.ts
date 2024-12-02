import { User } from "@/types";

const loginUser = (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
};

const getUserProfile = () => {
    const token = localStorage.getItem("token");
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const UserService = {
    loginUser,
    getUserProfile,
};

export default UserService;