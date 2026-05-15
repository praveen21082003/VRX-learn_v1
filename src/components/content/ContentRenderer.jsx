import React, { useState, useEffect, use } from "react";

import useMedia from './hook/useMedia';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { Button, Icon } from "@/components/ui";

import { MediaPlaceholder, FilePlaceholder } from '@/components/ui/loading'
import { Tabs } from "@/components/tabs";
import { VideoPlayer } from "./video";
import DocumentControls from "./document/DocumentControls";
import DocumentLayout from "./document/DocumentLayout";
import useMedia from './hook/useMedia';

function ContentRenderer({ lesson, setVideoDuration }) {

  useDocumentTitle(`${lesson?.title} - Lesson` || "Lesson Content");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mediaId = lesson?.mediaId;
  const { url, loading: mediaLoading, error } = useMedia(mediaId);



  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(1);
  }, [lesson?.mediaId]);




  const isVideo = lesson?.mimeType?.startsWith("video");
  const isPDF = lesson?.mimeType === "application/pdf";

  return (
    <>
      <div className="flex justify-center w-full mt-1 lg:px-10 2xl:px-0 rounded overflow-hidden">
        {mediaLoading || !url ? (
          isPDF ? <FilePlaceholder /> : <MediaPlaceholder />
        ) : (
          <>
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
          </>
        )
        }

      </div>
    </>
  );
}

export default ContentRenderer;