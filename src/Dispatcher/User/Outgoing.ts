import { serverProxy } from '@/Stores/ServerProxy';
import { userStore } from '@/Stores/UserStore';

export const login = async (email: string, password: string, callback: (success: boolean) => void) => {
    const data = {
        email,
        password,
    };
    await serverProxy.requestNoAuth({
        method: "PUT",
        route: "/users",
        data,
    }, (res: any) => {
        userStore.loginUser(res.data.userID, res.data.token, "Arik");
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userID", res.data.userID);
        callback(true);
    });
}

export const logout = async () => {
    userStore.logoutUser();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userID");
}

export const signup = async (email: string, password: string, username: string, callback: () => void) => {
    serverProxy.requestNoAuth({
        method: "POST",
        route: "/users",
        data: {
            email,
            password,
            username,
        },
    }, callback);
    // userStore.logout();
    // localStorage.removeItem("authToken");
    // localStorage.removeItem("userID");
}