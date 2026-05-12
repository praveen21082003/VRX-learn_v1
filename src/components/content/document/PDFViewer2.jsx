import React, { useEffect, useLayoutEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useDocsContext } from './DocumentLayout';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

pdfjs.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

function PDFViewer2() {
    const {
        scrollRef,
        numPages, setNumPages,
        pageNumber, setPageNumber,
        scale,
        pdfBlobUrl, setPdfBlobUrl,
        pageInput, setPageInput,
        pageWidth, setPageWidth,
        pageRefs,
        isTypingRef,
        containerRef,
        fileUrl,
        handleNext,
        handlePrev,
        scrollToPage,
        error,
    } = useDocsContext();

    // ── Set S3 URL directly ───────────────────────────────────────────────────
    useEffect(() => {
        if (!fileUrl) return;
        setPdfBlobUrl(fileUrl);
    }, [fileUrl]);

    // ── Track container width ─────────────────────────────────────────────────
    useLayoutEffect(() => {
        const el = containerRef?.current;
        if (!el) return;
        const updateWidth = () => setPageWidth(el.clientWidth - 20);
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // ── Keep left edge visible on zoom (only when overflowing) ───────────────
    useLayoutEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    }, [scale, pageWidth]);

    // ── Scroll → sync current page number ────────────────────────────────────
    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;

        const handler = () => {
            if (isTypingRef.current) return;
            const midpoint = scrollEl.scrollTop + scrollEl.clientHeight / 2;

            for (let i = 0; i < numPages; i++) {
                const el = pageRefs.current[i];
                if (!el) continue;
                const top = el.offsetTop;
                const bottom = top + el.clientHeight;
                if (midpoint >= top && midpoint <= bottom) {
                    setPageNumber(i + 1);
                    setPageInput(String(i + 1));
                    break;
                }
            }
        };

        scrollEl.addEventListener("scroll", handler);
        return () => scrollEl.removeEventListener("scroll", handler);
    }, [numPages]);

    // ── Keyboard shortcuts ────────────────────────────────────────────────────
    useKeyboardShortcuts(
        {
            ArrowRight: handleNext,           // next page
            ArrowDown: handleNext,           // next page
            ArrowLeft: handlePrev,           // prev page
            ArrowUp: handlePrev,           // prev page
            PageDown: handleNext,           // next page
            PageUp: handlePrev,           // prev page
            Home: () => scrollToPage(1),          // first page
            End: () => scrollToPage(numPages),   // last page
        },
        [pageNumber, numPages]
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        // outer wrapper: vertical scroll, horizontal scroll only when needed
        <div
            ref={scrollRef}
            className="w-full h-full overflow-y-auto overflow-x-auto py-3"
        >
            {/* inner wrapper: centers content; expands horizontally when zoomed */}
            <div className="flex flex-col items-center min-w-fit">
                {pdfBlobUrl ? (
                    <Document
                        file={pdfBlobUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    >
                        {Array.from({ length: numPages }, (_, idx) => (
                            <div
                                key={idx}
                                ref={(el) => (pageRefs.current[idx] = el)}
                                className="mb-4 shadow-lg"
                            >
                                <Page
                                    pageNumber={idx + 1}
                                    width={pageWidth * scale}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                />
                            </div>
                        ))}
                    </Document>
                ) : (
                    <div className="text-center text-red-500 space-y-1">
                        <p className="font-semibold">{error?.detail}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Try opening a different PDF or contact support if the issue continues.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PDFViewer2;