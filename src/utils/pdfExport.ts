import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  fileName?: string;
  orientation?: 'landscape' | 'portrait';
  format?: 'a4';
  quality?: number; // 1 to 2
}

// Single offscreen 2D canvas helper to convert any modern CSS color (including oklch, oklab, display-p3) to RGB/RGBA
const helperCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
if (helperCanvas) {
  helperCanvas.width = 1;
  helperCanvas.height = 1;
}
const helperCtx = helperCanvas ? helperCanvas.getContext('2d', { willReadFrequently: true }) : null;

/**
 * Sanitizes any color string that contains modern CSS color functions (like oklch, oklab, color-mix)
 * which html2canvas does not support, converting them to standard rgb()/rgba() or hex.
 */
export function oklchToRgb(lStr: string, cStr: string, hStr: string, alphaStr?: string): string {
  let L = parseFloat(lStr);
  if (lStr && lStr.includes('%')) L = L / 100;

  let C = cStr === 'none' ? 0 : parseFloat(cStr);
  if (isNaN(C)) C = 0;

  let H = hStr === 'none' ? 0 : parseFloat(hStr) || 0;
  if (hStr && typeof hStr === 'string') {
    if (hStr.includes('turn')) H = parseFloat(hStr) * 360;
    else if (hStr.includes('rad')) H = (parseFloat(hStr) * 180) / Math.PI;
  }

  let alpha = 1;
  if (alphaStr) {
    alpha = parseFloat(alphaStr);
    if (alphaStr.includes('%')) alpha = alpha / 100;
    if (isNaN(alpha)) alpha = 1;
  }

  if (isNaN(L)) {
    return 'rgb(255, 255, 255)';
  }

  // OKLCH -> OKLAB
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLAB -> Linear sRGB
  const l_ = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m_ = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s_ = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);

  const rLin = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const gLin = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const bLin = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  const toSrgb = (c: number) => {
    const clamped = Math.max(0, Math.min(1, c));
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const R = Math.round(Math.max(0, Math.min(255, toSrgb(rLin) * 255)));
  const G = Math.round(Math.max(0, Math.min(255, toSrgb(gLin) * 255)));
  const B = Math.round(Math.max(0, Math.min(255, toSrgb(bLin) * 255)));

  if (alpha < 1) {
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
  }
  return `rgb(${R}, ${G}, ${B})`;
}

/**
 * Sanitizes any color string that contains modern CSS color functions (like oklch, oklab, color-mix)
 * converting them to exact standard rgb()/rgba() so html2canvas renders vibrant colors.
 */
export function sanitizeColorString(val: string, isBackground = false): string {
  if (!val || typeof val !== 'string') return val;
  if (!val.includes('oklch') && !val.includes('oklab') && !val.includes('color(') && !val.includes('color-mix')) {
    return val;
  }

  // 1. First convert exact oklch patterns mathematically (including 'none' for achromatic hues)
  let result = val.replace(/oklch\(\s*([\d.]+%?)\s+([\d.]+|none)\s+([\d.]+(?:deg|rad|turn)?|none)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi, (_, l, c, h, a) => {
    return oklchToRgb(l, c, h, a);
  });

  if (!result.includes('oklch') && !result.includes('oklab') && !result.includes('color(') && !result.includes('color-mix')) {
    return result;
  }

  // 2. Fallback for other CSS color functions using canvas helper
  return result.replace(/(?:oklch|oklab|color-mix|color)\([^)]+\)/gi, (match) => {
    if (helperCtx) {
      try {
        helperCtx.fillStyle = '#ffffff';
        helperCtx.fillStyle = match;
        const converted = helperCtx.fillStyle;
        if (converted && !converted.includes('oklch') && !converted.includes('oklab')) {
          return converted;
        }
      } catch {
        // Fallback
      }
    }
    return isBackground ? '#ffffff' : 'rgb(30, 41, 59)';
  });
}

/**
 * Creates a Proxy around getComputedStyle so that html2canvas receives standard rgb/rgba
 * colors and NEVER receives shadows that cause black smudges or artifact boxes.
 */
