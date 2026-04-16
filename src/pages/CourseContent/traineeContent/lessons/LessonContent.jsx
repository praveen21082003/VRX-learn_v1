import React from 'react';
import { useOutletContext } from 'react-router-dom';
import LessonViewer from '@/components/lessonViewer/LessonViewer';

function LessonContent() {
  const {
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
    if (direction === "prev" && prevLesson) {
      setActiveLesson({
        lessonId: prevLesson.id,
      });
    }

    if (direction === "next" && nextLesson) {
      setActiveLesson({
        lessonId: nextLesson.id,
      });
    }
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