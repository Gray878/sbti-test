import { ComputedSbtiResult, sbtiData } from "@/lib/sbti";

export interface SbtiPosterCopy {
  posterTitle: string;
  posterSummaryTitle: string;
  posterDimensionsTitle: string;
  posterFooter: string;
  scoreUnit: string;
}

const POSTER_WIDTH = 1080;
const POSTER_HEIGHT = 1920;
const FONT_STACK =
  '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", sans-serif';

interface PosterTextOptions {
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  font: string;
  lineHeight: number;
  maxLines?: number;
  color: string;
  align?: CanvasTextAlign;
}

function buildRoundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const cappedRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + cappedRadius, y);
  context.lineTo(x + width - cappedRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + cappedRadius);
  context.lineTo(x + width, y + height - cappedRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - cappedRadius, y + height);
  context.lineTo(x + cappedRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - cappedRadius);
  context.lineTo(x, y + cappedRadius);
  context.quadraticCurveTo(x, y, x + cappedRadius, y);
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
  buildRoundedRectPath(context, x, y, width, height, radius);
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
  buildRoundedRectPath(context, x, y, width, height, radius);
  context.stroke();
  context.restore();
}

function clampLine(
  context: CanvasRenderingContext2D,
  line: string,
  maxWidth: number
) {
  if (context.measureText(line).width <= maxWidth) {
    return line;
  }

  let nextLine = line;

  while (nextLine.length > 0 && context.measureText(`${nextLine}…`).width > maxWidth) {
    nextLine = nextLine.slice(0, -1);
  }

  return `${nextLine.trimEnd()}…`;
}

