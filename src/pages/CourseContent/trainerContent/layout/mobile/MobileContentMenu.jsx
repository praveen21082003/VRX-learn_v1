// MobileContentMenu.jsx — shows when /content is hit on mobile
import { useNavigate, useParams } from 'react-router-dom';
import { useCourse, useModuleContext, useAssignmentContext } from '../CourseManagementLayout';
import { Icon, BackButton } from '@/components/ui';
import { COURSE_EDIT_SECTIONS } from '@/config/courseContentOption';

function MobileContentMenu() {
    const { courseId } = useParams();
    const { course } = useCourse();
    const navigate = useNavigate();
    const sections = COURSE_EDIT_SECTIONS(courseId);

    return (
        <>
            <div className="border-b border-default p-2 px-4">
                <BackButton to={`/course/${courseId}/overview`} label="Back" />
            </div>

            <div className="flex flex-col h-full py-4 px-6">

                <div>
                    <h4 className="text-h4">{course?.title}</h4>

                    <div className='mt-2'>
                        <p className="text-sm font-medium text-muted-foreground">
                            Instructor:{" "}
                            <span className="text-foreground">
                                {course?.trainerName}
                            </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-1 text-body text-muted">
                            <span>Course</span>
                            <Icon name="ph:dot-bold" />
                            <span>Duration TBD"</span>
                            <Icon name="ph:dot-bold" />
                            <span>Not Started</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mt-6">
                    {sections.map((section) => (
                        <button
                            key={section.key}
                            onClick={() => navigate(section.path)}
                            className="flex items-center justify-between px-2 py-3 rounded hover:bg-primary/16 text-left"
                        >
                            <span className="text-h45">{section.label}</span>
                            <span className="text-xl font-bold">{">"}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default MobileContentMenu;