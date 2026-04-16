import React from 'react';
import { useRef } from "react";

import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import MyCoursesSection from '@/components/dashboard/MyCoursesSection';
import AllCoursesSection from '@/components/dashboard/AllCoursesSection';
import AnalyticsPreview from '@/components/dashboard/AnalyticsPreview';
import CalendarSection from '@/components/dashboard/CalendarSection';



import useScrollIndicator from "@/hooks/useScrollIndicator";
import { useDashboardCourses } from './hooks/useDashoardCourses';

function TraineeDashboard() {
    const { enrolledCourses, topCourses, loading, error } = useDashboardCourses(3);

    const leftRef = useRef(null);
    const rightRef = useRef(null);

    useScrollIndicator(leftRef);
    useScrollIndicator(rightRef);

    return (


        <div className="grid grid-cols-1 lg:grid-cols-14 h-full">

            <section ref={leftRef} className="lg:col-span-10 min-w-0 flex flex-col gap-6 py-6 lg:py-8 px-4 lg:pl-6 lg:overflow-y-auto custom-scroll" >
                <WelcomeBanner />
                <MyCoursesSection enrolledCourses={enrolledCourses} loading={loading} />
                <AllCoursesSection courses={topCourses} loading={loading} />
            </section>


            <aside ref={rightRef} className="lg:col-span-4 min-w-0 px-4 pb-6 lg:pb-0 lg:px-0 lg:overflow-y-auto custom-scroll">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:py-8 lg:pr-4">
                    <AnalyticsPreview />
                    <CalendarSection />
                </div>
            </aside>

        </div>

    );
}

export default TraineeDashboard;