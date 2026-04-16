import { ROLE_PERMISSION } from '@/config/permission.js'
import { useAuth } from "@/context/AuthContext";

export function usePermission() {

    const { role, viewRole } = useAuth();

    const can = (permission) => {

        const activeRole =
            role === "trainer" && viewRole
                ? viewRole
                : role;

        

        console.log(activeRole)
        
        if (!activeRole) return false;

        return ROLE_PERMISSION[activeRole]?.includes(permission);
    };

    return { can }

}