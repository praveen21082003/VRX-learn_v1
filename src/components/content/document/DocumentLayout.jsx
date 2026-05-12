import { useEffect, useState, useRef, createContext, useContext, useLayoutEffect } from "react";
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

import { Button } from "@/components/ui";
import PDFViewer2 from './PDFViewer2';

// ─── Context ────────────────────────────────────────────────────────────────
export const DocsContext = createContext(null);

export const useDocsContext = () => {
    const ctx = useContext(DocsContext);
    if (!ctx) throw new Error("useDocsContext must be used within DocumentLayout");
    return ctx;
};

// ─── Divider ────────────────────────────────────────────────────────────────
const Divider = () => (
    <div className="w-px h-5 bg-[#BDBDC7] sm:mx-2" />
);

// ─── ControlActions — reads handlers from context ────────────────────────────
const ControlActions = () => {
    const {
        pageInput, setPageInput,
        pageNumber, numPages,
        scale,
        handleNext, handlePrev,
        zoomIn, zoomOut,
        applyPageChange,
        onPageInputChange,
        fitToWidth,
    } = useDocsContext();

    return (
        <>
            {/* Page navigation */}
            <div className="flex items-center gap-1 rounded-md">
                <Button
                    frontIconName="mingcute:left-fill"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={handlePrev}
                    disabled={pageNumber <= 1}
                />
                <div className="flex items-center gap-1 text-caption">
                    <input
                        type="number"
                        value={pageInput}
                        onChange={onPageInputChange}
                        onBlur={applyPageChange}
                        onKeyDown={(e) => e.key === "Enter" && applyPageChange()}
                        className="w-10 bg-[#191B1C] text-white px-1 py-0.5 text-center rounded outline-none
                                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                                   [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <p className="text-gray-400">/{numPages}</p>
                </div>
                <Button
                    frontIconName="mingcute:right-fill"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={handleNext}
                    disabled={pageNumber >= numPages}
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
                    onClick={zoomOut}
                />
                <div className="text-caption w-12 text-center bg-[#191B1C] py-1 rounded">
                    {(scale * 100).toFixed(0)}%
                </div>
                <Button
                    frontIconName="tabler:zoom-in"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={zoomIn}
                />
            </div>

            <Divider />

            {/* Fit to width */}
            <Button
                frontIconName="material-symbols:fit-page-width-outline-rounded"
                frontIconHeight="18" frontIconWidth="18"
                textClass="text-white" bgClass=""
                className="p-2 hover:bg-white/10 rounded-full"
                onClick={fitToWidth}
            />
        </>
    );
};

// ─── DocumentLayout ──────────────────────────────────────────────────────────
function DocumentLayout({ title, fileUrl, error }) {
    console.log(error);
    const containerRef = useRef(null);
    const scrollRef = useRef(null);
    const pageRefs = useRef([]);
    const isTypingRef = useRef(false);
    const pdfCache = useRef(new Map());

    const hideTimerRef = useRef();
    const isHoveringControlsRef = useRef(false);

    // PDF state
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pageInput, setPageInput] = useState("1");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [pageWidth, setPageWidth] = useState(700);
    const [loading, setLoading] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // ── Handlers (defined here so they can live in context) ──────────────────

    const scrollToPage = (page) => {
        if (!page || page < 1 || page > numPages) return;
        const el = pageRefs.current[page - 1];
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setPageNumber(page);
        setPageInput(String(page));
    };

    const handleNext = () => { if (pageNumber < numPages) scrollToPage(pageNumber + 1); };
    const handlePrev = () => { if (pageNumber > 1) scrollToPage(pageNumber - 1); };

    const zoomIn = () => setScale((p) => Math.min(p + 0.2, 4.5));
    const zoomOut = () => setScale((p) => Math.max(p - 0.2, 0.6));
    const resetZoom = () => setScale(1);

    // Fit page width to visible container
    const fitToWidth = () => {
        if (containerRef.current) {
            // scale=1 already uses full pageWidth; this resets to 1 (fit)
            setScale(1);
        }
    };

    const onPageInputChange = (e) => {
        isTypingRef.current = true;
        setPageInput(e.target.value);
    };

    const applyPageChange = () => {
        isTypingRef.current = false;
        if (pageInput === "") return setPageInput(String(pageNumber));
        const val = Number(pageInput);
        if (val < 1 || val > numPages) { setPageInput(String(pageNumber)); return; }
        scrollToPage(val);
    };

    const toggleFullscreen = () => {
        const el = containerRef.current;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    // ── Context value ─────────────────────────────────────────────────────────
    const context = {
        // state
        scale, setScale,
        scrollRef,
        numPages, setNumPages,
        pageNumber, setPageNumber,
        pdfBlobUrl, setPdfBlobUrl,
        pageInput, setPageInput,
        isFullScreen, setIsFullScreen,
        pageWidth, setPageWidth,
        pageRefs,
        isTypingRef,
        loading, setLoading,
        fileUrl,
        pdfCache,
        containerRef,
        error,
        
        // handlers
        handleNext,
        handlePrev,
        zoomIn,
        zoomOut,
        resetZoom,
        fitToWidth,
        onPageInputChange,
        applyPageChange,
        scrollToPage,
        toggleFullscreen,
    };


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


    // keyboard shortcuts
    useKeyboardShortcuts({
        'f': () => toggleFullscreen(),

        '=': (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                zoomIn();
            }
        },

        '+': (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                zoomIn();
            }
        },

        '-': (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                zoomOut();
            }
        },

        '0': (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                resetZoom();
            }
        }

    }, [scale, isFullScreen]);

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-col aspect-[1/1.414] w-full overflow-hidden shadow-xl
                        border border-gray-300 rounded-md
                        ${isFullScreen ? "bg-black" : "bg-[#525659]"}`}
        >
            {/* ── Header / toolbar ── */}
            <header className="shrink-0 sticky top-0 z-30 flex items-center justify-between px-4 h-12 bg-[#323639] text-white shadow-md">
                <h2 className="text-sm font-medium truncate">{title || "Untitled Document"}</h2>

                {/* Desktop controls */}
                <div className="hidden lg:flex lg:justify-center items-center gap-3">
                    <DocsContext.Provider value={context}>
                        <ControlActions />
                    </DocsContext.Provider>
                </div>

                {/* Fullscreen — always visible */}
                <Button
                    frontIconName={isFullScreen ? "mingcute:fullscreen-exit-fill" : "mingcute:fullscreen-fill"}
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-2 hover:bg-white/10 rounded-full"
                    onClick={toggleFullscreen}
                />
            </header>

            {/* ── PDF Viewer ── */}
            <DocsContext.Provider value={context}>
                <PDFViewer2 />
            </DocsContext.Provider>


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
                    onClick={handlePrev}
                    disabled={pageNumber <= 1}
                />
                <span className="shrink-0 text-caption font-medium">
                    Page {pageInput} / {numPages}
                </span>
                <Button
                    frontIconName="mingcute:right-fill"
                    frontIconHeight="18" frontIconWidth="18"
                    textClass="text-white" bgClass=""
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={handleNext}
                    disabled={pageNumber >= numPages}
                />

            </div>

            <footer className='flex justify-center lg:hidden shrink-0 sticky bottom-0 z-30 items-center px-4 h-12 bg-[#323639] text-white shadow-md'>
                <div className='flex justify-center items-center gap-3'>
                    <DocsContext.Provider value={context}>
                        <ControlActions />
                    </DocsContext.Provider>
                </div>
            </footer>
        </div>
    );
}

export default DocumentLayout;