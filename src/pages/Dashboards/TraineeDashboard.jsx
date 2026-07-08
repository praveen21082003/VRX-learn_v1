import React, { useRef, useEffect } from "react";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import MyCoursesSection from "@/components/dashboard/MyCoursesSection";
import AllCoursesSection from "@/components/dashboard/AllCoursesSection";
import AnalyticsPreview from "@/components/dashboard/AnalyticsPreview";
import CalendarSection from "@/components/dashboard/CalendarSection";

import useScrollIndicator from "@/hooks/useScrollIndicator";
import { useDashboardCourses } from "./hooks/useDashoardCourses";
import { useBreadcrumbs } from "@/context/BreadcrumbContext";
import CertificateView from "@/components/dashboard/CertificateView";
import ModuleRequests from "@/components/dashboard/ModuleRequests";
import DailyInsights from "@/components/dashboard/DailyInsights";

function TraineeDashboard() {
  const { enrolledCourses, topCourses, loading, error } =
    useDashboardCourses(3);
  const { resetBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    resetBreadcrumbs();
  }, [resetBreadcrumbs]);

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useScrollIndicator(leftRef);
  useScrollIndicator(rightRef);

  return (
    // <div className="grid grid-cols-1 lg:grid-cols-14 h-full">

    //     <section ref={leftRef} className="lg:col-span-10 min-w-0 flex flex-col gap-6 py-6 lg:py-8 px-4 lg:pl-6 lg:overflow-y-auto custom-scroll" >
    //         <WelcomeBanner />
    //         <MyCoursesSection enrolledCourses={enrolledCourses} loading={loading} />
    //         <AllCoursesSection courses={topCourses} loading={loading} />
    //     </section>

    //     <aside ref={rightRef} className="lg:col-span-4 min-w-0 px-4 pb-6 lg:pb-0 lg:px-0 lg:overflow-y-auto custom-scroll">
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:py-1 lg:pr-4">
    //             {/* <AnalyticsPreview /> */}
    //             {/* <CalendarSection /> */}
    //             <Certiicate/>
    //         </div>
    //     </aside>

    // </div>
    // <div className="grid grid-cols-1 lg:grid-cols-14 py-4 px-6 ">
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1px_430px] px-6 py-4 h-full">
      <section ref={leftRef} className="min-w-0 pr-6">
        <WelcomeBanner />
        <MyCoursesSection enrolledCourses={enrolledCourses} loading={loading} />
        <AllCoursesSection courses={topCourses} loading={loading} />
      </section>

      <div className="hidden lg:block">
        <div className="w-0.5 bg-[#d9d9d9] h-full"></div>
      </div>

      <aside
        ref={rightRef}
        className="hidden lg:block min-w-0 pl-6 overflow-y-auto custom-scroll"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:py-1 lg:pr-4 ">
          <CertificateView />
          <ModuleRequests />
          <DailyInsights />
        </div>
      </aside>
    </div>
  );
}

export default TraineeDashboard;
