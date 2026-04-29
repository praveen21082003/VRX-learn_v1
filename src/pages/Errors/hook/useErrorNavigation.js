// useErrorNavigation.js
import { useNavigate } from 'react-router-dom';

export const useErrorNavigation = () => {
    const navigate = useNavigate();

    return (status) => {
        if (status === 404) navigate('/404');
        else if (status === 403) navigate('/unauthorized');
        else if (status === 503) navigate('/maintenance');
        else if (status >= 500) navigate('/server-error');
    };
};


// can use specific places
// 1. useCourseContent — course not found or no access
// 2. useCourseOverview — same
// 3. useTraineeRosterData — 403 if not trainer
// 4. useAssignmentList — 403/404
// 5. useLessons — 404