function createSafeGetComputedStyle(originalGetComputedStyle: (elt: Element, pseudoElt?: string | null) => CSSStyleDeclaration) {
  return function safeGetComputedStyle(elt: Element, pseudoElt?: string | null): CSSStyleDeclaration {
    const originalStyles = originalGetComputedStyle(elt, pseudoElt);

    return new Proxy(originalStyles, {
      get(target, prop) {
        // Intercept getPropertyValue
        if (prop === 'getPropertyValue') {
          return (propertyName: string) => {
            const p = propertyName.toLowerCase();
            // Block all box-shadows, text-shadows, filters to prevent black smudges in html2canvas
            if (p === 'box-shadow' || p === 'boxshadow') return 'none';
            if (p === 'text-shadow' || p === 'textshadow') return 'none';
            if (p === 'filter' || p === 'backdrop-filter') return 'none';

            const val = target.getPropertyValue(propertyName);
            const isBg = p.includes('background') || p === 'fill';
            return sanitizeColorString(val, isBg);
          };
        }

        // Direct property access
        if (prop === 'boxShadow' || prop === 'textShadow' || prop === 'filter' || prop === 'backdropFilter') {
          return 'none';
        }

        const value = (target as any)[prop];

        if (typeof value === 'function') {
          return (...args: any[]) => {
            const res = value.apply(target, args);
            if (typeof res === 'string') {
              return sanitizeColorString(res, false);
            }
            return res;
          };
        }

        if (typeof value === 'string') {
          return sanitizeColorString(value, false);
        }

        return value;
      }
    });
  };
}

/**
 * Exports one or more HTML elements as a multi-page A4 PDF file.
 * Eliminates all black smudge marks, dark borders, and shadow artifacts.
 */
