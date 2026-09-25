import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function createPng(width, height, drawFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per channel
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const ihdrChunk = writeChunk('IHDR', ihdr);

  // Scanlines (Filter 0 + RGBA for each pixel)
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = writeChunk('IDAT', deflated);
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon Drawer: Elegant Emerald Background with Golden Dome and Book Motif
function drawIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Base emerald gradient
  const gradT = (y / h);
  let r = Math.round(4 + gradT * 2);
  let g = Math.round(120 - gradT * 42); // 120 -> 78
  let b = Math.round(87 - gradT * 28);  // 87 -> 59
  let a = 255;

  // Outer border ring
  const ringR = w * 0.44;
  if (Math.abs(dist - ringR) < w * 0.01) {
    // Gold ring
    return [251, 191, 36, 220];
  }

  // Dome shape
  const domeTopY = h * 0.28;
  const domeBaseY = h * 0.52;
  const domeWidth = w * 0.26;
  if (y >= domeTopY && y <= domeBaseY) {
    const normY = (y - domeTopY) / (domeBaseY - domeTopY);
    // parabola / ellipse for dome
    const allowedW = domeWidth * Math.sin(normY * Math.PI * 0.5);
    if (Math.abs(x - cx) <= allowedW) {
      // Golden gradient
      return [245, 158, 11, 255];
    }
  }

  // Crescent moon at top of dome
  const moonCy = h * 0.23;
  const moonDist = Math.sqrt((x - cx) ** 2 + (y - moonCy) ** 2);
  const cutDist = Math.sqrt((x - (cx + w * 0.02)) ** 2 + (y - (moonCy - h * 0.01)) ** 2);
  if (moonDist < w * 0.045 && cutDist >= w * 0.038) {
    return [251, 191, 36, 255];
  }

  // Open book (Quran) shape
  const bookTopY = h * 0.58;
  const bookBottomY = h * 0.74;
  if (y >= bookTopY && y <= bookBottomY) {
    const bookWidth = w * 0.32;
    if (Math.abs(x - cx) <= bookWidth) {
      // White book pages
      if (Math.abs(x - cx) < w * 0.02) {
        // Spine
        return [5, 150, 105, 255];
      }
      return [255, 255, 255, 255];
    }
  }

  // Wooden stand (Rehal)
  const rehalY = h * 0.75;
  if (y >= rehalY && y <= rehalY + h * 0.06) {
    if (Math.abs(x - cx) <= w * 0.18) {
      return [217, 119, 6, 255];
    }
  }

  return [r, g, b, a];
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate required PWA icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, (x, y, w, h) => drawIcon(x, y, w, h)));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, (x, y, w, h) => drawIcon(x, y, w, h)));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, (x, y, w, h) => drawIcon(x, y, w, h, true)));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, (x, y, w, h) => drawIcon(x, y, w, h)));

console.log('Successfully generated all PWA icons in /public!');
