import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'


function AdminTopCourses({ loading, courses, error, isRefresh, setIsRefresh, refreshTopCourses }) {

    const navigate = useNavigate();

    // View (navigate to course OverView)
    const handleOpenOverview = (courseId) => {
        navigate(`/course/${courseId}/overview`)
    }


    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center border-b border-default pb-3 animate-pulse"
                    >
                        <div className="flex gap-3 items-center">
                            <div className="w-6 h-4 bg-gray-600 rounded" />

                            <div className="space-y-2">
                                <div className="w-32 h-4 bg-gray-600 rounded" />
                                <div className="w-20 h-3 bg-gray-500 rounded" />
                            </div>
                        </div>

                        <div className="text-right space-y-2">
                            <div className="w-10 h-4 bg-gray-600 rounded ml-auto" />
                            <div className="w-16 h-3 bg-gray-500 rounded ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return <div className="px-4 py-3 text-caption text-red-600">{error}</div>
    }


    return (
        <div className="p-4 border-2 border-default rounded">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className='flex'>
                        <h4 className="text-h4">Top Courses</h4>
                        {courses.length < 5 && isRefresh && <Button frontIconName="material-symbols:refresh" frontIconHeight="26" frontIconWidth="26" bgClass="" textClass="" onClick={() => { refreshTopCourses(); setIsRefresh(false) }} />}
                    </span>
                    <span className="text-caption text-muted">By Enrollment</span>

                </div>


                <button className="text-muted text-body hover:underline cursor-pointer"
                    onClick={() => navigate('/courses')}
                >
                    View All →
                </button>
            </div>
            <div className="space-y-3">

                {courses?.map((course, index) => (
                    <div
                        key={course.id}
                        className="flex justify-between items-center border-b border-default pb-3 last:border-none"
                    >

                        <div className="flex gap-3 items-center">
                            <span className="text-caption text-muted w-6">
                                #{index + 1}
                            </span>

                            <div>
                                <div className="
                                    cursor-pointer
                                    transition-all
                                    duration-200
                                    hover:text-primary
                                    hover:underline
                                    hover:underline-offset-4
                                    hover:decoration-1
                                    text-body
                                    "
                                    onClick={() => handleOpenOverview(course.id)}
                                >
                                    {course.courseName}
                                </div>

                                <p className="text-caption text-muted">
                                    {course.trainerName}
                                </p>
                            </div>
                        </div>


                        <div className="text-right">
                            <p className="text-primary dark:text-white font-semibold">
                                {course.totalTrainees}
                            </p>
                            <p className="text-caption text-muted">
                                Trainees
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminTopCourses
