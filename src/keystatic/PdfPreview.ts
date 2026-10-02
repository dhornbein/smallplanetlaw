import { createElement, useEffect, useRef, useState } from 'react';
import { ActionButton } from '@keystar/ui/button';
import { Text } from '@keystar/ui/typography';

// Minimal PDF viewer for the Keystatic admin: one page at a time with previous/next.
// pdf.js is imported lazily so it never loads on the public site or during SSR.
export function PdfPreview({ data }: { data: Uint8Array }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: any;
    setError(false);
    (async () => {
      const pdfjs = await import('pdfjs-dist');
      const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      // pdf.js transfers the buffer to its worker, so give it a copy.
      loadingTask = pdfjs.getDocument({ data: data.slice() });
      const loaded = await loadingTask.promise;
      if (cancelled) return;
      setPdf(loaded);
      setPage(1);
    })().catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
      // Destroying the loading task also frees the document and its worker.
      loadingTask?.destroy();
    };
  }, [data]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let task: any;
    pdf.getPage(page).then((pdfPage: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const scale = 360 / pdfPage.getViewport({ scale: 1 }).width;
      const viewport = pdfPage.getViewport({ scale: scale * (window.devicePixelRatio || 1) });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = '360px';
      task = pdfPage.render({ canvas, viewport });
      task.promise.catch(() => {});
    });
    return () => task?.cancel();
  }, [pdf, page]);

  if (error) return createElement(Text, { size: 'small', color: 'neutral' }, 'Preview unavailable for this file.');
  if (!pdf) return createElement(Text, { size: 'small', color: 'neutral' }, 'Loading preview…');

  return createElement(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' } },
    createElement('canvas', { ref: canvasRef, style: { border: '1px solid rgba(128,128,128,0.4)', borderRadius: 4 } }),
    createElement(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      createElement(ActionButton, { isDisabled: page <= 1, onPress: () => setPage(page - 1) }, 'Previous'),
      createElement(Text, { size: 'small', color: 'neutral' }, `Page ${page} of ${pdf.numPages}`),
      createElement(ActionButton, { isDisabled: page >= pdf.numPages, onPress: () => setPage(page + 1) }, 'Next')
    )
  );
}
