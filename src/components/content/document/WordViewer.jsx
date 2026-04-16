import { useEffect, useRef } from "react";
import { renderAsync } from "docx-preview";

export default function WordViewer({ url}) {
  const viewerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
    
      viewerRef.current.innerHTML = "";

      const res = await fetch(url);
      const buffer = await res.arrayBuffer();

      await renderAsync(buffer, viewerRef.current);

    };

    load();
  }, [url]);

  return <div ref={viewerRef} />;
}
