import React, { useState, useEffect, use } from "react";

import useViewUrl from "@/hooks/useViewUrl";
import { getLessonViewUrl } from "@services/Lessons.service";
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { Button, Icon } from "@/components/ui";

import { MediaPlaceholder, FilePlaceholder } from '@/components/ui/loading'
import { Tabs } from "@/components/tabs";
import { VideoPlayer } from "./video";
import DocumentLayout from "./document/DocumentLayout";

function ContentRenderer({ lesson, setVideoDuration }) {
  console.log(lesson)

  useDocumentTitle(`${lesson?.title} - Lesson` || "Lesson Content");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const lessonId = lesson?.id;

  const LESSON_VIEW_ERRORS = {
    403: "You do not have access to this lesson.",
    404: "The lesson file is unavailable or has been removed.",
  };

  const {
    url,
    loading,
    error,
  } = useViewUrl(
    lessonId,
    getLessonViewUrl,
    LESSON_VIEW_ERRORS
  );



  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(1);
  }, [lesson?.lessonId]);




  const isVideo = lesson?.mimeType?.startsWith("video");
  const isPDF = lesson?.mimeType === "application/pdf";

  if (loading) {
    return (
      <div className="flex justify-center w-full mt-1 lg:px-10 2xl:px-0">
        {isPDF ? <FilePlaceholder /> : <MediaPlaceholder />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Icon
          icon="material-symbols:error-outline"
          width="48"
          height="48"
        />

        <p className="text-center text-muted-foreground">
          {error}
        </p>

        <Button
          buttonName="Retry"
          onClick={refetch}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center w-full mt-1 lg:px-10 2xl:px-0 rounded overflow-hidden">


        {
          isVideo ? (
            <VideoPlayer
              url={url}
              key={lesson.id}
              setVideoDuration={setVideoDuration}
            />
          ) : isPDF ? (
            <DocumentLayout
              title={lesson.title}
              fileUrl={url}
              error={error}
              key={lesson.id}
            />
          ) : (
            <p className="text-muted-foreground">Unsupported file type</p>
          )}


      </div>
    </>
  );
}

export default ContentRenderer;