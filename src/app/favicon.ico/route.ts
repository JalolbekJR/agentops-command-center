const ICON_SIZE = 16;
const ICO_HEADER_BYTES = 22;
const DIB_HEADER_BYTES = 40;
const PIXEL_BYTES = ICON_SIZE * ICON_SIZE * 4;
const MASK_BYTES = (ICON_SIZE * ICON_SIZE) / 8;
const IMAGE_BYTES = DIB_HEADER_BYTES + PIXEL_BYTES + MASK_BYTES;

function writeUint16(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >> 8) & 0xff;
}

function writeUint32(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >> 8) & 0xff;
  bytes[offset + 2] = (value >> 16) & 0xff;
  bytes[offset + 3] = (value >> 24) & 0xff;
}

function createFavicon() {
  const bytes = new Uint8Array(ICO_HEADER_BYTES + IMAGE_BYTES);

  writeUint16(bytes, 2, 1);
  writeUint16(bytes, 4, 1);
  bytes[6] = ICON_SIZE;
  bytes[7] = ICON_SIZE;
  writeUint16(bytes, 10, 1);
  writeUint16(bytes, 12, 32);
  writeUint32(bytes, 14, IMAGE_BYTES);
  writeUint32(bytes, 18, ICO_HEADER_BYTES);

  const dibOffset = ICO_HEADER_BYTES;
  writeUint32(bytes, dibOffset, DIB_HEADER_BYTES);
  writeUint32(bytes, dibOffset + 4, ICON_SIZE);
  writeUint32(bytes, dibOffset + 8, ICON_SIZE * 2);
  writeUint16(bytes, dibOffset + 12, 1);
  writeUint16(bytes, dibOffset + 14, 32);
  writeUint32(bytes, dibOffset + 20, PIXEL_BYTES);

  const pixelOffset = dibOffset + DIB_HEADER_BYTES;
  const colors = [
    [232, 238, 247, 255],
    [113, 128, 150, 255],
    [24, 30, 42, 255]
  ];

  for (let y = 0; y < ICON_SIZE; y += 1) {
    for (let x = 0; x < ICON_SIZE; x += 1) {
      const rowFromBottom = ICON_SIZE - 1 - y;
      const offset = pixelOffset + (rowFromBottom * ICON_SIZE + x) * 4;
      const isBorder = x === 0 || y === 0 || x === ICON_SIZE - 1 || y === ICON_SIZE - 1;
      const isMark = (x >= 4 && x <= 6 && y >= 4 && y <= 11) || (x >= 9 && x <= 11 && y >= 4 && y <= 11) || (x >= 5 && x <= 10 && y >= 3 && y <= 5);
      const [red, green, blue, alpha] = isMark ? colors[0] : isBorder ? colors[1] : colors[2];

      bytes[offset] = blue;
      bytes[offset + 1] = green;
      bytes[offset + 2] = red;
      bytes[offset + 3] = alpha;
    }
  }

  return bytes;
}

const faviconBytes = createFavicon();

export function GET() {
  return new Response(faviconBytes, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/x-icon"
    }
  });
}
