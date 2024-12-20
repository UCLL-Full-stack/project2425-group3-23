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

const banUser = async (username: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("User is not logged in.");
    }

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/ban", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to ban user.");
    }

    return response.status;
};


const registerUser = async (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

const UserService = {
    loginUser,
    getUserProfile,
    registerUser,
    banUser,
};

export default UserService;