import { AppLoading } from '@/components/ui/loading';
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicOnlyRoute() {
    const { user, loading } = useAuth();

    if (loading) return <AppLoading />;

    // already logged in → kick out of login/forgot/reset
    if (user) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}