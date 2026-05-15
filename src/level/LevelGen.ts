export const TileIds = {
  grass: 0, rock: 1, water: 2, flower: 3, tree: 4, dirt: 5, sand: 6, cactus: 7,
  hole: 8, lava: 13, stairsDown: 14, stairsUp: 15, cloud: 16, ironOre: 17, goldOre: 18,
  pinetree: 25, snow: 27, snowpinetree: 28
};

export class LevelGen {
  public w: number;
  public h: number;
  public values: Float64Array;

  constructor(w: number, h: number, featureSize: number) {
    this.w = w;
    this.h = h;
    this.values = new Float64Array(w * h);
    
    for (let y = 0; y < h; y += featureSize) {
      for (let x = 0; x < w; x += featureSize) {
        this.setSample(x, y, Math.random() * 2 - 1);
      }
    }

    let stepSize = featureSize;
    let scale = 1.0 / w;
    let scaleMod = 1.0;
    
    do {
      let halfStep = stepSize / 2;
      for (let y = 0; y < h; y += stepSize) {
        for (let x = 0; x < w; x += stepSize) {
          let a = this.sample(x, y);
          let b = this.sample(x + stepSize, y);
          let c = this.sample(x, y + stepSize);
          let d = this.sample(x + stepSize, y + stepSize);
          let e = (a + b + c + d) / 4.0 + (Math.random() * 2 - 1) * stepSize * scale;
          this.setSample(x + halfStep, y + halfStep, e);
        }
      }
      for (let y = 0; y < h; y += stepSize) {
        for (let x = 0; x < w; x += stepSize) {
          let a = this.sample(x, y);
          let b = this.sample(x + stepSize, y);
          let c = this.sample(x, y + stepSize);
          let d = this.sample(x + halfStep, y + halfStep);
          let e = this.sample(x + halfStep, y - halfStep);
          let f = this.sample(x - halfStep, y + halfStep);
          
          let H = (a + b + d + e) / 4.0 + (Math.random() * 2 - 1) * stepSize * scale * 0.5;
          let g = (a + c + d + f) / 4.0 + (Math.random() * 2 - 1) * stepSize * scale * 0.5;
          this.setSample(x + halfStep, y, H);
          this.setSample(x, y + halfStep, g);
        }
      }
      stepSize /= 2;
      scale *= (0.8 + scaleMod);
      scaleMod *= 0.3;
    } while (stepSize > 1);
  }

  public sample(x: number, y: number): number {
    return this.values[(x & (this.w - 1)) + (y & (this.h - 1)) * this.w];
  }

  public setSample(x: number, y: number, value: number): void {
    this.values[(x & (this.w - 1)) + (y & (this.h - 1)) * this.w] = value;
  }

