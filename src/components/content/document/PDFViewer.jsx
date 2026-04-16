import React, { use, useEffect, useLayoutEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useContentProtection } from "@/hooks/useContentProtection";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function PDFViewer({
    url,
    scale,
    currentPage,
    setTotalPages,
    pdfDoc,
    setPdfDoc,
}) {
    useContentProtection(true);
    const canvasRef = useRef(null);
    const renderTaskRef = useRef(null);
    const scrollRef = useRef(null);


    useLayoutEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;

        // Keep left edge visible
        scrollEl.scrollLeft = 0;
    }, [scale]);



    //    LOAD PDF

    useEffect(() => {
        if (!url) return;

        let destroyed = false;

        const load = async () => {
            try {
                const loadingTask = pdfjsLib.getDocument({
                    url,
                    disableAutoFetch: true,
                    disableStream: true,
                });

                const pdf = await loadingTask.promise;

                if (!destroyed) {
                    setPdfDoc(pdf);
                    setTotalPages(pdf.numPages);
                }
            } catch (err) {
                console.error("PDF load error:", err);
            }
        };

        load();

        return () => {
            destroyed = true;
        };
    }, [url]);

    //    RENDER PAGE

    useEffect(() => {
        if (!pdfDoc) return;

        const renderPage = async () => {
            try {
                if (renderTaskRef.current) {
                    renderTaskRef.current.cancel();
                }

                const page = await pdfDoc.getPage(currentPage);
                const viewport = page.getViewport({ scale });

                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderTask = page.render({
                    canvasContext: ctx,
                    viewport,
                });

                renderTaskRef.current = renderTask;

                await renderTask.promise;
            } catch (error) {
                if (error?.name !== "RenderingCancelledException") {
                    console.error("Render error:", error);
                }
            }
        };

        renderPage();
    }, [pdfDoc, currentPage, scale]);


    //    CLEANUP MEMORY (IMPORTANT)

    useEffect(() => {
        return () => {
            pdfDoc?.destroy();
        };
    }, [pdfDoc]);

    return (
        <div
            ref={scrollRef}
           className="relative flex w-full h-full flex-col items-center" // Removed overflow-auto
        onContextMenu={(e) => e.preventDefault()}
        >
            <canvas ref={canvasRef} />


            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <p className="text-4xl text-white/10 rotate-[-30deg] select-none">
                    {/* {} - {new Date().toLocaleString()} */}
                </p>
            </div>
        </div>
    );
}

export default PDFViewer;