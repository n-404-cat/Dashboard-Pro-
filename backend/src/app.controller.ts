import { Body, Controller, Get, Header, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('favicon.ico')
  @Header('Content-Type', 'image/x-icon')
  @Header('Cache-Control', 'public, max-age=86400')
  favicon(): Buffer {
    return this.buildFaviconIco();
  }

  @Get('system/ui-config')
  getUiConfig() {
    return this.appService.getConfig();
  }

  @Put('system/ui-config')
  updateUiConfig(@Body() body: any) {
    return this.appService.updateConfig(body);
  }

  @Post('auth/login')
  login(@Body() body: any) {
    return this.appService.login(body);
  }

  private buildFaviconIco(): Buffer {
    const width = 16;
    const height = 16;
    const pixelDataSize = width * height * 4;
    const andMaskRowSize = Math.ceil(width / 32) * 4;
    const andMaskSize = andMaskRowSize * height;
    const dibHeaderSize = 40;
    const imageSize = dibHeaderSize + pixelDataSize + andMaskSize;

    const fileSize = 6 + 16 + imageSize;
    const buf = Buffer.alloc(fileSize);
    let off = 0;

    buf.writeUInt16LE(0, off);
    off += 2;
    buf.writeUInt16LE(1, off);
    off += 2;
    buf.writeUInt16LE(1, off);
    off += 2;

    buf.writeUInt8(width, off++);
    buf.writeUInt8(height, off++);
    buf.writeUInt8(0, off++);
    buf.writeUInt8(0, off++);
    buf.writeUInt16LE(1, off);
    off += 2;
    buf.writeUInt16LE(32, off);
    off += 2;
    buf.writeUInt32LE(imageSize, off);
    off += 4;
    buf.writeUInt32LE(22, off);
    off += 4;

    buf.writeUInt32LE(dibHeaderSize, off);
    off += 4;
    buf.writeInt32LE(width, off);
    off += 4;
    buf.writeInt32LE(height * 2, off);
    off += 4;
    buf.writeUInt16LE(1, off);
    off += 2;
    buf.writeUInt16LE(32, off);
    off += 2;
    buf.writeUInt32LE(0, off);
    off += 4;
    buf.writeUInt32LE(pixelDataSize, off);
    off += 4;
    buf.writeInt32LE(0, off);
    off += 4;
    buf.writeInt32LE(0, off);
    off += 4;
    buf.writeUInt32LE(0, off);
    off += 4;
    buf.writeUInt32LE(0, off);
    off += 4;

    const bg = { b: 0x5f, g: 0x3a, r: 0x1e, a: 0xff };
    const fg = { b: 0xff, g: 0xff, r: 0xff, a: 0xff };
    const accent = { b: 0xd9, g: 0x90, r: 0x4a, a: 0xff };

    const isDStroke = (x: number, y: number) => {
      if (x === 4 && y >= 4 && y <= 11) return true;
      if (y === 4 && x >= 4 && x <= 9) return true;
      if (y === 11 && x >= 4 && x <= 9) return true;
      if (x === 9 && y >= 5 && y <= 10) return true;
      return false;
    };

    const isAccentDot = (x: number, y: number) => (x === 11 && y === 4) || (x === 11 && y === 5);

    const pixelStart = off;
    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const p = pixelStart + ((height - 1 - y) * width + x) * 4;
        let c = bg;
        if (x >= 2 && x <= 13 && y >= 2 && y <= 13) c = { ...bg, b: 0x8a, g: 0x5c, r: 0x2e, a: 0xff };
        if (isDStroke(x, y)) c = fg;
        if (isAccentDot(x, y)) c = accent;
        buf[p] = c.b;
        buf[p + 1] = c.g;
        buf[p + 2] = c.r;
        buf[p + 3] = c.a;
      }
    }

    const andMaskStart = pixelStart + pixelDataSize;
    buf.fill(0x00, andMaskStart, andMaskStart + andMaskSize);

    return buf;
  }
}
