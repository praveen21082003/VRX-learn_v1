import React from 'react'
import CourseCard from './CourseCard';
import { Icon } from "@/components/ui"
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import CourseCardLoading from '../loading/CourseCardLoading';

function Viewer({
    loading,
    title,
    courses = [],
    maxCourses,
    getButtonName,
    vertical = false,
    gridSize = 3,
    emptyTitle = "No data found",
    emptyDescription = "There are no items to display at this moment.",
    emptyIcon = "uil:book-open"
}) {
    const navigate = useNavigate();
    const isEmpty = !loading && (!courses || courses.length === 0);

    const getButtonStyle = (course) => {
        if (course.progress !== undefined && getButtonName) {
            return {
                name: course.progress > 0 ? "Resume" : "Start Learning",
                bg: course.progress > 0 ? "bg-primary" : "bg-transparent border",
                text: course.progress > 0 ? "text-white" : "text-main",
                route: `/course/${course.courseId}`
            };
        }
        return {
            name: "View Details",
            bg: "bg-transparent border",
            text: "text-main",
            route: `/course/${course.courseId}`
        };
    };

    const visibleCourses = maxCourses ? courses.slice(0, maxCourses) : courses;

    return (
        <section className="relative bg-primary-16 noise-overlay p-4 rounded-xl z-10">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-h4 text-main font-medium">{title}</h2>
                {maxCourses && courses?.length > maxCourses && (
                    <button
                        className="text-sm text-brand font-semibold underline cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => navigate('/courses')}
                    >
                        View all
                    </button>
                )}
            </header>

            {isEmpty ? (
                <div className='flex justify-center my-16 w-full'>
                    <div className='flex flex-col gap-4 justify-center items-center max-w-sm text-center'>
                        <div className="flex justify-center items-center bg-table-Header-bg text-main h-20 w-20 rounded-xl">
                            <Icon name={emptyIcon} height="32" width="32" className="text-primary-main" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h4 className='text-h4 font-bold text-main'>{emptyTitle}</h4>
                            <p className='text-body text-muted'>{emptyDescription}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className={clsx(
                        "gap-4 w-full",

                        !vertical && "flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide",


                        "md:grid md:overflow-visible md:pb-0",


                        gridSize === 1 && "md:grid-cols-1",
                        gridSize === 2 && "md:grid-cols-2",
                        gridSize === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                        gridSize === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
                  
                        vertical && "flex flex-col md:grid-cols-1"
                    )}
                >
                    {loading ? (
                        [...Array(maxCourses || gridSize)].map((_, i) => <CourseCardLoading key={i} />)
                    ) : (
                        visibleCourses.map(course => {
                            const btn = getButtonStyle(course);
                            return (
                                <div key={course.courseId} className="min-w-[280px] md:min-w-full snap-start">
                                    <CourseCard
                                        name={course.courseName}
                                        author={course.trainerName}
                                        image={course.thumbnail}
                                        buttonName={btn.name}
                                        bgClass={btn.bg}
                                        textClass={btn.text}
                                        onClick={() => navigate(btn.route)}
                                        vertical={vertical}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </section>
    );
}

export default Viewer;