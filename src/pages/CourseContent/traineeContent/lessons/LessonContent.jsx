import React from 'react';
import { useOutletContext } from 'react-router-dom';
import LessonViewer from '@/components/lessonViewer/LessonViewer';

function LessonContent() {
  const {
    modules,
    allLessons,
    activeLesson,
    setActiveLesson
  } = useOutletContext();


  const lesson = allLessons.find(
    (item) => item.id === activeLesson?.lessonId
  );

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

  if (!activeLesson) {
    return <div>Select a lesson</div>;
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