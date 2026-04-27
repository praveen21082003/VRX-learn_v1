
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import MobileContentMenu from './MobileContentMenu';

function MobileOrDesktopIndex() {
    const { courseId } = useParams();
    const isMobile = window.innerWidth < 1024; // lg breakpoint

    if (isMobile) {
        return <MobileContentMenu />;
    }
    return <Navigate to={`/course/${courseId}/content/info`} replace />;
}

export default MobileOrDesktopIndex;