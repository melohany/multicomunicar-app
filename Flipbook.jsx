import { useState, useRef, useEffect, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

// Worker do PDF.js via CDN — correspondente à versão que o react-pdf usa internamente
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// ── Cada página precisa de forwardRef para o react-pageflip medir corretamente ──
const FlipPage = forwardRef(({ number, width, height }, ref) => (
  <div ref={ref} className="fp-page">
    <Page
      pageNumber={number}
      width={width}
      renderAnnotationLayer={false}
      renderTextLayer={false}
      loading={
        <div style={{ width, height, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="fp-micro-spin" />
        </div>
      }
    />
  </div>
));
FlipPage.displayName = "FlipPage";

// ── Componente principal ───────────────────────────────────────────────────────
export default function Flipbook({ src, title, filename, author }) {
  const [numPages, setNumPages]     = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [scale, setScale]           = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadErr, setLoadErr]       = useState(false);
  const [ready, setReady]           = useState(false);   // PDF loaded
  const [stageW, setStageW]         = useState(820);     // largura mensurável do stage

  const bookRef      = useRef(null);
  const containerRef = useRef(null);
  const stageRef     = useRef(null);

  // Dimensões da página — baseadas na largura disponível (proporção A4 1:√2)
  const halfW   = Math.min(Math.floor((stageW - 120) / 2), 460);
  const pageW   = Math.max(halfW, 120);
  const pageH   = Math.round(pageW * 1.4142);

  // ── Medir o stage para calcular largura da página ──────────────────────────
  useEffect(() => {
    if (!stageRef.current) return;
    const obs = new ResizeObserver(() => {
      if (stageRef.current) setStageW(stageRef.current.offsetWidth);
    });
    obs.observe(stageRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Fullscreen ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen();
  };

  // ── Teclado ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") flipNext();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")  flipPrev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [ready]);

  const flipNext = () => bookRef.current?.pageFlip().flipNext();
  const flipPrev = () => bookRef.current?.pageFlip().flipPrev();
  const goTo     = (n) => {
    const p = Math.max(0, Math.min(n - 1, (numPages ?? 1) - 1));
    bookRef.current?.pageFlip().turnToPage(p);
  };

  const zoomIn  = () => setScale((s) => Math.min(2.0,  parseFloat((s + 0.15).toFixed(2))));
  const zoomOut = () => setScale((s) => Math.max(0.40, parseFloat((s - 0.15).toFixed(2))));

  // Altura mínima do stage para acomodar o livro escalado
  const minStageH = Math.ceil(pageH * scale) + 56;

  return (
    <div ref={containerRef} className={`fp-root${isFullscreen ? " fp-fs" : ""}`}>

      {/* ─── Barra de controles ─────────────────────────────────────────────── */}
      <div className="fp-topbar">
        <div className="fp-topbar-title">
          <span>📄</span> {title}
        </div>

        <div className="fp-topbar-actions">
          {/* Zoom */}
          <div className="fp-zoom-pill">
            <button className="fp-icon-btn" onClick={zoomOut} title="Diminuir zoom" aria-label="Diminuir">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span className="fp-zoom-val">{Math.round(scale * 100)}%</span>
            <button className="fp-icon-btn" onClick={zoomIn} title="Aumentar zoom" aria-label="Aumentar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>

          {/* Tela cheia */}
          <button className="fp-txt-btn" onClick={toggleFullscreen}>
            {isFullscreen ? "⊠ Sair" : "⛶ Tela cheia"}
          </button>

          {/* Download */}
          <a href={src} download={filename} className="fp-txt-btn fp-dl-btn">
            ⬇ Baixar
          </a>
        </div>
      </div>

      {/* ─── Área do livro ──────────────────────────────────────────────────── */}
      <div ref={stageRef} className="fp-stage" style={{ minHeight: minStageH }}>

        {/* Seta esquerda */}
        <button
          className="fp-arrow"
          onClick={flipPrev}
          disabled={currentPage === 0 || !ready}
          title="Página anterior (←)"
          aria-label="Página anterior"
        >
          ‹
        </button>

        {/* Livro */}
        <div className="fp-book-wrap">
          <Document
            file={src}
            onLoadSuccess={({ numPages: n }) => { setNumPages(n); setReady(true); }}
            onLoadError={() => setLoadErr(true)}
            loading={
              <div className="fp-state-box">
                <div className="fp-spinner" />
                <p>Carregando apostila…</p>
              </div>
            }
            error={null}
          >
            {/* Erro */}
            {loadErr && (
              <div className="fp-state-box fp-state-err">
                <div style={{ fontSize: 40 }}>⚠️</div>
                <p>Não foi possível carregar o PDF.</p>
                <a href={src} target="_blank" rel="noreferrer" className="fp-txt-btn fp-dl-btn" style={{ textDecoration: "none", display: "inline-block" }}>
                  Abrir em nova aba
                </a>
              </div>
            )}

            {/* Flipbook — remonta somente quando as dimensões da página mudam */}
            {ready && numPages && !loadErr && (
              <div
                className="fp-scaler"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                  transition: "transform 0.22s ease",
                  willChange: "transform",
                }}
              >
                <HTMLFlipBook
                  key={`${pageW}x${pageH}`}
                  ref={bookRef}
                  width={pageW}
                  height={pageH}
                  size="fixed"
                  minWidth={110}
                  maxWidth={900}
                  minHeight={150}
                  maxHeight={1400}
                  showCover={true}
                  drawShadow={true}
                  flippingTime={720}
                  useMouseEvents={true}
                  mobileScrollSupport={false}
                  className="fp-book"
                  onFlip={(e) => setCurrentPage(e.data)}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <FlipPage key={i} number={i + 1} width={pageW} height={pageH} />
                  ))}
                </HTMLFlipBook>
              </div>
            )}
          </Document>
        </div>

        {/* Seta direita */}
        <button
          className="fp-arrow"
          onClick={flipNext}
          disabled={!ready || !numPages || currentPage >= numPages - 1}
          title="Próxima página (→)"
          aria-label="Próxima página"
        >
          ›
        </button>
      </div>

      {/* ─── Rodapé ─────────────────────────────────────────────────────────── */}
      <div className="fp-footer">
        <span className="fp-credit">{author}</span>

        <div className="fp-page-nav">
          <button className="fp-pg-btn" onClick={flipPrev} disabled={currentPage === 0 || !ready}>
            ← Anterior
          </button>

          <div className="fp-page-badge">
            {ready && numPages ? `${currentPage + 1} / ${numPages}` : "—"}
          </div>

          <button className="fp-pg-btn" onClick={flipNext} disabled={!ready || !numPages || currentPage >= numPages - 1}>
            Próxima →
          </button>
        </div>

        <div className="fp-goto">
          <span className="fp-goto-label">Ir para</span>
          <input
            className="fp-goto-input"
            type="number"
            placeholder="#"
            min={1}
            max={numPages ?? 1}
            onKeyDown={(e) => e.key === "Enter" && goTo(parseInt(e.target.value, 10))}
            aria-label="Ir para página"
          />
          <span className="fp-goto-label">de {numPages ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}
