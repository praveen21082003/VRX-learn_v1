import React, { useState, useEffect, useRef } from 'react'
import { Button, Input } from "@/components/ui"
import PDFViewer from './PDFViewer';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
function DocumentControls({
    title,
    fileUrl,
    key
}) {

    console.log(fileUrl);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1);


    const containerRef = useRef();
    const hideTimerRef = useRef();
    const isHoveringControlsRef = useRef(false);


    const Divider = () => (
        <div className="w-px h-5 bg-[#BDBDC7] mx-2" />
    );


    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleScroll = (direction) => {
        // We look for the specific child div that has the scrollbar
        const scrollContainer = containerRef.current?.querySelector('.overflow-y-auto');

        if (!scrollContainer) return;

        const distance = direction === 'up' ? -160 : 160;
        scrollContainer.scrollBy({
            top: distance,
            behavior: 'smooth'
        });
    };

    // Updated
    useKeyboardShortcuts({
        'f': toggleFullScreen,
        'arrowright': () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
        'arrowleft': () => setCurrentPage((p) => Math.max(p - 1, 1)),
        'arrowup': () => handleScroll('up'),
        'arrowdown': () => handleScroll('down'),
        '=': () => setScale((s) => Math.min(s + 0.2, 2)),
        '-': () => setScale((s) => Math.max(s - 0.2, 0.6)),
    }, [totalPages, isFullscreen, scale]);


    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);

            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
            }

            hideTimerRef.current = setTimeout(() => {
                if (!isHoveringControlsRef.current) {
                    setShowControls(false);
                }
            }, 1000);
        };


        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            clearTimeout(hideTimerRef.current);
        }
    }, []);



    function ResponsiveActions() {
        return (
            <>
                <div className="flex items-center gap-2 rounded-md">

                    <Button
                        frontIconName="mingcute:left-fill"
                        frontIconHeight="18"
                        frontIconWidth="18"
                        textClass="text-white"
                        bgClass=""
                        className="p-1 hover:bg-white/10 rounded-full"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                    />

                    <div className="flex items-center gap-1 text-xs">
                        <Input
                            widthClass="w-10"
                            bgClass="bg-[#191B1C]"
                            textClass="text-white"
                            paddingClass="px-1 py-[2px]"
                            value={currentPage}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 1 && value <= totalPages) {
                                    setCurrentPage(value);
                                }
                            }}
                        />
                        <p className="text-gray-400">/{totalPages}</p>
                    </div>

                    <Button
                        frontIconName="mingcute:right-fill"
                        frontIconHeight="18"
                        frontIconWidth="18"
                        textClass="text-white"
                        bgClass=""
                        className="p-1 hover:bg-white/10 rounded-full"
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                    />
                </div>

                <Divider />

                <div className="flex items-center gap-2 py-1 rounded-md">

                    <Button
                        frontIconName="tabler:zoom-out"
                        frontIconHeight="18"
                        frontIconWidth="18"
                        textClass="text-white"
                        bgClass=""
                        className="p-1 hover:bg-white/10 rounded-full"
                        onClick={() =>
                            setScale((prev) => Math.max(prev - 0.2, 0.6))
                        }
                    />

                    <div className="text-xs w-12 text-center bg-[#191B1C] py-1 rounded">
                        {Math.round(scale * 100)}%
                    </div>

                    <Button
                        frontIconName="tabler:zoom-in"
                        frontIconHeight="18"
                        frontIconWidth="18"
                        textClass="text-white"
                        bgClass=""
                        className="p-1 hover:bg-white/10 rounded-full"
                        onClick={() =>
                            setScale((prev) => Math.min(prev + 0.2, 2))
                        }
                    />
                </div>

                <Divider />

                <Button
                    frontIconName="material-symbols:fit-page-width-outline-rounded"
                    frontIconHeight="18"
                    frontIconWidth="18"
                    textClass="text-white"
                    bgClass=""
                    className="p-2 hover:bg-white/10 rounded-full"
                    onClick={() => setScale(1)}
                />

            </>
        )
    }




    return (
        <div ref={containerRef} className={`relative flex flex-col h-dvh w-full overflow-hidden rounded-md ${isFullscreen ? "bg-black" : "bg-[#525659]"}`}>
            {/* <header className="flex-shrink-0 flex items-center justify-between px-4 h-12 bg-[#323639] text-white shadow-md shrink-0 z-20"> */}
            {/* //Updated */}
            <header className="flex-shrink-0 sticky top-0 z-30 flex items-center justify-between px-4 h-12 bg-[#323639] text-white shadow-md">

                <h2 className="text-sm font-medium truncate">
                    {title}
                </h2>

                <div className='hidden lg:flex lg:justify-center items-center gap-3'>
                    <ResponsiveActions />
                </div>

                <Button
                    frontIconName={
                        isFullscreen
                            ? "mingcute:fullscreen-exit-fill"
                            : "mingcute:fullscreen-fill"
                    }
                    frontIconHeight="18"
                    frontIconWidth="18"
                    textClass="text-white"
                    bgClass=""
                    className="p-2 hover:bg-white/10 rounded-full"
                    onClick={toggleFullScreen}
                />




            </header>
            {/* <div className="flex-1 overflow-hidden"> */}
            <div className="flex-1 overflow-y-auto w-full flex flex-col items-center custom-scrollbar">

                <PDFViewer
                    url={fileUrl}
                    scale={scale}
                    currentPage={currentPage}
                    setTotalPages={setTotalPages}
                    pdfDoc={pdfDoc}
                    setPdfDoc={setPdfDoc}
                />
                {/* </div> */}
                <div className="h-10 w-full flex-shrink-0" />
            </div>
            <div

                onMouseEnter={() => {
                    isHoveringControlsRef.current = true;
                }}

                onMouseLeave={() => {
                    isHoveringControlsRef.current = false;
                }}

                className={`absolute bottom-15 lg:bottom-6 left-1/2 -translate-x-1/2 
                bg-black/60 backdrop-blur-md text-white flex items-center gap-4 
                px-4 py-1.5 rounded-md shadow-2xl z-30 
                transition-opacity duration-300 border border-white/10
                ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
            >
                <Button
                    frontIconName="mingcute:left-fill"
                    frontIconHeight="18"
                    frontIconWidth="18"
                    textClass="text-white"
                    bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                />

                <span className="text-xs font-medium">
                    Page {currentPage} / {totalPages}
                </span>

                <Button
                    frontIconName="mingcute:right-fill"
                    frontIconHeight="18"
                    frontIconWidth="18"
                    textClass="text-white"
                    bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                />

            </div>
            <footer className='flex justify-center lg:hidden shrink-0 sticky bottom-0 z-30 items-center px-4 h-12 bg-[#323639] text-white shadow-md'>
                <div className='flex justify-center items-center gap-3'>
                    <ResponsiveActions />
                </div>
            </footer>

        </div>
    )
}

export default DocumentControls