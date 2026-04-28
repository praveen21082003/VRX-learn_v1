import { AppLoading } from '@/components/ui/loading'
import { useAuth } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";
import { ROLE_PERMISSION } from '@/config/permission';

export default function ProtectedRoute() {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <AppLoading />;
    }

    if (!user) {
        return <Navigate to='/' replace />
    }

    if (ROLE_PERMISSION && !Object.keys(ROLE_PERMISSION).includes("admin")) {
        return <Navigate to="/unauthorized" replace />
    }


    return <Outlet />;


}