import { createContext, useContext, useEffect, useState } from "react";
import { authMe, logout } from "../services/Authenticate.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewRole, setViewRole] = useState(null);

    useEffect(() => {
        refreshUser();
    }, []);

    const refreshUser = async () => {
        try {

            const data = await authMe();
            const role = data?.role?.toLowerCase();
            setUser(data);
            setViewRole(role);
            return data;
        } catch {
            setUser(null);
            setViewRole(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // handleLogout accepts onClose as a param so LogOut component can pass it in
    const handleLogout = async (onClose) => {
        setLoading(true);
        try {
            await logout();
        } catch (err) {
            console.error("Backend logout failed, clearing local state anyway:", err);
        } finally {
            setUser(null);
            setViewRole(null);
            setLoading(false);
            onClose?.();
        }
    };

    const value = {
        user,
        setUser,
        refreshUser,
        isAuthenticated: !!user,
        role: user?.role?.toLowerCase() || null,
        viewRole,
        setViewRole,
        loading,
        handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};