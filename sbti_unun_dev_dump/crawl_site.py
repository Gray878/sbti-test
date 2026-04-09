#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse


DEFAULT_URL = "https://sbti.unun.dev/"
DATA_KEYS = [
    "dimensionMeta",
    "questions",
    "specialQuestions",
    "TYPE_LIBRARY",
    "TYPE_IMAGES",
    "NORMAL_TYPES",
    "DIM_EXPLANATIONS",
    "dimensionOrder",
]
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/135.0.0.0 Safari/537.36"
)


class SourceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._in_style = False
        self._in_inline_script = False
        self._style_chunks: list[str] = []
        self._script_chunks: list[str] = []
        self.inline_scripts: list[str] = []
        self.styles: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        attr_map = dict(attrs)
        if tag == "style":
            self._in_style = True
            self._style_chunks = []
        elif tag == "script" and "src" not in attr_map:
            self._in_inline_script = True
            self._script_chunks = []

    def handle_data(self, data: str) -> None:
        if self._in_style:
            self._style_chunks.append(data)
        elif self._in_inline_script:
            self._script_chunks.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "style" and self._in_style:
            self.styles.append("".join(self._style_chunks).strip())
            self._in_style = False
            self._style_chunks = []
        elif tag == "script" and self._in_inline_script:
            self.inline_scripts.append("".join(self._script_chunks).strip())
            self._in_inline_script = False
            self._script_chunks = []


def fetch_bytes(url: str) -> bytes:
    result = subprocess.run(
        [
            "curl.exe",
            "-L",
            "--fail",
            "--silent",
            "--show-error",
            "-A",
            USER_AGENT,
            "-H",
            "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "-H",
            "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8",
            url,
        ],
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.decode("utf-8", errors="replace").strip() or f"curl failed for {url}")
    return result.stdout


def fetch_text(url: str) -> str:
    return fetch_bytes(url).decode("utf-8")


def find_const_start(text: str, const_name: str) -> int:
    match = re.search(rf"\bconst\s+{re.escape(const_name)}\s*=\s*", text)
    if not match:
        raise ValueError(f"Could not find const {const_name!r}")
    return match.end()


def extract_js_literal(text: str, const_name: str) -> str:
    start = find_const_start(text, const_name)
    while start < len(text) and text[start].isspace():
        start += 1

    if start >= len(text) or text[start] not in "[{":
        raise ValueError(f"Const {const_name!r} does not start with '[' or '{{'")

    opener = text[start]
    closer = "]" if opener == "[" else "}"
    depth = 0
    in_string = False
    escaped = False
    quote = ""

    for index in range(start, len(text)):
        char = text[index]

        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                in_string = False
            continue

        if char in ('"', "'"):
            in_string = True
            quote = char
            continue

        if char == opener:
            depth += 1
        elif char == closer:
            depth -= 1
            if depth == 0:
                return text[start : index + 1]

    raise ValueError(f"Could not extract full literal for {const_name!r}")


def parse_js_literal(literal: str, const_name: str):
    node_script = """
const fs = require('fs');
const literal = fs.readFileSync(0, 'utf8');
const value = Function(`return (${literal})`)();
process.stdout.write(JSON.stringify(value));
""".strip()
    result = subprocess.run(
        ["node", "-e", node_script],
        input=literal,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )
    if result.returncode != 0:
        stderr = result.stderr.strip() or f"node failed while parsing {const_name}"
        raise ValueError(stderr)
    return json.loads(result.stdout)


def extract_structured_data(script_text: str) -> dict[str, object]:
    data: dict[str, object] = {}
    for key in DATA_KEYS:
        literal = extract_js_literal(script_text, key)
        data[key] = parse_js_literal(literal, key)
    return data


def safe_name_from_url(url: str) -> str:
    path = urlparse(url).path
    name = Path(path).name
    return name or "downloaded_file"


def ensure_dirs(base_dir: Path) -> dict[str, Path]:
    dirs = {
        "base": base_dir,
        "site": base_dir / "site",
        "source": base_dir / "source",
        "data": base_dir / "data",
        "images": base_dir / "images",
    }
    for path in dirs.values():
        path.mkdir(parents=True, exist_ok=True)
    return dirs


