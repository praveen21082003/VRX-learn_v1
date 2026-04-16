import React, { useState, useEffect } from 'react'
import { useCourseContent } from '../../hooks/useCourseContent';
import { Outlet, useParams } from 'react-router-dom';
import { BackButton } from "@/components/ui";
import ContentLessonSidebar from './ContentLessonSidebar';

function LessonLayout() {

  const [openPlaylist, setOpenPlaylist] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);
  // console.log("Active Lesson in Layout (initial):", activeLesson);



  const { courseId } = useParams();



  const {
    course,
    modules,
    allLessons,
    loading,
    error,
  } = useCourseContent(courseId);


  useEffect(() => {
    if (modules?.length > 0 && !activeLesson) {
      const firstModule = modules[0];
      if (firstModule.lessons?.length > 0) {
        setActiveLesson({
          moduleIndex: 0,
          lessonIndex: 0,
          lessonId: firstModule.lessons[0].id,
        });
      }
    }
  }, [modules, activeLesson]);

  // console.log("Active Lesson in Layout:", activeLesson);


  if (loading) {
    return <div>Loading Course Content...</div>;
  }

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <aside className="w-full max-w-96 border-r-2 border-default bg-surface overflow-y-auto hidden lg:block">
        <div className="p-4 border-b-2 border-default ">
          <BackButton
            to={`/course/${courseId}/overview`}
            iconName="material-symbols:arrow-back-rounded"
            label="Back to Overview"
          />
        </div>
        <ContentLessonSidebar
          modules={modules}
          openPlaylist={openPlaylist}
          setOpenPlaylist={setOpenPlaylist}
          activeLesson={activeLesson}
          setActiveLesson={setActiveLesson}
        />
      </aside>

      <main className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-6xl mx-auto p-4 lg:p-6">
          <Outlet
            context={{
              course,
              modules,
              allLessons,
              activeLesson,
              setActiveLesson,
            }}
          />
        </div>
      </main>
    </div>
  )
}

export default LessonLayout
