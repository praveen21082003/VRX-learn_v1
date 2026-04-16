import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useWelcomeData } from '../../pages/Dashboards/hooks/useWelcomeData'
import LearningIllustration from "@/assets/images/Learning-Illustration.png";

function WelcomeBanner() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { course, loading, error } = useWelcomeData();


    if (loading) return (
        <div className="w-full bg-brand rounded-xl p-6 md:p-8 animate-pulse">
            <div className="flex flex-col md:flex-row md:justify-between h-full gap-6">


                <div className="flex flex-col justify-center gap-4 w-md">
                    <div className="h-6 w-40 bg-white/20 rounded"></div>
                    <div className="h-8 w-64 bg-white/20 rounded"></div>
                    <div className="h-9 w-52 bg-white/20 rounded"></div>
                    <div className="h-10 w-40 bg-white/20 rounded mt-2"></div>
                </div>


                <div className="hidden sm:flex md:flex-1 items-center justify-center md:justify-end">
                    <div className="w-80 h-52 bg-white/10 rounded-lg"></div>
                </div>

            </div>
        </div>
    );


    if (error) return null;


    const hasActiveCourse = course && course.courseId;

    return (
        <div className="w-full bg-brand rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between h-full gap-6">


                <div className="flex flex-col justify-center gap-4 text-white md:max-w-md">
                    <h2 className="text-h3 font-medium">
                        Hello, {user?.username || 'Learner'}!
                    </h2>

                    {hasActiveCourse ? (
                        <>
                            <h3 className="text-typo leading-10">
                                Continue Learning: <br />
                                <span className="text-h3 text-white/90">{course.courseName}</span>
                            </h3>
                            <Button
                                buttonName="Resume"
                                className="lg:max-w-50 p-3 rounded-lg font-semibold text-sm"
                                bgClass="bg-white"
                                textClass="text-primary"
                                onClick={() => navigate(`/course/${course.courseId}/overview`)}
                            />
                        </>
                    ) : (
                        <>
                            <h3 className="text-h1 font-bold">
                                Your Learning Path Starts Here
                            </h3>
                            <Button
                                buttonName="Browse Courses"
                                backIconName="maki:arrow"
                                className="lg:max-w-50 p-3 rounded-lg font-semibold text-sm"
                                bgClass="bg-white"
                                textClass="text-primary"
                                onClick={() => navigate("/courses")}
                            />
                        </>
                    )}
                </div>

                <div className="hidden sm:flex md:flex-1 items-center justify-center md:justify-end">
                    <img
                        src={LearningIllustration}
                        alt="Learning illustration"
                        className="max-h-60 object-contain"
                    />
                </div>

            </div>
        </div>
    );
}

export default WelcomeBanner;