def save_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def save_bytes(path: Path, content: bytes) -> None:
    path.write_bytes(content)


def clean_robots_text(robots_text: str) -> str:
    html_index = robots_text.lower().find("<!doctype html")
    if html_index == -1:
        html_index = robots_text.lower().find("<html")
    if html_index != -1:
        return robots_text[:html_index].rstrip() + "\n"
    return robots_text


def download_images(base_url: str, image_map: dict[str, str], target_dir: Path) -> list[dict[str, str]]:
    downloaded: list[dict[str, str]] = []
    for code, relative_path in image_map.items():
        image_url = urljoin(base_url, relative_path)
        filename = safe_name_from_url(image_url)
        output_path = target_dir / filename
        save_bytes(output_path, fetch_bytes(image_url))
        downloaded.append(
            {
                "code": code,
                "source": image_url,
                "saved_as": str(output_path.relative_to(target_dir.parent)),
            }
        )
    return downloaded


def crawl(url: str, out_dir: Path) -> dict[str, object]:
    dirs = ensure_dirs(out_dir)
    html = fetch_text(url)
    robots_url = urljoin(url, "robots.txt")
    robots_txt_raw = fetch_text(robots_url)
    robots_txt = clean_robots_text(robots_txt_raw)

    save_text(dirs["site"] / "index.html", html)
    save_text(dirs["site"] / "robots_raw.txt", robots_txt_raw)
    save_text(dirs["site"] / "robots.txt", robots_txt)

    parser = SourceParser()
    parser.feed(html)

    inline_css = "\n\n".join(chunk for chunk in parser.styles if chunk)
    inline_js = "\n\n".join(chunk for chunk in parser.inline_scripts if chunk)
    save_text(dirs["source"] / "inline.css", inline_css)
    save_text(dirs["source"] / "app.js", inline_js)

    data = extract_structured_data(inline_js)
    save_text(
        dirs["data"] / "sbti_data.json",
        json.dumps(data, ensure_ascii=False, indent=2),
    )

    images = download_images(url, data["TYPE_IMAGES"], dirs["images"])

    manifest = {
        "target_url": url,
        "saved_files": {
            "index_html": str((dirs["site"] / "index.html").relative_to(out_dir)),
            "robots_txt": str((dirs["site"] / "robots.txt").relative_to(out_dir)),
            "robots_raw_txt": str((dirs["site"] / "robots_raw.txt").relative_to(out_dir)),
            "inline_css": str((dirs["source"] / "inline.css").relative_to(out_dir)),
            "app_js": str((dirs["source"] / "app.js").relative_to(out_dir)),
            "data_json": str((dirs["data"] / "sbti_data.json").relative_to(out_dir)),
        },
        "summary": {
            "styles": len([chunk for chunk in parser.styles if chunk]),
            "inline_scripts": len([chunk for chunk in parser.inline_scripts if chunk]),
            "questions": len(data["questions"]),
            "special_questions": len(data["specialQuestions"]),
            "types": len(data["TYPE_LIBRARY"]),
            "normal_types": len(data["NORMAL_TYPES"]),
            "dimensions": len(data["dimensionMeta"]),
            "images_downloaded": len(images),
        },
        "images": images,
    }
    save_text(
        dirs["data"] / "manifest.json",
        json.dumps(manifest, ensure_ascii=False, indent=2),
    )
    return manifest


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Crawl sbti.unun.dev homepage source and save it into a local folder."
    )
    parser.add_argument("--url", default=DEFAULT_URL, help="Target site URL.")
    parser.add_argument(
        "--out",
        default="output",
        help="Output directory relative to this script.",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    out_dir = (script_dir / args.out).resolve()

    try:
        manifest = crawl(args.url, out_dir)
    except Exception as exc:  # pragma: no cover
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    print(json.dumps(manifest["summary"], ensure_ascii=False, indent=2))
    print(f"Saved to: {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
