import React, { useState, useEffect } from 'react'
import { Icon } from '@/components/ui';
import clsx from 'clsx';

function ContentLessonSidebar({ modules, openPlaylist, setOpenPlaylist, activeLesson, setActiveLesson }) {

    const [openModuleId, setOpenModuleId] = useState(null);



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
        <div>
            {modules.map((module, moduleIndex) => {
                const isOpen = openModuleId === module.id;
                return (
                    <div key={module.id}>
                        <button
                            onClick={() => toggleModule(module.id)}
                            className={clsx(
                                "flex h-14 w-full border-primary items-center justify-between text-dark-gray text-h45",
                                isOpen ? "bg-primary/16 dark:bg-primary text-primary dark:text-background border-l-8 p-2" : "hover:bg-primary/16 p-4"
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
        </div>
    )
}

export default ContentLessonSidebar
