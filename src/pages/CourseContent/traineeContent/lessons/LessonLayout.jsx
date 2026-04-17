import React, { useState, useEffect } from 'react'
import { useCourseContent } from '../../hooks/useCourseContent';
import { Outlet, useParams } from 'react-router-dom';
import { BackButton, Icon } from "@/components/ui";
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

  const currentIndex = allLessons.findIndex(
    (lesson) => lesson.id === activeLesson?.lessonId
  );

  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
        <Icon name="line-md:loading-twotone-loop" height="30" width="30" />

        <div className="space-y-1 text-center">
          <h3 className="text-h45 font-semibold text-main">Getting things ready...</h3>
          <p className="text-caption text-muted">
            We're preparing your course content for you.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <aside className="w-full max-w-96 border-r-2 border-default bg-surface overflow-y-auto hidden lg:block">
        <div className="p-2 border-b-2 border-default">
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

      <main className="flex-1 overflow-y-auto bg-background relative">
        <div className="lg:hidden p-2 border-b-2 border-default">
          <BackButton
            to={`/course/${courseId}/overview`}
            iconName="material-symbols:arrow-back-rounded"
            label="Back to Overview"
          />
        </div>
        <Outlet
          context={{
            course,
            modules,
            allLessons,
            activeLesson,
            setActiveLesson,
          }}
        />

        <div className="lg:hidden">
          <ContentLessonSidebar
            modules={modules}
            activeLesson={activeLesson}
            setActiveLesson={setActiveLesson}
            allLessons={allLessons}
            nextLesson={nextLesson}
            mobilePlaylistOnly
          />
        </div>
      </main>
    </div>
  )
}

export default LessonLayout
