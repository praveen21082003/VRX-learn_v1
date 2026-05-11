import React, { useRef } from 'react'

import { Button } from '@/ui/components'


// controls divider
const Divider = () => (
    <div className="w-px h-5 bg-[#BDBDC7] sm:mx-2" />
);

const ControlActions = () => {
    return (
        <>
            <div className="flex items-center gap-1 rounded-md">
                <Button
                    frontIconName="mingcute:left-fill"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                />
                <div className="flex items-center gap-1 text-caption">
                    <input
                        type="number"
                        className="w-10 bg-[#191B1C] text-white px-1 py-0.5 text-center rounded outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {/* <p className="text-gray-400">/{totalPages}</p> */}
                </div>
                <Button
                    frontIconName="mingcute:right-fill"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                />
            </div>

            <Divider />

            {/* Zoom controls */}
            <div className="flex items-center py-1 gap-0.5 rounded-md">

            </div>
        </>
    )
}

function DocumentLayout({ title }) {

    const containerRef = useRef(null);

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-col aspect-[1/1.414] w-full overflow-hidden shadow-xl border border-gray-300 rounded-md ${isFullscreen ? "bg-black" : "bg-[#525659]"}`}
        >
            <header className="shrink-0 sticky top-0 z-30 flex items-center justify-between px-4 h-12 bg-[#323639] text-white shadow-md">
                <h2 className="text-sm font-medium truncate">{title || "Untitled Document"}</h2>

            </header>

        </div>
    )
}

export default DocumentLayout
