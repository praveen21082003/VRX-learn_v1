
import { useAuth } from "../context/AuthContext";
// dashboard pages
import TraineeDashboard from '../pages/Dashboards/TraineeDashboard';
import AdminDashboard from '../pages/Dashboards/AdminDashboard';
import TrainerDashboard from '../pages/Dashboards/TrainerDashboard';

export const DashboardSwitcher = () => {
    const { role, viewRole } = useAuth();
    console.log(role);
    console.log(viewRole)
    const effectiveRole = viewRole || role;

    console.log(effectiveRole)

    const dashboards = {
        admin: <AdminDashboard />,
        trainer: <TrainerDashboard />,
        // subadmin: <SubAdminDashboard />,
        trainee: <TraineeDashboard />,
    };

    return dashboards[effectiveRole];

};