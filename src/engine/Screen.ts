import { SpriteSheet } from '@/engine/SpriteSheet';

export class Screen {
  public w: number;
  public h: number;
  public sheet: SpriteSheet;
  public pixels: Int32Array;
  public colors: Uint32Array;
  public xOffset: number;
  public yOffset: number;

  constructor(w: number, h: number, sheet: SpriteSheet) {
    this.w = w;
    this.h = h;
    this.sheet = sheet;
    this.pixels = new Int32Array(w * h);
    this.colors = new Uint32Array(256);
    this.xOffset = 0;
    this.yOffset = 0;

    this.initColors();
  }

  initColors(): void {
    let pp = 0;
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        for (let b = 0; b < 6; b++) {
          let rr = Math.floor((r * 255) / 5);
          let gg = Math.floor((g * 255) / 5);
          let bb = Math.floor((b * 255) / 5);
          let mid = Math.floor(((rr * 30) + (gg * 59) + (bb * 11)) / 100);
          let r1 = Math.floor((((mid + rr) / 2) * 230) / 255) + 10;
          let g1 = Math.floor((((mid + gg) / 2) * 230) / 255) + 10;
          let b1 = Math.floor((((mid + bb) / 2) * 230) / 255) + 10;
          this.colors[pp++] = (r1) | (g1 << 8) | (b1 << 16) | (255 << 24);
        }
      }
    }
  }

  clear(color: number): void {
    if (color === 0 && this.pixels.length > 0) {
        this.pixels.fill(0);
        return;
    }
    const rawColor = this.colors[color & 0xff];
    this.pixels.fill(rawColor);
  }

  render(xp: number, yp: number, tile: number, colors: number, bits: number): void {
    xp -= this.xOffset;
    yp -= this.yOffset;
    const mirrorX = (bits & 1) > 0;
    const mirrorY = (bits & 2) > 0;
    const xTile = tile % 32;
    const yTile = Math.floor(tile / 32);
    const toffs = (xTile * 8) + (yTile * 8 * this.sheet.width);

    for (let y = 0; y < 8; y++) {
      let ys = mirrorY ? 7 - y : y;
      let tp = yp + y;
      if (tp < 0 || tp >= this.h) continue;
      
      for (let x = 0; x < 8; x++) {
        let xs = mirrorX ? 7 - x : x;
        let tx = xp + x;
        if (tx < 0 || tx >= this.w) continue;
        
        const shade = this.sheet.pixels[(this.sheet.width * ys) + xs + toffs];
        const colIdx = (colors >> (shade * 8)) & 0xff;
        
        if (colIdx < 255) {
          this.pixels[tx + tp * this.w] = this.colors[colIdx];
        }
      }
    }
  }

  setOffset(x: number, y: number): void {
    this.xOffset = x;
    this.yOffset = y;
  }

  renderLight(x: number, y: number, r: number): void {
    x = Math.floor(x - this.xOffset);
    y = Math.floor(y - this.yOffset);
    let x0 = x - r;
    let x1 = x + r;
    let y0 = y - r;
    let y1 = y + r;
    if (x0 < 0) x0 = 0;
    if (y0 < 0) y0 = 0;
    if (x1 > this.w) x1 = this.w;
    if (y1 > this.h) y1 = this.h;
    
    for (let yy = y0; yy < y1; yy++) {
      let yd = yy - y;
      let yd2 = yd * yd;
      for (let xx = x0; xx < x1; xx++) {
        let xd = xx - x;
        let dist = xd * xd + yd2;
        if (dist <= r * r) {
          let br = 255 - Math.floor((dist * 255) / (r * r));
          if (this.pixels[xx + yy * this.w] < br) {
            this.pixels[xx + yy * this.w] = br;
          }
        }
      }
    }
  }

  overlay(screen2: Screen): void {
    let p1 = this.pixels;
    let p2 = screen2.pixels;
    for (let i = 0; i < p1.length; i++) {
      let br = p2[i] & 0xff;
      if (br > 0) {
        let col = p1[i];
        let r = col & 0xff;
        let g = (col >> 8) & 0xff;
        let b = (col >> 16) & 0xff;
        
        r = Math.floor((r * br) / 255);
        g = Math.floor((g * br) / 255);
        b = Math.floor((b * br) / 255);
        
        p1[i] = r | (g << 8) | (b << 16) | (255 << 24);
      } else {
        p1[i] = 255 << 24; // Black
      }
    }
  }
}
