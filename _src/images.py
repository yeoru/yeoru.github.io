"""
Turns an original photo (any size) into web images for the site.

    pip install pillow                       (once)

    python _src/images.py painting  "C:/originals/my-painting.jpg"  my-painting
        -> assets/img/painting/my-painting.webp      (large, for the viewer)
        -> assets/img/painting/my-painting-s.webp    (small, for the grid)

    python _src/images.py media  "C:/originals/photo.jpg"  new-work/03
        -> assets/img/media/new-work/03.webp  and  03-s.webp

Then add the name to content.py and run:  python _src/build.py
Keep the originals outside the repository (they are far too big for the web).
"""
import os
import sys

from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def save(im, path, side, quality):
    im = im.copy()
    im.thumbnail((side, side), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6)
    print("  saved", os.path.relpath(path, ROOT), im.size)


def main():
    if len(sys.argv) != 4 or sys.argv[1] not in ("painting", "media"):
        print(__doc__)
        sys.exit(1)
    kind, src, name = sys.argv[1], sys.argv[2], sys.argv[3]
    im = Image.open(src)
    if max(im.size) > 4000:
        im.draft("RGB", (im.size[0] // 2, im.size[1] // 2))
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, "white" if kind == "painting" else "black")
        bg.paste(im, mask=im.split()[3])
        im = bg
    im = im.convert("RGB")
    base = os.path.join(ROOT, "assets", "img", kind, name)
    save(im, base + ".webp", 2000, 80)
    save(im, base + "-s.webp", 960, 76)


if __name__ == "__main__":
    main()
