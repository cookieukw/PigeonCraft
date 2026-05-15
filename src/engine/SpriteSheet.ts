export class SpriteSheet {
  public width: number;
  public height: number;
  public pixels: Int32Array;

  constructor(image: HTMLImageElement) {
    this.width = image.width;
    this.height = image.height;
    this.pixels = new Int32Array(this.width * this.height);
    
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, this.width, this.height).data;
    
    for (let i = 0; i < this.pixels.length; i++) {
      // Each pixel in icons.png is grayscale. Map to 0-3 shades.
      this.pixels[i] = Math.floor(data[i * 4] / 64);
    }
  }
}
