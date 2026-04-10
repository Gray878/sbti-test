import { ComputedSbtiResult, sbtiData } from "@/lib/sbti";

export interface SbtiPosterCopy {
  posterTitle: string;
  posterSummaryTitle: string;
  posterDimensionsTitle: string;
  posterFooter: string;
  scoreUnit: string;
}

const POSTER_WIDTH = 1080;
const MIN_POSTER_HEIGHT = 1920;
const OUTER_GAP = 48;
const CONTENT_X = 112;
const CONTENT_WIDTH = POSTER_WIDTH - CONTENT_X * 2;
const FONT_STACK =
  '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", sans-serif';

interface TextBlockOptions {
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  font: string;
  lineHeight: number;
  color: string;
  align?: CanvasTextAlign;
  maxLines?: number;
}

function roundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | CanvasGradient
) {
  context.save();
  context.fillStyle = fillStyle;
  roundedRectPath(context, x, y, width, height, radius);
  context.fill();
  context.restore();
}

function strokeRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle: string,
  lineWidth: number
) {
  context.save();
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  roundedRectPath(context, x, y, width, height, radius);
  context.stroke();
  context.restore();
}

function clampLine(context: CanvasRenderingContext2D, line: string, maxWidth: number) {
  if (context.measureText(line).width <= maxWidth) {
    return line;
  }

  let next = line;

  while (next.length > 0 && context.measureText(`${next}...`).width > maxWidth) {
    next = next.slice(0, -1);
  }

  return `${next.trimEnd()}...`;
}

function getTextLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines?: number
) {
  const rawLines: string[] = [];

  for (const paragraph of text.split("\n")) {
    if (!paragraph.trim()) {
      rawLines.push("");
      continue;
    }

    let current = "";

    for (const character of Array.from(paragraph)) {
      const next = `${current}${character}`;

      if (!current || context.measureText(next).width <= maxWidth) {
        current = next;
        continue;
      }

      rawLines.push(current.trimEnd());
      current = character;
    }

    if (current) {
      rawLines.push(current.trimEnd());
    }
  }

  if (!maxLines || rawLines.length <= maxLines) {
    return rawLines;
  }

  const lines = rawLines.slice(0, maxLines);
  lines[maxLines - 1] = clampLine(context, lines[maxLines - 1], maxWidth);
  return lines;
}

function measureTextHeight(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string,
  lineHeight: number,
  maxLines?: number
) {
  context.save();
  context.font = font;
  const height = getTextLines(context, text, maxWidth, maxLines).length * lineHeight;
  context.restore();
  return height;
}

function drawTextBlock(context: CanvasRenderingContext2D, options: TextBlockOptions) {
  context.save();
  context.font = options.font;
  context.fillStyle = options.color;
  context.textAlign = options.align ?? "left";
  context.textBaseline = "top";

  const lines = getTextLines(context, options.text, options.maxWidth, options.maxLines);

  lines.forEach((line, index) => {
    const drawX =
      (options.align ?? "left") === "center"
        ? options.x + options.maxWidth / 2
        : options.x;
    context.fillText(line, drawX, options.y + index * options.lineHeight);
  });

  context.restore();

  return options.y + lines.length * options.lineHeight;
}

