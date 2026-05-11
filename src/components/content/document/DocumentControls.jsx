import React, { useState, useEffect, useRef, memo } from 'react'
import { Button, Icon } from "@/components/ui"
import PDFViewer from './PDFViewer';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';

// ─── Outside component — stable, no remount ───────────────────────────────────
const Divider = () => (
    <div className="w-px h-5 bg-[#BDBDC7] sm:mx-2" />
);

const ResponsiveActions = memo(({
    currentPage,
    totalPages,
    pageInput,
    setPageInput,
    setCurrentPage,
    scale,
    setScale
}) => {

    const handlePageBlur = () => {
        const value = Number(pageInput);
        if (value >= 1 && value <= totalPages) {
            setCurrentPage(value);
        } else {
            setPageInput(String(currentPage));
        }
    };

    const handlePageKeyDown = (e) => {
        if (e.key === "Enter") {
            const value = Number(pageInput);
            if (value >= 1 && value <= totalPages) {
                setCurrentPage(value);
            } else {
                setPageInput(String(currentPage));
            }
            e.target.blur();
        }
    };

    return (
        <>
            {/* Page navigation */}
            <div className="flex items-center gap-1 rounded-md">
                <Button
                    frontIconName="mingcute:left-fill"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                />

                <div className="flex items-center gap-1 text-caption">
                    <input
                        type="number"
                        className="w-10 bg-[#191B1C] text-white px-1 py-0.5 text-center rounded outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onBlur={handlePageBlur}
                        onKeyDown={handlePageKeyDown}
                    />
                    <p className="text-gray-400">/{totalPages}</p>
                </div>

                <Button
                    frontIconName="mingcute:right-fill"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                />
            </div>

            <Divider />

            {/* Zoom controls */}
            <div className="flex items-center py-1 gap-0.5 rounded-md">
                <Button
                    frontIconName="tabler:zoom-out"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.6))}
                />
                <div className="text-caption w-12 text-center bg-[#191B1C] py-1 rounded">
                    {Math.round(scale * 100)}%
                </div>
                <Button
                    frontIconName="tabler:zoom-in"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={() => setScale((prev) => Math.min(prev + 0.2, 2))}
                />
            </div>

            <Divider />

            {/* Fit width */}
            <Button
                frontIconName="material-symbols:fit-page-width-outline-rounded"
                frontIconHeight="18" frontIconWidth="18"
                textClass="text-white" bgClass=""
                className="p-2 hover:bg-white/10 rounded-full"
                onClick={() => setScale(1)}
            />
        </>
    );
});

