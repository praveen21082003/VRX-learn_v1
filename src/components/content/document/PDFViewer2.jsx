import { useEffect, useRef, useState } from "react";

import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PDFViewer({
  url,
  key,
  currentPage,
  setTotalPages,
  setCurrentPage,
}) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);

  // 🔹 Load PDF
  useEffect(() => {
    const loadPDF = async () => {
      try {

        if (!url) return;

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        setTotalPages(pdf.numPages);
        setPdfDoc(pdf);

        setCurrentPage(1); 

      } catch (err) {
        console.error("PDF load error:", err);
      }
    };

    loadPDF();

  }, [url]);

  // 🔹 Render Page
  useEffect(() => {
    if (!pdfDoc) return;
    if (!canvasRef.current) return;

    const renderPage = async () => {
      try {
        // Cancel previous render
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const safePage =
          currentPage < 1
            ? 1
            : currentPage > pdfDoc.numPages
              ? pdfDoc.numPages
              : currentPage;

        const page = await pdfDoc.getPage(safePage);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const viewport = page.getViewport({ scale: 1 });

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
          console.error("PDF render error:", error);
        }
      }
    };

    renderPage();

  }, [pdfDoc, currentPage]);

  return (
    <div key={key} className="flex justify-center " onContextMenu={(e) => e.preventDefault()}>
      <canvas ref={canvasRef} />
    </div>
    
  );
}