function drawImageContain(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const ratio = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * ratio;
  const drawHeight = image.naturalHeight * ratio;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  context.save();
  roundedRectPath(context, x, y, width, height, radius);
  context.clip();
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  context.restore();
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load poster image: ${src}`));
    image.decoding = "async";
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to export poster."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

export async function buildSbtiSharePoster(result: ComputedSbtiResult, copy: SbtiPosterCopy) {
  const canvas = document.createElement("canvas");
  canvas.width = POSTER_WIDTH;
  canvas.height = MIN_POSTER_HEIGHT;

  let context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available.");
  }

  const headerBlockHeight = 84;
  const sectionGap = 28;
  const posterImageHeight = 648;
  const introTextHeight = measureTextHeight(
    context,
    result.finalType.intro,
    CONTENT_WIDTH - 72,
    `600 32px ${FONT_STACK}`,
    42,
    2
  );
  const heroCardHeight = 30 + posterImageHeight + 28 + introTextHeight + 36;
  const subTextHeight = measureTextHeight(
    context,
    result.sub,
    CONTENT_WIDTH - 72,
    `500 28px ${FONT_STACK}`,
    40
  );
  const summaryTextHeight = measureTextHeight(
    context,
    result.finalType.desc,
    CONTENT_WIDTH - 68,
    `500 25px ${FONT_STACK}`,
    36
  );
  const typeCardHeight = Math.max(320, 262 + subTextHeight);
  const summaryCardHeight = Math.max(220, 88 + summaryTextHeight + 42);
  const footerY =
    112 +
    headerBlockHeight +
    heroCardHeight +
    sectionGap +
    typeCardHeight +
    sectionGap +
    summaryCardHeight +
    44;
  const posterHeight = Math.max(MIN_POSTER_HEIGHT, footerY + 84);

  if (posterHeight !== canvas.height) {
    canvas.height = posterHeight;
    context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas is not available.");
    }
  }

  const background = context.createLinearGradient(0, 0, POSTER_WIDTH, posterHeight);
  background.addColorStop(0, "#f7fcf7");
  background.addColorStop(0.5, "#edf5ee");
  background.addColorStop(1, "#e4efe6");
  context.fillStyle = background;
  context.fillRect(0, 0, POSTER_WIDTH, posterHeight);

  const glowA = context.createRadialGradient(200, 220, 0, 200, 220, 360);
  glowA.addColorStop(0, "rgba(108, 141, 113, 0.18)");
  glowA.addColorStop(1, "rgba(108, 141, 113, 0)");
  context.fillStyle = glowA;
  context.fillRect(0, 0, POSTER_WIDTH, posterHeight);

  const glowB = context.createRadialGradient(920, posterHeight - 420, 0, 920, posterHeight - 420, 420);
  glowB.addColorStop(0, "rgba(181, 212, 186, 0.22)");
  glowB.addColorStop(1, "rgba(181, 212, 186, 0)");
  context.fillStyle = glowB;
  context.fillRect(0, 0, POSTER_WIDTH, posterHeight);

  const cardGradient = context.createLinearGradient(
    OUTER_GAP,
    OUTER_GAP,
    OUTER_GAP,
    posterHeight - OUTER_GAP
  );
  cardGradient.addColorStop(0, "rgba(255, 255, 255, 0.97)");
  cardGradient.addColorStop(1, "rgba(249, 252, 249, 0.97)");

  context.save();
  context.shadowColor = "rgba(47, 73, 55, 0.14)";
  context.shadowBlur = 60;
  context.shadowOffsetY = 18;
  fillRoundedRect(
    context,
    OUTER_GAP,
    OUTER_GAP,
    POSTER_WIDTH - OUTER_GAP * 2,
    posterHeight - OUTER_GAP * 2,
    48,
    cardGradient
  );
  context.restore();
  strokeRoundedRect(
    context,
    OUTER_GAP,
    OUTER_GAP,
    POSTER_WIDTH - OUTER_GAP * 2,
    posterHeight - OUTER_GAP * 2,
    48,
    "rgba(108, 141, 113, 0.14)",
    2
  );

  let cursorY = 112;

  fillRoundedRect(context, CONTENT_X, cursorY, 146, 54, 27, "rgba(108, 141, 113, 0.14)");
  context.save();
  context.textBaseline = "middle";
  context.font = `700 28px ${FONT_STACK}`;
  context.fillStyle = "#4d6a53";
  context.textAlign = "center";
  context.fillText("SBTI", CONTENT_X + 73, cursorY + 27);
  context.font = `600 28px ${FONT_STACK}`;
  context.fillStyle = "#5f7966";
  context.textAlign = "left";
  context.fillText(copy.posterTitle, CONTENT_X + 176, cursorY + 27);
  context.restore();
  cursorY += headerBlockHeight;

  const heroCardGradient = context.createLinearGradient(
    CONTENT_X,
    cursorY,
    CONTENT_X,
    cursorY + heroCardHeight
  );
  heroCardGradient.addColorStop(0, "rgba(255, 255, 255, 0.98)");
  heroCardGradient.addColorStop(1, "rgba(245, 250, 246, 0.98)");

  context.save();
  context.shadowColor = "rgba(47, 73, 55, 0.08)";
  context.shadowBlur = 32;
  context.shadowOffsetY = 12;
  fillRoundedRect(context, CONTENT_X, cursorY, CONTENT_WIDTH, heroCardHeight, 38, heroCardGradient);
  context.restore();
  strokeRoundedRect(
    context,
    CONTENT_X,
    cursorY,
    CONTENT_WIDTH,
    heroCardHeight,
    38,
    "rgba(108, 141, 113, 0.16)",
    2
  );

  const posterFrameX = CONTENT_X + 28;
  const posterFrameY = cursorY + 30;
  const posterFrameWidth = CONTENT_WIDTH - 56;
  const posterFrameGradient = context.createLinearGradient(
    posterFrameX,
    posterFrameY,
    posterFrameX,
    posterFrameY + posterImageHeight
  );
  posterFrameGradient.addColorStop(0, "#f8fbf8");
  posterFrameGradient.addColorStop(1, "#eef5ef");
  fillRoundedRect(
    context,
    posterFrameX,
    posterFrameY,
    posterFrameWidth,
    posterImageHeight,
    30,
    posterFrameGradient
  );
  strokeRoundedRect(
    context,
    posterFrameX,
    posterFrameY,
    posterFrameWidth,
    posterImageHeight,
    30,
    "rgba(108, 141, 113, 0.18)",
    2
  );

  const posterSrc = sbtiData.typeImages[result.finalType.code];

  if (posterSrc) {
    try {
      const posterImage = await loadImage(posterSrc);
      drawImageContain(
        context,
        posterImage,
        posterFrameX + 18,
        posterFrameY + 18,
        posterFrameWidth - 36,
        posterImageHeight - 36,
        24
      );
    } catch {
      context.save();
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `700 64px ${FONT_STACK}`;
      context.fillStyle = "#5f7966";
      context.fillText(
        result.finalType.code,
        posterFrameX + posterFrameWidth / 2,
        posterFrameY + posterImageHeight / 2
      );
      context.restore();
    }
  } else {
    context.save();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `700 64px ${FONT_STACK}`;
    context.fillStyle = "#5f7966";
    context.fillText(
      result.finalType.code,
      posterFrameX + posterFrameWidth / 2,
      posterFrameY + posterImageHeight / 2
    );
    context.restore();
  }

  drawTextBlock(context, {
    text: result.finalType.intro,
    x: CONTENT_X + 36,
    y: posterFrameY + posterImageHeight + 28,
    maxWidth: CONTENT_WIDTH - 72,
    font: `600 32px ${FONT_STACK}`,
    lineHeight: 42,
    color: "#566d5d",
    maxLines: 2,
  });

  cursorY += heroCardHeight + sectionGap;

  const typeCardGradient = context.createLinearGradient(
    CONTENT_X,
    cursorY,
    CONTENT_X,
    cursorY + typeCardHeight
  );
  typeCardGradient.addColorStop(0, "rgba(255, 255, 255, 0.98)");
  typeCardGradient.addColorStop(1, "rgba(248, 252, 249, 0.98)");
  fillRoundedRect(context, CONTENT_X, cursorY, CONTENT_WIDTH, typeCardHeight, 34, typeCardGradient);
  strokeRoundedRect(
    context,
    CONTENT_X,
    cursorY,
    CONTENT_WIDTH,
    typeCardHeight,
    34,
    "rgba(108, 141, 113, 0.16)",
    2
  );

  context.save();
  context.textBaseline = "top";
  context.font = `600 24px ${FONT_STACK}`;
  context.fillStyle = "#59705f";
  context.fillText(result.modeKicker, CONTENT_X + 36, cursorY + 34);
  context.restore();

  context.save();
  context.textBaseline = "top";
  context.font = `800 78px ${FONT_STACK}`;
  context.fillStyle = "#1e2a22";
  const codeWidth = context.measureText(result.finalType.code).width;
  context.fillText(result.finalType.code, CONTENT_X + 36, cursorY + 78);
  context.font = `700 50px ${FONT_STACK}`;
  context.fillStyle = "#35503c";
  const typeCnText = `（${result.finalType.cn}）`;
  const cnWidth = context.measureText(typeCnText).width;
  const cnX = Math.min(CONTENT_X + 36 + codeWidth + 24, CONTENT_X + CONTENT_WIDTH - 36 - cnWidth);
  context.fillText(typeCnText, cnX, cursorY + 96);
  context.restore();

  context.save();
  context.font = `700 28px ${FONT_STACK}`;
  const badgeWidth = Math.min(
    Math.max(context.measureText(result.badge).width + 52, 280),
    CONTENT_WIDTH - 72
  );
  context.restore();
  fillRoundedRect(context, CONTENT_X + 36, cursorY + 188, badgeWidth, 68, 34, "#e8f3ea");
  strokeRoundedRect(
    context,
    CONTENT_X + 36,
    cursorY + 188,
    badgeWidth,
    68,
    34,
    "rgba(108, 141, 113, 0.16)",
    2
  );
  drawTextBlock(context, {
    text: result.badge,
    x: CONTENT_X + 60,
    y: cursorY + 204,
    maxWidth: badgeWidth - 48,
    font: `700 28px ${FONT_STACK}`,
    lineHeight: 32,
    color: "#4d6a53",
    maxLines: 2,
  });

  drawTextBlock(context, {
    text: result.sub,
    x: CONTENT_X + 36,
    y: cursorY + 284,
    maxWidth: CONTENT_WIDTH - 72,
    font: `500 28px ${FONT_STACK}`,
    lineHeight: 40,
    color: "#66786d",
  });

  cursorY += typeCardHeight + sectionGap;

  fillRoundedRect(context, CONTENT_X, cursorY, CONTENT_WIDTH, summaryCardHeight, 30, "#ffffff");
  strokeRoundedRect(
    context,
    CONTENT_X,
    cursorY,
    CONTENT_WIDTH,
    summaryCardHeight,
    30,
    "rgba(108, 141, 113, 0.14)",
    2
  );

  context.save();
  context.textBaseline = "top";
  context.font = `700 32px ${FONT_STACK}`;
  context.fillStyle = "#1e2a22";
  context.fillText(copy.posterSummaryTitle, CONTENT_X + 34, cursorY + 32);
  context.restore();

  drawTextBlock(context, {
    text: result.finalType.desc,
    x: CONTENT_X + 34,
    y: cursorY + 84,
    maxWidth: CONTENT_WIDTH - 68,
    font: `500 25px ${FONT_STACK}`,
    lineHeight: 36,
    color: "#415348",
  });

  context.save();
  context.strokeStyle = "rgba(108, 141, 113, 0.16)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(CONTENT_X, footerY - 24);
  context.lineTo(CONTENT_X + CONTENT_WIDTH, footerY - 24);
  context.stroke();
  context.restore();

  context.save();
  context.textBaseline = "top";
  context.font = `700 24px ${FONT_STACK}`;
  const footerTitleWidth = context.measureText(copy.posterFooter).width;
  context.font = `500 18px ${FONT_STACK}`;
  const footerDomainWidth = context.measureText("sbtitest.com").width;
  context.font = `500 20px ${FONT_STACK}`;
  const footerGapWidth = context.measureText(" | ").width;
  const footerTotalWidth = footerTitleWidth + footerGapWidth + footerDomainWidth;
  let footerX = POSTER_WIDTH / 2 - footerTotalWidth / 2;

  context.font = `700 24px ${FONT_STACK}`;
  context.fillStyle = "#35503c";
  context.fillText(copy.posterFooter, footerX, footerY);
  footerX += footerTitleWidth;

  context.font = `500 20px ${FONT_STACK}`;
  context.fillStyle = "#7a887d";
  context.fillText(" | ", footerX, footerY + 1);
  footerX += footerGapWidth;

  context.font = `500 18px ${FONT_STACK}`;
  context.fillStyle = "#607263";
  context.fillText("sbtitest.com", footerX, footerY + 4);
  context.restore();

  return canvasToBlob(canvas);
}
