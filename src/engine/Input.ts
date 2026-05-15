export class Input {
  public keys: Record<string, boolean> = {};
  private lastKeys: Record<string, boolean> = {};

  constructor() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keys[e.code] = false;
    });
  }

  public tick() {
    for (const k in this.keys) {
      this.lastKeys[k] = this.keys[k];
    }
  }

  public clicked(code: string): boolean {
    return !!(this.keys[code] && !this.lastKeys[code]);
  }
}
