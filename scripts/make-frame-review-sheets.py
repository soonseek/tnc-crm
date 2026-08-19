from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "artifacts" / "frames"
OUTPUT = ROOT / "artifacts" / "review-sheets"

GROUPS = {
    "01-access": ["login.png"],
    "02-tasks": ["home.png", "notifications.png", "tasks--*.png"],
    "03-sales": ["pipeline*.png", "deals--*.png", "deals--new.png"],
    "04-companies": ["companies*.png"],
    "05-billing": ["billing.png", "contracts*.png", "invoices*.png"],
    "06-performance": ["performance.png"],
    "07-approvals": ["approvals*.png"],
    "08-management": ["more*.png"],
    "09-review-index": ["frames.png"],
}


def collect(patterns: list[str]) -> list[Path]:
    files: dict[str, Path] = {}
    for pattern in patterns:
        for file in SOURCE.glob(pattern):
            files[file.name] = file
    return [files[name] for name in sorted(files)]


def make_sheet(name: str, files: list[Path]) -> None:
    columns = min(3, max(1, len(files)))
    cell_width = 320
    preview_height = 540
    label_height = 42
    rows = (len(files) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * cell_width, rows * (preview_height + label_height)), "#e5e5e5")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=16)

    for index, file in enumerate(files):
        image = Image.open(file).convert("RGB")
        crop_height = min(image.height, int(image.width * 1.75))
        image = image.crop((0, 0, image.width, crop_height))
        image.thumbnail((cell_width - 16, preview_height - 16), Image.Resampling.LANCZOS)

        column = index % columns
        row = index // columns
        x = column * cell_width + (cell_width - image.width) // 2
        y = row * (preview_height + label_height) + 8
        sheet.paste(image, (x, y))
        draw.text((column * cell_width + 10, y + preview_height), file.stem, fill="#111111", font=font)

    sheet.save(OUTPUT / f"{name}.jpg", quality=90, optimize=True)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, patterns in GROUPS.items():
        make_sheet(name, collect(patterns))


if __name__ == "__main__":
    main()
