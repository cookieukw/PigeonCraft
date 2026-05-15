export class Color {
  static get(a: number, b: number, c: number, d: number): number {
    return (Color.getIndex(d) << 24) | (Color.getIndex(c) << 16) | (Color.getIndex(b) << 8) | Color.getIndex(a);
  }

  static getIndex(d: number): number {
    if (d < 0) return 255;
    let r = Math.floor(d / 100) % 10;
    let g = Math.floor(d / 10) % 10;
    let b = d % 10;
    return r * 36 + g * 6 + b;
  }
}