// ─── Main Component ───────────────────────────────────────────────────────────
function DocumentControls({ title, fileUrl }) {

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1);
    const [docLoading, setDocLoading] = useState(true);
    const [docError, setDocError] = useState(false);
    const [pageInput, setPageInput] = useState("1");

    const containerRef = useRef();
    const hideTimerRef = useRef();
    const isHoveringControlsRef = useRef(false);

    // sync pageInput when currentPage changes (prev/next buttons)
    useEffect(() => {
        setPageInput(String(currentPage));
    }, [currentPage]);

    // reset on new file
    useEffect(() => {
        setDocLoading(true);
        setDocError(false);
        setCurrentPage(1);
        setPageInput("1");
    }, [fileUrl]);

    // keyboard shortcuts
    useKeyboardShortcuts({
        'f': toggleFullScreen,
        'arrowright': () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
        'arrowleft': () => setCurrentPage((p) => Math.max(p - 1, 1)),
        'arrowup': () => handleScroll('up'),
        'arrowdown': () => handleScroll('down'),
        '=': () => setScale((s) => Math.min(s + 0.2, 2)),
        '-': () => setScale((s) => Math.max(s - 0.2, 0.6)),
    }, [totalPages, isFullscreen, scale]);

    // hide controls on mouse idle
    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            hideTimerRef.current = setTimeout(() => {
                if (!isHoveringControlsRef.current) setShowControls(false);
            }, 1000);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            clearTimeout(hideTimerRef.current);
        };
    }, []);

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }

    function handleScroll(direction) {
        const scrollContainer = containerRef.current?.querySelector('.overflow-y-auto');
        if (!scrollContainer) return;
        scrollContainer.scrollBy({
            top: direction === 'up' ? -160 : 160,
            behavior: 'smooth'
        });
    }

    // shared props for ResponsiveActions
    const actionProps = {
        currentPage,
        totalPages,
        pageInput,
        setPageInput,
        setCurrentPage,
        scale,
        setScale,
    };

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-col aspect-[1/1.414] w-full overflow-hidden shadow-xl border border-gray-300 rounded-md ${isFullscreen ? "bg-black" : "bg-[#525659]"}`}
        >
            {/* ── Header ── */}
            <header className="shrink-0 sticky top-0 z-30 flex items-center justify-between px-4 h-12 bg-[#323639] text-white shadow-md">

                {/* title — always visible */}
                <h2 className="text-sm font-medium truncate">{title}</h2>

                {/* desktop — all controls in header */}
                <div className='hidden lg:flex lg:justify-center items-center gap-3'>
                    <ResponsiveActions {...actionProps} />
                </div>

                {/* fullscreen button — always visible */}
                <Button
                    frontIconName={isFullscreen ? "mingcute:fullscreen-exit-fill" : "mingcute:fullscreen-fill"}
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-2 hover:bg-white/10 rounded-full"
                    onClick={toggleFullScreen}
                />
            </header>

            {/* ── Loading ── */}
            {docLoading && (
                <div className="flex flex-col items-center justify-center flex-1 gap-3">
                    <Icon name="line-md:loading-twotone-loop" height="40" width="40" className="text-primary" />
                    <p className="text-white text-caption">Loading document...</p>
                </div>
            )}

            {/* ── PDF body ── */}
            <div className={`flex-1 overflow-y-auto w-full flex flex-col items-center custom-scrollbar ${docLoading ? "hidden" : ""}`}>
                <PDFViewer
                    url={fileUrl}
                    scale={scale}
                    currentPage={currentPage}
                    setTotalPages={(pages) => {
                        setTotalPages(pages);
                        setDocLoading(false);
                    }}
                    pdfDoc={pdfDoc}
                    setPdfDoc={setPdfDoc}
                    onError={() => {
                        setDocLoading(false);
                        setDocError(true);
                    }}
                />
                <div className="h-10 w-full shrink-0" />
            </div>

            {/* ── Error ── */}
            {docError && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-red-500">
                    <Icon name="fluent:document-error-16-filled" height="40" width="40" />
                    <p>Failed to load document</p>
                </div>
            )}

            {/* ── Floating page indicator (desktop hover) ── */}
            <div
                onMouseEnter={() => { isHoveringControlsRef.current = true; }}
                onMouseLeave={() => { isHoveringControlsRef.current = false; }}
                className={`absolute bottom-15 lg:bottom-6 left-1/2 -translate-x-1/2 
                    bg-black/60 backdrop-blur-md text-white flex items-center gap-3 
                    px-4 py-1.5 rounded-md shadow-2xl z-30 
                    transition-opacity duration-300 border border-white/10
                    ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
            >
                <Button
                    frontIconName="mingcute:left-fill"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                />
                <span className="shrink-0 text-caption font-medium">
                    Page {currentPage} / {totalPages}
                </span>
                <Button
                    frontIconName="mingcute:right-fill"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                />
            </div>

            {/* ── Mobile footer — all controls ── */}
            <footer className='flex justify-center lg:hidden shrink-0 sticky bottom-0 z-30 items-center px-4 h-12 bg-[#323639] text-white shadow-md'>
                <div className='flex justify-center items-center gap-3'>
                    <ResponsiveActions {...actionProps} />
                </div>
            </footer>
        </div>
    );
}

export default DocumentControls;