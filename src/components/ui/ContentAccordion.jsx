import { useState } from "react";

import { Icon } from "@/components/ui";

const items = [
    { id: 1, type: "file", label: "Node JS Installation Guide" },
    { id: 2, type: "video", label: "Kickstart Node JS" },
    { id: 3, type: "file", label: "NPM Library Installation Guide" },
    { id: 4, type: "video", label: "Mini Project - Todo Application" },
];

function ContentAccordion() {

    const [isOpen, setIsOpen] = useState(true);

    return (

        <div className="w-full overflow-hidden border text-main border-default bg-background">

            {/* Header */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-4 border-b border-default bg-menu-header px-3.5 py-3 text-left cursor-pointer"
            >

                <div className="min-w-0">
                    <h5 className="truncate text-h5">
                        Introduction to Node JS
                    </h5>
                </div>

                <div className="flex shrink-0 items-center gap-3">

                    <span className="text-body text-muted whitespace-nowrap">
                        6 Lessons
                    </span>

                    <Icon
                        name="iconamoon:arrow-down-2"
                        size="24"
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                    />

                </div>

            </button>

            {/* Accordion Content */}
            <div
                className={`
                    grid transition-all duration-300 ease-in-out
                    ${isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                `}
            >

                <div className="overflow-hidden">

                    {items.map((item, index) => (

                        <div
                            key={item.id}
                            className={`
                                flex items-center gap-3 px-4 py-3
                                transition-colors duration-200
                                hover:bg-gray-50 dark:hover:bg-white/5
                                ${index < items.length - 1
                                    ? "border-b border-default"
                                    : ""
                                }
                            `}
                        >

                            <span className="shrink-0 text-primary">
                                {item.type === "file" ? (
                                    <Icon
                                        name="basil:document-outline"
                                        size="20"
                                    />
                                ) : (
                                    <Icon
                                        name="ep:video-play"
                                        size="20"
                                    />
                                )}
                            </span>

                            <p className="min-w-0 truncate text-body text-main">
                                {item.label}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default ContentAccordion;