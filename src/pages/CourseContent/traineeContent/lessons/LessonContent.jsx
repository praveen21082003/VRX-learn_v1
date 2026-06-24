import React, { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import LessonViewer from '@/components/lessonViewer/LessonViewer';
import { useBreadcrumbs } from "@/context/BreadcrumbContext";
import CourseContentEmptyState from "@/components/ui/emptyStates/CourseContentEmptyState";
import { moduleRestrict } from '@/assets';

function LessonContent() {
  const {
    modules,
    allLessons,
    activeLesson,
    setActiveLesson,
  } = useOutletContext();

  const navigate = useNavigate();
  const { courseId } = useParams();
  const { setSectionBreadcrumb } = useBreadcrumbs();

  const allModulesRestricted =
  modules?.length > 0 &&
  modules.every((module) => module.restricted);

  const lesson = allLessons.find(
    (item) => item.id === activeLesson?.lessonId
  );

  const currentModule =
  activeLesson?.moduleIndex !== undefined
    ? modules[activeLesson.moduleIndex]
    : null;

const isRestricted = currentModule?.restricted;

  const currentIndex = allLessons.findIndex(
    (lesson) => lesson.id === activeLesson?.lessonId
  );

  const prevLesson =
    currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const onNavigate = (direction) => {
    let targetLesson = null;

    if (direction === "prev" && prevLesson) {
      targetLesson = prevLesson;
    }

    if (direction === "next" && nextLesson) {
      targetLesson = nextLesson;
    }

    if (!targetLesson) return;

    const moduleIndex = modules.findIndex((module) =>
      module.lessons?.some(
        (lesson) => lesson.id === targetLesson.id
      )
    );

    const lessonIndex =
      modules[moduleIndex]?.lessons?.findIndex(
        (lesson) => lesson.id === targetLesson.id
      ) ?? -1;

    setActiveLesson({
      moduleIndex,
      lessonIndex,
      lessonId: targetLesson.id,
    });
  };

  // Set the section breadcrumb to "Lessons" when this layout is active
  useEffect(() => {
    setSectionBreadcrumb(lesson?.title);
    return () => setSectionBreadcrumb("");
  }, [lesson?.title, setSectionBreadcrumb]);

  if (isRestricted || allModulesRestricted) {
  return (
 <div className="flex justify-center h-full">
        <CourseContentEmptyState
          image={moduleRestrict}
          title="Module Access Restricted"
          description="Your current enrollment tier does not include access to this specific module’s Lesson. Request access to proceed."
          // buttonText="Request Access"
          // onButtonClick={() =>
          //   navigate(`/course/${courseId}/overview`)
          //   // alert("Sorry! We didn't Implement...")
          // }
        />
      </div>  );
}

  if (!lesson) {
    return (
      <div className="flex justify-center h-full">
        <CourseContentEmptyState
          title="No Lessons Available"
          description="This module has no lessons available. Try another module or return to the overview."
          buttonText="Back to Overview"
          onButtonClick={() =>
            navigate(`/course/${courseId}/overview`)
          }
        />
      </div>
    );
  }

  return (
    <LessonViewer
      activeLesson={activeLesson}
      lesson={lesson}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      onNavigate={onNavigate}
    />
  );
}

export default LessonContent;