  public static createTopMap(w: number, h: number): { map: Uint8Array, data: Uint8Array } {
    const mnoise1 = new LevelGen(w, h, 16);
    const mnoise2 = new LevelGen(w, h, 16);
    const mnoise3 = new LevelGen(w, h, 16);
    const noise1 = new LevelGen(w, h, 32);
    const noise2 = new LevelGen(w, h, 32);
    
    const map = new Uint8Array(w * h);
    const data = new Uint8Array(w * h);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let i = x + y * w;
        let val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;
        let mval = Math.abs(mnoise1.values[i] - mnoise2.values[i]);
        let mval2 = Math.abs(mval - mnoise3.values[i]) * 3 - 2;
        
        let xd = (x / (w - 1)) * 2 - 1;
        let yd = (y / (h - 1)) * 2 - 1;
        if (xd < 0) xd = -xd;
        if (yd < 0) yd = -yd;
        let dist = Math.max(xd, yd);
        let dist2 = dist * dist * dist * dist;
        let val2 = (1.0 + val) - (20.0 * (dist2 * dist2 * dist2 * dist2));
        
        if (val2 < -0.5) {
          map[i] = TileIds.water;
        } else if (val2 > 0.5 && mval2 < -1.5) {
          map[i] = TileIds.rock;
        } else {
          map[i] = TileIds.grass;
        }
      }
    }

    // Add sand
    for (let i = 0; i < (w * h) / 2800; i++) {
        let xs = Math.floor(Math.random() * w);
        let ys = Math.floor(Math.random() * h);
        for (let k = 0; k < 10; k++) {
            let x2 = Math.floor(Math.random() * 21) + xs - 10;
            let y2 = Math.floor(Math.random() * 21) + ys - 10;
            for (let j = 0; j < 100; j++) {
                let xo = Math.floor(Math.random() * 5) + x2 - Math.floor(Math.random() * 5);
                let yo = Math.floor(Math.random() * 5) + y2 - Math.floor(Math.random() * 5);
                for (let yy = yo - 1; yy <= yo + 1; yy++) {
                    for (let xx = xo - 1; xx <= xo + 1; xx++) {
                        if (xx >= 0 && yy >= 0 && xx < w && yy < h && map[yy * w + xx] === TileIds.grass) {
                            map[yy * w + xx] = TileIds.sand;
                        }
                    }
                }
            }
        }
    }

    // Add trees
    for (let i = 0; i < (w * h) / 400; i++) {
        let x = Math.floor(Math.random() * w);
        let y = Math.floor(Math.random() * h);
        for (let j = 0; j < 200; j++) {
            let xx = Math.floor(Math.random() * 15) + x - Math.floor(Math.random() * 15);
            let yy = Math.floor(Math.random() * 15) + y - Math.floor(Math.random() * 15);
            if (xx >= 0 && yy >= 0 && xx < w && yy < h && map[yy * w + xx] === TileIds.grass) {
                map[yy * w + xx] = TileIds.tree;
            }
        }
    }

    // Add flowers
    for (let i = 0; i < (w * h) / 400; i++) {
        let x = Math.floor(Math.random() * w);
        let y = Math.floor(Math.random() * h);
        for (let j = 0; j < 30; j++) {
            let xx = Math.floor(Math.random() * 5) + x - Math.floor(Math.random() * 5);
            let yy = Math.floor(Math.random() * 5) + y - Math.floor(Math.random() * 5);
            if (xx >= 0 && yy >= 0 && xx < w && yy < h && map[yy * w + xx] === TileIds.grass) {
                map[yy * w + xx] = TileIds.flower;
            }
        }
    }

    // Add cactus
    for (let i = 0; i < (w * h) / 100; i++) {
        let xx = Math.floor(Math.random() * w);
        let yy = Math.floor(Math.random() * h);
        if (xx >= 0 && yy >= 0 && xx < w && yy < h && map[yy * w + xx] === TileIds.sand) {
            map[yy * w + xx] = TileIds.cactus;
        }
    }


    return { map, data };
  }

  public static createUndergroundMap(w: number, h: number, depth: number): { map: Uint8Array, data: Uint8Array } {
    const mnoise1 = new LevelGen(w, h, 16);
    const mnoise2 = new LevelGen(w, h, 16);
    const mnoise3 = new LevelGen(w, h, 16);
    const nnoise1 = new LevelGen(w, h, 16);
    const nnoise2 = new LevelGen(w, h, 16);
    const nnoise3 = new LevelGen(w, h, 16);
    const wnoise1 = new LevelGen(w, h, 16);
    const wnoise2 = new LevelGen(w, h, 16);
    const wnoise3 = new LevelGen(w, h, 16);
    const noise1 = new LevelGen(w, h, 32);
    const noise2 = new LevelGen(w, h, 32);

    const map = new Uint8Array(w * h);
    const data = new Uint8Array(w * h);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let i = x + y * w;
        let val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;
        let mval = Math.abs(mnoise1.values[i] - mnoise2.values[i]);
        let mval2 = Math.abs(mval - mnoise3.values[i]) * 3 - 2;
        let nval = Math.abs(Math.abs(nnoise1.values[i] - nnoise2.values[i]) - nnoise3.values[i]) * 3 - 2;
        let wval = Math.abs(Math.abs(wnoise1.values[i] - wnoise2.values[i]) - wnoise3.values[i]) * 3 - 2;

        let xd = (x / (w - 1)) * 2 - 1;
        let yd = (y / (h - 1)) * 2 - 1;
        if (xd < 0) xd = -xd;
        if (yd < 0) yd = -yd;
        let dist = Math.max(xd, yd);
        let dist2 = dist * dist * dist * dist;
        let val2 = (1.0 + val) - (20.0 * (dist2 * dist2 * dist2 * dist2));

        if (val2 <= -2.0 || wval >= -2.0 + (depth / 2.0) * 3) {
          if (val2 > -2.0 && (mval2 < -1.7 || nval < -1.4)) {
            map[i] = TileIds.dirt;
          } else {
            map[i] = TileIds.rock;
          }
        } else {
          map[i] = (depth > 2) ? TileIds.lava : TileIds.water;
        }
      }
    }

    // Add ores (simplified)
    for (let i = 0; i < (w * h) / 400; i++) {
        let x = Math.floor(Math.random() * w);
        let y = Math.floor(Math.random() * h);
        for (let j = 0; j < 30; j++) {
            let xx = Math.floor(Math.random() * 5) + x - 2;
            let yy = Math.floor(Math.random() * 5) + y - 2;
            if (xx >= 0 && yy >= 0 && xx < w && yy < h && map[yy * w + xx] === TileIds.rock) {
                map[yy * w + xx] = 10 + depth; // Placeholder for ores
            }
        }
    }

    // Add stairs
    for (let i = 0; i < 4; i++) {
        let x = Math.floor(Math.random() * (w - 2)) + 1;
        let y = Math.floor(Math.random() * (h - 2)) + 1;
        map[y * w + x] = TileIds.stairsUp;
        let x2 = Math.floor(Math.random() * (w - 2)) + 1;
        let y2 = Math.floor(Math.random() * (h - 2)) + 1;
        map[y2 * w + x2] = TileIds.stairsDown;
    }

    return { map, data };
  }

  public static createSkyMap(w: number, h: number): { map: Uint8Array, data: Uint8Array } {
    const map = new Uint8Array(w * h);
    const data = new Uint8Array(w * h);

    for (let i = 0; i < w * h; i++) {
        map[i] = TileIds.cloud;
    }

    // Add some "holes" or different cloud patterns?
    // In original it's just Cloud tiles and Cloud Cactus.

    // Add stairs down
    for (let i = 0; i < 2; i++) {
        let x = Math.floor(Math.random() * w);
        let y = Math.floor(Math.random() * h);
        map[y * w + x] = TileIds.stairsDown;
    }

    return { map, data };
  }
}