export async function exportElementsToPDF(
  elementIds: string[],
  options: PDFExportOptions = {}
): Promise<boolean> {
  const {
    fileName = 'Question_Paper.pdf',
    orientation = 'landscape',
    format = 'a4',
  } = options;

  // Intercept window.getComputedStyle during export
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = createSafeGetComputedStyle(originalGetComputedStyle.bind(window));

  try {
    const elements: HTMLElement[] = [];
    for (const id of elementIds) {
      const el = document.getElementById(id);
      if (el) {
        elements.push(el);
      }
    }

    if (elements.length === 0) {
      console.warn('PDF Export: No target elements found for IDs:', elementIds);
      return false;
    }

    // A4 dimensions in mm
    const a4Width = orientation === 'landscape' ? 297 : 210;
    const a4Height = orientation === 'landscape' ? 210 : 297;

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
      compress: true
    });

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      const canvas = await html2canvas(el, {
        scale: 2, // High resolution for crisp Bengali fonts
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: orientation === 'landscape' ? 1200 : 850,
        onclone: (clonedDoc) => {
          // Wrap getComputedStyle inside the cloned iframe/document as well
          if (clonedDoc.defaultView) {
            clonedDoc.defaultView.getComputedStyle = createSafeGetComputedStyle(
              clonedDoc.defaultView.getComputedStyle.bind(clonedDoc.defaultView)
            );
          }

          // Inject absolute clean print/canvas override style to kill all shadow artifacts while preserving vibrant colors
          const overrideStyle = clonedDoc.createElement('style');
          overrideStyle.innerHTML = `
            * {
              box-shadow: none !important;
              text-shadow: none !important;
              filter: none !important;
              backdrop-filter: none !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .shadow-2xl, .shadow-xl, .shadow-lg, .shadow-md, .shadow-sm, .shadow-xs, .shadow-2xs {
              box-shadow: none !important;
            }
            #booklet-sheet-1, #booklet-sheet-2, #printable-exam-paper, .booklet-print-sheet, .a4-preview-page {
              background-color: #ffffff !important;
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
            }
            #official-certificate-sheet {
              background-color: #ffffff !important;
              box-shadow: none !important;
              margin: 0 auto !important;
            }
            #cert-title-badge {
              display: inline-block !important;
              margin: 10px auto !important;
              padding: 10px 42px !important;
              box-sizing: border-box !important;
              text-align: center !important;
              vertical-align: middle !important;
              float: none !important;
              line-height: 1.25 !important;
            }
            #cert-title-badge * {
              box-sizing: border-box !important;
              text-align: center !important;
              vertical-align: middle !important;
            }
            #cert-title-badge h2 {
              margin: 0 !important;
              padding: 0 !important;
              line-height: 1.25 !important;
              display: inline-block !important;
            }
            #cert-title-badge p {
              margin: 4px 0 0 0 !important;
              padding: 0 !important;
              line-height: 1.2 !important;
            }
            #official-certificate-sheet strong,
            #official-certificate-sheet u,
            #official-certificate-sheet span,
            #official-certificate-sheet p {
              text-decoration: none !important;
              text-decoration-line: none !important;
            }
            .admit-card-sheet, #printable-omr-sheet, #printable-answer-key {
              background-color: #ffffff !important;
              box-shadow: none !important;
              margin: 0 auto !important;
            }
            .no-print, .print\\:hidden {
              display: none !important;
            }
          `;
          clonedDoc.head.appendChild(overrideStyle);

          // Sanitize all cloned elements
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((node) => {
            const htmlNode = node as HTMLElement;
            // Force pure white backgrounds on sheet wrappers
            if (
              htmlNode.id === 'booklet-sheet-1' || 
              htmlNode.id === 'booklet-sheet-2' || 
              htmlNode.id === 'printable-exam-paper' ||
              htmlNode.classList?.contains('booklet-print-sheet') || 
              htmlNode.classList?.contains('a4-preview-page')
            ) {
              htmlNode.style.backgroundColor = '#ffffff';
              htmlNode.style.boxShadow = 'none';
            }

            // Remove any inline shadow/filter
            if (htmlNode.style) {
              htmlNode.style.boxShadow = 'none';
              htmlNode.style.textShadow = 'none';
              htmlNode.style.filter = 'none';

              for (let s = 0; s < htmlNode.style.length; s++) {
                const propName = htmlNode.style[s];
                const val = htmlNode.style.getPropertyValue(propName);
                if (val && (val.includes('oklch') || val.includes('oklab') || val.includes('color(') || val.includes('color-mix'))) {
                  htmlNode.style.setProperty(propName, sanitizeColorString(val));
                }
              }
            }
          });

          // Sanitize style tags
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((tag) => {
            if (tag.textContent && (tag.textContent.includes('oklch') || tag.textContent.includes('oklab') || tag.textContent.includes('color-mix'))) {
              tag.textContent = sanitizeColorString(tag.textContent);
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const contentHeightMm = (canvas.height * a4Width) / canvas.width;

      // Single-page or landscape sheet (fits in one page)
      if (orientation === 'landscape' || contentHeightMm <= a4Height * 1.1) {
        if (i > 0) {
          pdf.addPage(format, orientation);
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, a4Width, a4Height, undefined, 'FAST');
      } else {
        // Multi-page portrait splitting for tall exam papers
        const pageCanvasHeight = (canvas.width * a4Height) / a4Width;
        let remainingHeight = canvas.height;
        let sourceY = 0;
        let pageIndex = 0;

        while (remainingHeight > 0) {
          if (i > 0 || pageIndex > 0) {
            pdf.addPage(format, orientation);
          }

          const chunkHeight = Math.min(remainingHeight, pageCanvasHeight);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = pageCanvasHeight;
          const sliceCtx = sliceCanvas.getContext('2d');

          if (sliceCtx) {
            sliceCtx.fillStyle = '#ffffff';
            sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
            sliceCtx.drawImage(
              canvas,
              0, sourceY, canvas.width, chunkHeight,
              0, 0, canvas.width, chunkHeight
            );
          }

          const sliceImg = sliceCanvas.toDataURL('image/jpeg', 0.98);
          pdf.addImage(sliceImg, 'JPEG', 0, 0, a4Width, a4Height, undefined, 'FAST');

          sourceY += chunkHeight;
          remainingHeight -= chunkHeight;
          pageIndex++;
        }
      }
    }

    const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(safeFileName);
    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  } finally {
    // Restore original window.getComputedStyle
    window.getComputedStyle = originalGetComputedStyle;
  }
}