function drawTextBlock(context: CanvasRenderingContext2D, options: PosterTextOptions) {
  const {
    text,
    x,
    y,
    maxWidth,
    font,
    lineHeight,
    maxLines,
    color,
    align = "left",
  } = options;
  const rawLines: string[] = [];

  context.save();
  context.font = font;

  for (const paragraph of text.split("\n")) {
    if (!paragraph.trim()) {
      rawLines.push("");
      continue;
    }

    let currentLine = "";

    for (const character of Array.from(paragraph)) {
      const nextLine = `${currentLine}${character}`;

      if (!currentLine || context.measureText(nextLine).width <= maxWidth) {
        currentLine = nextLine;
        continue;
      }

      rawLines.push(currentLine.trimEnd());
      currentLine = character;
    }

    if (currentLine) {
      rawLines.push(currentLine.trimEnd());
    }
  }

  let lines = rawLines;

  if (maxLines && rawLines.length > maxLines) {
    lines = rawLines.slice(0, maxLines);
    lines[maxLines - 1] = clampLine(context, lines[maxLines - 1], maxWidth);
  }

  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = "top";

  lines.forEach((line, index) => {
    const drawX = align === "center" ? x + maxWidth / 2 : x;
    context.fillText(line, drawX, y + index * lineHeight);
  });

  context.restore();

  return y + lines.length * lineHeight;
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
  buildRoundedRectPath(context, x, y, width, height, radius);
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

export async function buildSbtiSharePoster(
  result: ComputedSbtiResult,
  copy: SbtiPosterCopy
) {
  const canvas = document.createElement("canvas");
  canvas.width = POSTER_WIDTH;
  canvas.height = POSTER_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available.");
  }

  const background = context.createLinearGradient(0, 0, POSTER_WIDTH, POSTER_HEIGHT);
  background.addColorStop(0, "#f7fcf7");
  background.addColorStop(0.5, "#edf5ee");
  background.addColorStop(1, "#e4efe6");
  context.fillStyle = background;
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);

  const glowA = context.createRadialGradient(200, 220, 0, 200, 220, 360);
  glowA.addColorStop(0, "rgba(108, 141, 113, 0.18)");
  glowA.addColorStop(1, "rgba(108, 141, 113, 0)");
  context.fillStyle = glowA;
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);

  const glowB = context.createRadialGradient(920, 1480, 0, 920, 1480, 420);
  glowB.addColorStop(0, "rgba(181, 212, 186, 0.22)");
  glowB.addColorStop(1, "rgba(181, 212, 186, 0)");
  context.fillStyle = glowB;
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);

  const cardX = 48;
  const cardY = 48;
  const cardWidth = POSTER_WIDTH - 96;
  const cardHeight = POSTER_HEIGHT - 96;
  const cardGradient = context.createLinearGradient(cardX, cardY, cardX, cardY + cardHeight);
  cardGradient.addColorStop(0, "rgba(255, 255, 255, 0.97)");
  cardGradient.addColorStop(1, "rgba(249, 252, 249, 0.97)");

  context.save();
  context.shadowColor = "rgba(47, 73, 55, 0.14)";
  context.shadowBlur = 60;
  context.shadowOffsetY = 18;
  fillRoundedRect(context, cardX, cardY, cardWidth, cardHeight, 48, cardGradient);
  context.restore();
  strokeRoundedRect(context, cardX, cardY, cardWidth, cardHeight, 48, "rgba(108, 141, 113, 0.14)", 2);

  const contentX = 112;
  const contentWidth = POSTER_WIDTH - 224;
  let cursorY = 112;

  fillRoundedRect(context, contentX, cursorY, 146, 54, 27, "rgba(108, 141, 113, 0.14)");
  context.save();
  context.font = `700 28px ${FONT_STACK}`;
  context.fillStyle = "#4d6a53";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("SBTI", contentX + 73, cursorY + 27);
  context.restore();
  cursorY += 88;

  context.save();
  context.font = `600 30px ${FONT_STACK}`;
  context.fillStyle = "#5f7966";
  context.textBaseline = "top";
  context.fillText(copy.posterTitle, contentX, cursorY);
  context.restore();
  cursorY += 54;

  context.save();
  context.font = `800 104px ${FONT_STACK}`;
  context.fillStyle = "#1e2a22";
  context.textBaseline = "top";
  context.fillText(result.finalType.code, contentX, cursorY);
  context.restore();
  cursorY += 126;

  context.save();
  context.font = `700 58px ${FONT_STACK}`;
  context.fillStyle = "#39513f";
  context.textBaseline = "top";
  context.fillText(result.finalType.cn, contentX, cursorY);
  context.restore();
  cursorY += 88;

  context.save();
  context.font = `700 28px ${FONT_STACK}`;
  const badgeWidth = Math.min(
    Math.max(context.measureText(result.badge).width + 48, 220),
    contentWidth
  );
  context.restore();
  fillRoundedRect(context, contentX, cursorY, badgeWidth, 60, 30, "#edf6ef");
  context.save();
  context.font = `700 28px ${FONT_STACK}`;
  context.fillStyle = "#4d6a53";
  context.textBaseline = "middle";
  context.fillText(result.badge, contentX + 24, cursorY + 30);
  context.restore();
  cursorY += 94;

  const posterImageY = cursorY;
  const posterImageHeight = 600;
  const posterImageGradient = context.createLinearGradient(
    contentX,
    posterImageY,
    contentX,
    posterImageY + posterImageHeight
  );
  posterImageGradient.addColorStop(0, "#f7fbf8");
  posterImageGradient.addColorStop(1, "#eef5ef");
  fillRoundedRect(
    context,
    contentX,
    posterImageY,
    contentWidth,
    posterImageHeight,
    34,
    posterImageGradient
  );
  strokeRoundedRect(
    context,
    contentX,
    posterImageY,
    contentWidth,
    posterImageHeight,
    34,
    "rgba(108, 141, 113, 0.16)",
    2
  );

  const posterSrc = sbtiData.typeImages[result.finalType.code];

  if (posterSrc) {
    try {
      const posterImage = await loadImage(posterSrc);
      drawImageContain(context, posterImage, contentX + 36, posterImageY + 36, contentWidth - 72, posterImageHeight - 72, 28);
    } catch {
      context.save();
      context.font = `700 64px ${FONT_STACK}`;
      context.fillStyle = "#5f7966";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(result.finalType.code, contentX + contentWidth / 2, posterImageY + posterImageHeight / 2);
      context.restore();
    }
  } else {
    context.save();
    context.font = `700 64px ${FONT_STACK}`;
    context.fillStyle = "#5f7966";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(result.finalType.code, contentX + contentWidth / 2, posterImageY + posterImageHeight / 2);
    context.restore();
  }

  cursorY += posterImageHeight + 28;

  fillRoundedRect(context, contentX, cursorY, contentWidth, 126, 28, "rgba(108, 141, 113, 0.08)");
  drawTextBlock(context, {
    text: result.finalType.intro,
    x: contentX + 32,
    y: cursorY + 32,
    maxWidth: contentWidth - 64,
    font: `600 34px ${FONT_STACK}`,
    lineHeight: 44,
    maxLines: 2,
    color: "#4d6a53",
    align: "center",
  });
  cursorY += 154;

  const summaryCardY = cursorY;
  const summaryCardHeight = 236;
  fillRoundedRect(context, contentX, summaryCardY, contentWidth, summaryCardHeight, 30, "#ffffff");
  strokeRoundedRect(
    context,
    contentX,
    summaryCardY,
    contentWidth,
    summaryCardHeight,
    30,
    "rgba(108, 141, 113, 0.14)",
    2
  );

  context.save();
  context.font = `700 32px ${FONT_STACK}`;
  context.fillStyle = "#1e2a22";
  context.textBaseline = "top";
  context.fillText(copy.posterSummaryTitle, contentX + 34, summaryCardY + 32);
  context.restore();

  drawTextBlock(context, {
    text: result.finalType.desc,
    x: contentX + 34,
    y: summaryCardY + 94,
    maxWidth: contentWidth - 68,
    font: `500 26px ${FONT_STACK}`,
    lineHeight: 38,
    maxLines: 4,
    color: "#415348",
  });
  cursorY += summaryCardHeight + 24;

  const dimensionItems = sbtiData.dimensionOrder
    .map((dimension) => ({
      key: dimension,
      meta: sbtiData.dimensionMeta[dimension],
      score: result.rawScores[dimension],
      level: result.levels[dimension],
    }))
    .sort((left, right) => right.score - left.score || left.key.localeCompare(right.key))
    .slice(0, 2);

  const dimensionRowHeight = 78;
  const dimensionRowGap = 14;
  const dimensionCardHeight =
    92 +
    dimensionItems.length * dimensionRowHeight +
    Math.max(dimensionItems.length - 1, 0) * dimensionRowGap +
    28;
  const dimensionCardY = cursorY;

  fillRoundedRect(
    context,
    contentX,
    dimensionCardY,
    contentWidth,
    dimensionCardHeight,
    30,
    "#ffffff"
  );
  strokeRoundedRect(
    context,
    contentX,
    dimensionCardY,
    contentWidth,
    dimensionCardHeight,
    30,
    "rgba(108, 141, 113, 0.14)",
    2
  );

  context.save();
  context.font = `700 32px ${FONT_STACK}`;
  context.fillStyle = "#1e2a22";
  context.textBaseline = "top";
  context.fillText(copy.posterDimensionsTitle, contentX + 34, dimensionCardY + 32);
  context.restore();

  dimensionItems.forEach((item, index) => {
    const rowY = dimensionCardY + 90 + index * (dimensionRowHeight + dimensionRowGap);

    fillRoundedRect(
      context,
      contentX + 24,
      rowY,
      contentWidth - 48,
      dimensionRowHeight,
      24,
      "rgba(108, 141, 113, 0.08)"
    );

    context.save();
    context.font = `500 18px ${FONT_STACK}`;
    context.fillStyle = "#6a786f";
    context.textBaseline = "top";
    context.fillText(item.meta.model, contentX + 48, rowY + 16);
    context.restore();

    context.save();
    context.font = `700 25px ${FONT_STACK}`;
    context.fillStyle = "#1e2a22";
    context.textBaseline = "top";
    context.fillText(item.meta.name, contentX + 48, rowY + 40);
    context.restore();

    context.save();
    context.font = `700 22px ${FONT_STACK}`;
    const scoreLabel = `${item.level} / ${item.score}${copy.scoreUnit}`;
    const scoreWidth = Math.max(context.measureText(scoreLabel).width + 40, 132);
    const scoreX = contentX + contentWidth - scoreWidth - 48;
    const scoreY = rowY + 14;
    context.restore();

    fillRoundedRect(context, scoreX, scoreY, scoreWidth, 50, 25, "#edf6ef");
    strokeRoundedRect(context, scoreX, scoreY, scoreWidth, 50, 25, "rgba(108, 141, 113, 0.18)", 1.5);

    context.save();
    context.font = `700 22px ${FONT_STACK}`;
    context.fillStyle = "#4d6a53";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(scoreLabel, scoreX + scoreWidth / 2, scoreY + 25);
    context.restore();
  });

  const footerY = POSTER_HEIGHT - 118;
  context.save();
  context.strokeStyle = "rgba(108, 141, 113, 0.16)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(contentX, footerY - 24);
  context.lineTo(contentX + contentWidth, footerY - 24);
  context.stroke();
  context.restore();

  context.save();
  context.textAlign = "center";
  context.textBaseline = "top";
  context.font = `700 24px ${FONT_STACK}`;
  context.fillStyle = "#35503c";
  context.fillText(copy.posterFooter, POSTER_WIDTH / 2, footerY);
  context.font = `500 18px ${FONT_STACK}`;
  context.fillStyle = "#607263";
  context.fillText("sbtitest.com", POSTER_WIDTH / 2, footerY + 34);
  context.restore();

  return canvasToBlob(canvas);
}
