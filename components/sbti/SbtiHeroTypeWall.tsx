import type { CSSProperties } from "react";
import { sbtiData } from "@/lib/sbti";
import styles from "./SbtiExperience.module.css";

type HeroDirection = "up" | "down";

interface HeroImage {
  code: string;
  src: string;
}

interface HeroColumnConfig {
  delay: number;
  direction: HeroDirection;
  drift: string;
  duration: number;
  offsetY: string;
  shift: string;
  tilt: string;
}

const HERO_IMAGES: HeroImage[] = Object.entries(sbtiData.typeImages).map(
  ([code, src]) => ({
    code,
    src,
  })
);

const HERO_COLUMN_CONFIGS: readonly HeroColumnConfig[] = [
  {
    duration: 14,
    delay: -11,
    direction: "up",
    drift: "28px",
    tilt: "-14deg",
    offsetY: "-18%",
    shift: "28px",
  },
  {
    duration: 19,
    delay: -6,
    direction: "down",
    drift: "22px",
    tilt: "11deg",
    offsetY: "10%",
    shift: "24px",
  },
  {
    duration: 16,
    delay: -13,
    direction: "up",
    drift: "18px",
    tilt: "-9deg",
    offsetY: "-9%",
    shift: "22px",
  },
  {
    duration: 21,
    delay: -15,
    direction: "down",
    drift: "30px",
    tilt: "14deg",
    offsetY: "16%",
    shift: "30px",
  },
  {
    duration: 15,
    delay: -8,
    direction: "up",
    drift: "24px",
    tilt: "-12deg",
    offsetY: "-11%",
    shift: "26px",
  },
  {
    duration: 18,
    delay: -17,
    direction: "down",
    drift: "20px",
    tilt: "9deg",
    offsetY: "12%",
    shift: "24px",
  },
] as const;

function ensureColumnDensity(images: HeroImage[], seed: number) {
  if (images.length >= 5) {
    return images;
  }

  const nextImages = [...images];
  let cursor = seed;

  while (nextImages.length < 5) {
    nextImages.push(HERO_IMAGES[cursor % HERO_IMAGES.length]);
    cursor += HERO_COLUMN_CONFIGS.length;
  }

  return nextImages;
}

const HERO_COLUMNS = HERO_COLUMN_CONFIGS.map((config, columnIndex) => ({
  ...config,
  images: ensureColumnDensity(
    HERO_IMAGES.filter(
      (_, imageIndex) => imageIndex % HERO_COLUMN_CONFIGS.length === columnIndex
    ),
    columnIndex
  ),
}));

export default function SbtiHeroTypeWall() {
  return (
    <div aria-hidden="true" className={styles.heroBackdrop}>
      {HERO_COLUMNS.map((column, columnIndex) => {
        const columnStyle = {
          "--hero-drift": column.drift,
          "--hero-duration": `${column.duration}s`,
          "--hero-delay": `${column.delay}s`,
          "--hero-offset-y": column.offsetY,
          "--hero-shift": column.shift,
          "--hero-tilt": column.tilt,
        } as CSSProperties;

        return (
          <div
            className={`${styles.heroColumn} ${
              column.direction === "up"
                ? styles.heroColumnUp
                : styles.heroColumnDown
            }`}
            key={`hero-column-${columnIndex}`}
            style={columnStyle}
          >
            <div className={styles.heroColumnTrack}>
              {Array.from({ length: 2 }).map((_, loopIndex) => (
                <div
                  className={styles.heroColumnSet}
                  key={`hero-column-set-${columnIndex}-${loopIndex}`}
                >
                  {column.images.map((image, imageIndex) => (
                    <div
                      className={styles.heroCard}
                      key={`${image.code}-${loopIndex}-${imageIndex}`}
                    >
                      <img
                        alt=""
                        className={styles.heroCardImage}
                        decoding="async"
                        draggable="false"
                        fetchPriority="low"
                        loading="lazy"
                        src={image.src}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
