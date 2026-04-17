import React, { useState } from 'react'
import { BackButton, Button, Icon } from '@/components/ui';
import { Overview, QuestionAnswers, Tabs } from '@/components/tabs';
import { useParams } from 'react-router-dom';
import ContentRenderer from '@/components/content/ContentRenderer';


function LessonViewer({ activeLesson, prevLesson, nextLesson, onNavigate, lesson }) {

    const [videoDuration, setVideoDuration] = useState(0);
    const [activeTab, setActiveTab] = useState("overview");


    const { courseSlug, moduleId, lessonId } = useParams();

    const id = lessonId || activeLesson?.lessonId;


    const { courseId } = useParams();


    const tabs = [
        { label: "Overview", value: "overview" },
        { label: "Q&A", value: "qa" },
    ];


    const formatToMinutes = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0mins";

        const mins = Math.round(seconds / 60);

        return `${mins}mins`;
    };


    return (
        <main className="flex-1 text-main overflow-y-auto py-1 px-2 md:py-1 md:px-6 pb-24">
            <h1 className="text-h3 flex gap-3">
                {activeLesson.moduleIndex + 1}.{activeLesson.lessonIndex + 1}
                <span>{lesson?.title}</span>
            </h1>
            <div className="flex items-center text-caption -mt-1.5 text-muted-foreground">

                <span>
                    {lesson?.mimeType?.startsWith("video") ? "video" : "application"}
                </span>

                <Icon name="ph:dot-bold" />

                {lesson?.mimeType?.startsWith("video") && (
                    <>
                        <span>{formatToMinutes(videoDuration) || "0:00"}</span>
                    </>
                )}
            </div>


            {/* Content redering */}
            <ContentRenderer
                lesson={lesson}
                // error={error}
                setVideoDuration={setVideoDuration}
            />



            <div className="hidden md:flex justify-between items-center pt-4">
                <div className="flex gap-4 w-[30%]">

                    <Button
                        buttonName="Previous"
                        frontIconName="stash:arrow-left-large-duotone"
                        frontIconHeight="16"
                        frontIconWidth="16"
                        className="p-1 px-2 rounded font-semibold"
                        onClick={() => onNavigate?.("prev")}
                        disabled={!prevLesson}
                    />

                    <Button
                        buttonName="Next"
                        backIconName="stash:arrow-right-large-duotone"
                        backIconHeight="16"
                        bgClass="bg-primary"
                        textClass="text-white"
                        className="p-2 rounded px-6 font-semibold"
                        onClick={() => onNavigate?.("next")}
                        disabled={!nextLesson}
                    />

                </div>
            </div>

            <div className="mt-6">
                <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="py-5">
                    {activeTab === "overview" && <Overview lesson={lesson} />}
                    {activeTab === "qa" && <QuestionAnswers />}
                </div>
            </div>

        </main>
    )
}

export default LessonViewer
