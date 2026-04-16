import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/User.service"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewRole, setViewRole] = useState(() => {
        const saved = localStorage.getItem("viewRole");
        return (saved && saved !== "null") ? saved : null;
    });

    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await getMe();
                setUser(data);

                const role = data?.role?.toLowerCase();
                // If trainer, default the view to trainer
                if (role === "trainer" && !viewRole) {
                    setViewRole("trainer");
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    // Update localStorage when viewRole changes [cite: 112, 113]
    useEffect(() => {
        if (viewRole) {
            localStorage.setItem("viewRole", viewRole);
        } else {
            localStorage.removeItem("viewRole");
        }
    }, [viewRole]);

    const logout = () => {
        setUser(null);
        setViewRole(null);
        localStorage.clear();
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
            {/* If loading, show text until you make your UI component */}
            {loading ? <div style={{ padding: "20px" }}>Loading App...</div> : children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};