# sbti.unun.dev 抓取目录

这个目录包含：

- `crawl_site.py`：抓取站点源码、页面脚本、样式、数据和图片资源。
- `output/site/`：保存原始页面源码和 `robots.txt`。
- `output/site/robots_raw.txt`：保存站点原始 `robots.txt` 响应，便于排查站点返回异常。
- `output/source/`：从页面中拆出的内联 CSS 和 JS。
- `output/data/`：从页面脚本中提取出的结构化 JSON。
- `output/images/`：页面脚本里引用的人格图片资源。

运行方式：

```bash
python crawl_site.py
```

默认目标站点：

```text
https://sbti.unun.dev/
```

可选参数：

```bash
python crawl_site.py --url https://sbti.unun.dev/ --out output
```
