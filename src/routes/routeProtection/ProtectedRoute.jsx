import { AppLoading } from '@/components/ui/loading'
import { useAuth } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";
import { ROLE_PERMISSION } from '@/config/permission';


export default function ProtectedRoute() {
    const { user, role, loading } = useAuth();

    if (loading) return <AppLoading />;

    // not logged in
    if (!user) return <Navigate to="/login" replace />;

    // role not recognized
    if (role && !Object.keys(ROLE_PERMISSION).includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}

