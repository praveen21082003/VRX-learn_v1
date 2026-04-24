import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/User.service"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewRole, setViewRole] = useState(null); // ✅ always start null

    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await getMe();
                setUser(data);

                const role = data?.role?.toLowerCase();
                setViewRole(role === "trainer" ? "trainer" : null);
            } catch (err) {
                setUser(null);
                setViewRole(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    // ✅ REMOVED - no localStorage persistence for viewRole

    const logout = () => {
        setUser(null);
        setViewRole(null);
        window.location.href = "/login";
    };

    const value = {
        user,
        setUser,
        isAuthenticated: !!user,
        role: user?.role?.toLowerCase() || null,
        viewRole,
        setViewRole,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div style={{ padding: "20px" }}>Loading App...</div> : children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};