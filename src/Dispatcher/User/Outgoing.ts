import { serverProxy } from '@/Stores/ServerProxy';
import { userStore, initUserStore } from '@/Stores/UserStore';

export const login = async (email: string, password: string) => {
    const data = {
        email,
        password,
    };
    try {
        const res = await serverProxy.put("/users", data);
        initUserStore(res.data.userID, res.data.token, "Arik");
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userID", res.data.userID);
        return true;
    }
    catch {
        return false;
    }
}

export const logout = async () => {
    userStore.logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userID");
}