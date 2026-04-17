import React, { useState, useEffect } from 'react'
import { Icon } from '@/components/ui';
import clsx from 'clsx';

function ContentLessonSidebar({
    modules,
    openPlaylist,
    setOpenPlaylist,
    activeLesson,
    setActiveLesson,
    allLessons,
    nextLesson,
    mobilePlaylistOnly = false,
}) {

    const [openModuleId, setOpenModuleId] = useState(null);

    const [showNextPlaylist, setShowNextPlaylist] = useState(true);



    useEffect(() => {
        if (modules?.length && openModuleId === null) {
            setOpenModuleId(modules[0].id)
        }
    }, [modules, openModuleId])


    const toggleModule = (id) => {
        setOpenModuleId((prev) => (prev === id ? null : id));
    };

    if (!modules || modules.length === 0) {
        return <div className="p-4">No modules available.</div>;
    }


    return (
        <div className='text-main'>
            {!mobilePlaylistOnly && (
                <>


                    {modules.map((module, moduleIndex) => {
                        const isOpen = openModuleId === module.id;
                        return (
                            <div key={module.id}>
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className={clsx(
                                        "flex h-14 w-full border-primary items-center justify-between text-h45",
                                        isOpen ? "bg-primary/16 dark:bg-primary text-primary dark:text-gray-50 border-l-8 p-2" : "hover:bg-primary/16 p-4"
                                    )}
                                >
                                    <span className="truncate">{module.title}</span>


                                    <Icon
                                        name="iconamoon:arrow-down-2"
                                        height="26"
                                        width="26"
                                        className={clsx(
                                            "transition-transform duration-200",
                                            isOpen && "rotate-180"
                                        )}
                                    />
                                </button>
                                {isOpen && (
                                    <ul>
                                        {module.lessons?.length > 0 ? (

                                            module.lessons.map((lesson, lessonIndex) => {
                                                const isActive = activeLesson?.lessonId === lesson.id;
                                                const lessonId = lesson.id
                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() =>
                                                            setActiveLesson({
                                                                moduleIndex,
                                                                lessonIndex,
                                                                lessonId: lesson.id
                                                            })
                                                        }
                                                        className={clsx(
                                                            "flex w-full items-center justify-between p-4 text-dark-gray transition",
                                                            isActive
                                                                ? "bg-primary/16 dark:bg-primary text-primary dark:text-background"
                                                                : "hover:bg-primary/16 text-muted"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-4 min-w-0">

                                                            <Icon name={lesson?.mimeType?.startsWith("video") ? "ep:video-play" : "basil:document-outline"} height="26" width="26" />

                                                            <p className="text-h5 truncate">
                                                                {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                                            </p>
                                                        </div>

                                                        <Icon
                                                            name={lesson.status === "completed" ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}
                                                            height="26px"
                                                            width="26px"
                                                        />
                                                    </button>
                                                );
                                            })

                                        ) : (
                                            <li className="px-4 py-3 text-sm text-muted-foreground italic">
                                                No lessons in this module
                                            </li>
                                        )}

                                    </ul>
                                )}
                            </div>
                        )
                    })}
                </>
            )}





            <div className="fixed bottom-0 left-0 right-0 z-45 lg:hidden pb-3">
                <div className="rounded overflow-hidden shadow-2xl border border-default bg-primary">

                    <button
                        onClick={() => setShowNextPlaylist((prev) => !prev)}
                        className="w-full px-4 py-2 flex items-center justify-between text-white"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <Icon
                                name="mdi:format-list-bulleted"
                                width="22"
                                height="22"
                            />

                            <div className="text-left min-w-0">
                                <p className="text-sm font-semibold truncate">
                                    Next: {nextLesson?.title || "No next lesson"}
                                </p>

                                <p className="text-xs opacity-80">
                                    {nextLesson?.mimeType?.startsWith("video")
                                        ? "Video"
                                        : "Document"}
                                </p>
                            </div>
                        </div>

                        <Icon
                            name="mdi:chevron-up"
                            width="24"
                            height="24"
                            className={clsx(
                                "transition-transform duration-300",
                                !showNextPlaylist && "rotate-180"
                            )}
                        />
                    </button>
                </div>
            </div>



            {showNextPlaylist && (
                <div className="fixed bottom-0 pb-16 left-0 right-0 z-40 lg:hidden">
                    <div className="bg-surface border-2 border-b-0 border-default shadow-2xl max-h-[65vh] overflow-y-auto rounded-t-2xl">

                        <div className="px-4 py-3 border-b-2 border-default flex items-center justify-between">
                            <h3 className="text-h4 font-semibold text-main">
                                Contents
                            </h3>

                            <button
                                onClick={() => setShowNextPlaylist(false)}
                                className="text-muted"
                            >
                                <Icon
                                    name="mdi:close"
                                    width="26"
                                    height="26"
                                />
                            </button>
                        </div>

                        {modules.map((module, moduleIndex) => {
                            const isModuleOpen = openModuleId === module.id;

                            return (
                                <div key={module.id} className="border-b border-default">
                                    <button
                                        onClick={() => toggleModule(module.id)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-h5 font-medium"
                                    >
                                        <span>{module.title}</span>

                                        <Icon
                                            name="mdi:chevron-down"
                                            width="18"
                                            height="18"
                                            className={clsx(
                                                "transition-transform",
                                                isModuleOpen && "rotate-180"
                                            )}
                                        />
                                    </button>

                                    {isModuleOpen && (
                                        <div className="pb-2">
                                            {module.lessons?.map((lesson, lessonIndex) => {
                                                const isActive =
                                                    activeLesson?.lessonId === lesson.id;

                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => {
                                                            setActiveLesson({
                                                                moduleIndex,
                                                                lessonIndex,
                                                                lessonId: lesson.id,
                                                            });

                                                            setShowNextPlaylist(false);
                                                        }}
                                                        className={clsx(
                                                            "w-full flex items-center justify-between px-3 py-2.5 text-muted text-left",
                                                            isActive
                                                                ? "bg-primary/10 text-primary"
                                                                : "hover:bg-primary/5"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <Icon
                                                                name={
                                                                    lesson?.mimeType?.startsWith("video")
                                                                        ? "ep:video-play"
                                                                        : "basil:document-outline"
                                                                }
                                                                width="18"
                                                                height="18"
                                                            />

                                                            <div className="min-w-0">
                                                                <p className="truncate text-body">
                                                                    {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <Icon
                                                            name={
                                                                lesson.status === "completed"
                                                                    ? "mdi:checkbox-marked-circle"
                                                                    : "mdi:checkbox-blank-circle-outline"
                                                            }
                                                            width="18"
                                                            height="18"
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}



        </div>
    )
}

export default ContentLessonSidebar
