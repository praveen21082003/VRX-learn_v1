import React, { useState, useEffect } from "react";

import { Button, Icon, MediaPlaceholder } from "@/components/ui";
import { Tabs } from "@/components/tabs";
import { VideoPlayer } from "./video";
import DocumentControls from "./document/DocumentControls";
// import ZoomControls from "../ui/FileViewer/ZoomControls";
// import PDFViewer from "./document/PDFViewer";
// import WordViewer from "./document/WordViewer";
import useMedia from './hook/useMedia';

function ContentRenderer({ lesson, error, setVideoDuration }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mediaId = lesson?.mediaId;
  const { url, loading: mediaLoading } = useMedia(mediaId);



  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(1);
  }, [lesson?.mediaId]);

  if (mediaLoading || !url) {
    return (
      <MediaPlaceholder />
    );
  }


  if (!lesson) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading lesson...</p>
      </main>
    );
  }

  const isVideo = lesson?.mimeType?.startsWith("video");
  const isPDF = lesson?.mimeType === "application/pdf";

  return (
    <>
      <div className="flex justify-center w-full mt-1 lg:px-10 2xl:px-0 rounded overflow-hidden">
        {mediaLoading || !url ? (
          <MediaPlaceholder />
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
                <DocumentControls
                  title={lesson.title}
                  fileUrl={url}
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