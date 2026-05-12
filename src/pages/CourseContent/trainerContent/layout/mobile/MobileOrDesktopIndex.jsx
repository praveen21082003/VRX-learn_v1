
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { usePermission } from "@/hooks/usePermission";

import MobileContentMenu from './MobileContentMenu';

function MobileOrDesktopIndex() {
    const { courseId } = useParams();
    const isMobile = window.innerWidth < 1024; // lg breakpoint

    const { can } = usePermission();

    if (isMobile) {
        return <MobileContentMenu can={can} />;
    }

    const defaultPath = can("VIEW_COURSE_INFO")
        ? "info"
        : "modules";


    return <Navigate to={`/course/${courseId}/content/${defaultPath}`} replace />;
}

export default MobileOrDesktopIndex;