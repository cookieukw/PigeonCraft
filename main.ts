import "./style.css";
import "@/level/tile/Tiles";
import { Screen } from '@/engine/Screen';
import { SpriteSheet } from '@/engine/SpriteSheet';
import { Input } from '@/engine/Input';
import { LevelGen } from '@/level/LevelGen';
import { Level } from '@/level/Level';
import { Player } from '@/entity/Player';
import { Pigeon } from '@/entity/Pigeon';
import { Zombie } from '@/entity/Zombie';
import { Slime } from '@/entity/Slime';
import { Chest } from '@/entity/Chest';
import { AirWizard } from '@/entity/AirWizard';
import { Gui } from '@/screen/Gui';
import { TitleMenu } from '@/screen/TitleMenu';
import { LevelTransitionMenu } from '@/screen/LevelTransitionMenu';
import { PauseMenu } from '@/screen/PauseMenu';
import { ResourceItem } from '@/item/ResourceItem';
import { ToolItem, ToolType } from '@/item/ToolItem';
import { FurnitureItem } from '@/item/FurnitureItem';
import { FoodItem } from '@/item/FoodItem';
import { Resources } from '@/item/resource/Resource';
import { Workbench } from '@/entity/Workbench';
import { Furnace } from '@/entity/Furnace';
import { Anvil } from '@/entity/Anvil';
import { Oven } from '@/entity/Oven';
import { Lantern } from '@/entity/Lantern';
import { Bed } from '@/entity/Bed';
import { Sheep } from '@/entity/Sheep';
import { Chicken } from '@/entity/Chicken';
  
const WIDTH = 256;
const HEIGHT = 192;
const SCALE = 2.5;

async function init() {
  try {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!canvas) throw new Error("Could not find gameCanvas");

    canvas.width = WIDTH * SCALE;
    canvas.height = HEIGHT * SCALE;

    const ctx = canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;
    if (!ctx) throw new Error("Could not get 2D context");
    ctx.imageSmoothingEnabled = false;

    const image = new Image();
    image.src = "icons.png";
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () =>
        reject(new Error("Falha ao carregar icons.png. Verifique o caminho!"));
    });

    const sheet = new SpriteSheet(image);
    const screen = new Screen(WIDTH, HEIGHT, sheet);
    const lightScreen = new Screen(WIDTH, HEIGHT, sheet);

    const input = new Input();
    
    interface IGame {
      setMenu: (m: any) => void;
      save: () => void;
      load: () => void;
      shake: (amount: number) => void;
    }
    
    let menu: any = null;
    let menuJustOpened = false;
    const worldSize = 128;
    const levels: Level[] = [];
    let currentLevelIdx = 3; // Top level

    const game: IGame = {
      setMenu: (m) => {
        menu = m;
        if (menu) {
          menu.game = game;
          menuJustOpened = true;
        }
      },
      save: () => {
        try {
          const currentHighScore = parseInt(
            localStorage.getItem("pigeoncraft_highscore") || "0",
          );
          if (player.score > currentHighScore) {
            localStorage.setItem(
              "pigeoncraft_highscore",
              player.score.toString(),
            );
          }

          const saveData = {
            player: {
              x: player.x,
              y: player.y,
              health: player.health,
              stamina: player.stamina,
              score: player.score,
              currentLevel: currentLevelIdx,
              inventory: player.inventory.items
                .map((item) => {
                  if (item instanceof ResourceItem)
                    return {
                      type: "resource",
                      name: item.resource.name,
                      count: item.count,
                    };
                  if (item instanceof ToolItem)
                    return {
                      type: "tool",
                      toolType: item.type.name,
                      level: item.level,
                    };
                  if (item instanceof FurnitureItem)
                    return {
                      type: "furniture",
                      furniture: item.furniture.constructor.name,
                    };
                  if (item instanceof FoodItem)
                    return {
                      type: "food",
                      name: item.resource.name,
                      count: item.count,
                      heal: item.heal,
                    };
                  return null;
                })
                .filter((i) => i !== null),
            },
            levels: levels.map((l) => ({
              map: Array.from(l.map),
              data: Array.from(l.data),
            })),
          };
          localStorage.setItem("pigeoncraft_save", JSON.stringify(saveData));
          console.log("Game Saved");
        } catch (e) {
          console.error("Save failed", e);
        }
      },
      shake: (_amount: number) => {},
      load: () => {
        try {
          const saveStr = localStorage.getItem("pigeoncraft_save");
          if (!saveStr) return;
          const saveData = JSON.parse(saveStr);

          player.x = saveData.player.x;
          player.y = saveData.player.y;
          player.health = saveData.player.health;
          player.stamina = saveData.player.stamina;
          player.score = saveData.player.score;

          // Restore inventory
          player.inventory.items = [];
          saveData.player.inventory.forEach((iData: any) => {
            if (iData.type === "resource") {
              const res = Object.values(Resources).find(
                (r) => r.name === iData.name,
              );
              if (res)
                player.inventory.items.push(new ResourceItem(res, iData.count));
            } else if (iData.type === "tool") {
              const tt = Object.values(ToolType).find(
                (t) => t.name === iData.toolType,
              );
              if (tt)
                player.inventory.items.push(new ToolItem(tt, iData.level));
            } else if (iData.type === "furniture") {
              let f;
              if (iData.furniture === "Workbench") f = new Workbench();
              if (iData.furniture === "Furnace") f = new Furnace();
              if (iData.furniture === "Anvil") f = new Anvil();
              if (iData.furniture === "Oven") f = new Oven();
              if (iData.furniture === "Chest") f = new Chest();
              if (iData.furniture === "Lantern") f = new Lantern();
              if (iData.furniture === "Bed") f = new Bed();
              if (f) player.inventory.items.push(new FurnitureItem(f));
            } else if (iData.type === "food") {
              const res = Object.values(Resources).find(
                (r) => r.name === iData.name,
              );
              if (res)
                player.inventory.items.push(new FoodItem(res, iData.heal));
            }
          });

          // Remove player from current level
          levels[currentLevelIdx].entities = levels[
            currentLevelIdx
          ].entities.filter((e) => e !== player);

          currentLevelIdx = saveData.player.currentLevel;

          // Restore levels (tiles only for now)
          saveData.levels.forEach((lData: any, i: number) => {
            levels[i].map.set(lData.map);
            levels[i].data.set(lData.data);
          });

          // Add player to the loaded level
          levels[currentLevelIdx].add(player);

          console.log("Game Loaded");
        } catch (e) {
          console.error("Load failed", e);
        }
      },
    };

    const player = new Player(input.keys);
    player.game = game;

    for (let i = 0; i < 5; i++) {
      let levelData;
      if (i === 4) levelData = LevelGen.createSkyMap(worldSize, worldSize);
      else if (i === 3) levelData = LevelGen.createTopMap(worldSize, worldSize);
      else
        levelData = LevelGen.createUndergroundMap(worldSize, worldSize, 3 - i);

      const lvl = new Level(worldSize, worldSize, levelData);
      lvl.depth = i - 3;

      lvl.onLevelChange = (dir) => {
        game.setMenu(
          new LevelTransitionMenu(dir, () => {
            let nextIdx = currentLevelIdx + dir;
            if (nextIdx >= 0 && nextIdx < levels.length) {
              levels[currentLevelIdx].entities = levels[
                currentLevelIdx
              ].entities.filter((e) => e !== player);
              currentLevelIdx = nextIdx;
              levels[currentLevelIdx].add(player);
            }
          }),
        );
      };
      levels[i] = lvl;

      // Add some mobs to each level
      if (i === 4) {
        const aw = new AirWizard();
        aw.x = (worldSize / 2) * 16;
        aw.y = (worldSize / 2) * 16;
        lvl.add(aw);
      } else {
        if (i < 3) {
          for (let j = 0; j < 15; j++) {
            const z = new Zombie(4 - i);
            z.x = Math.random() * (worldSize * 16);
            z.y = Math.random() * (worldSize * 16);
            lvl.add(z);
          }
          for (let j = 0; j < 10; j++) {
            const s = new Slime(4 - i);
            s.x = Math.random() * (worldSize * 16);
            s.y = Math.random() * (worldSize * 16);
            lvl.add(s);
          }
        }
        if (i === 3) {
          // Top level — surface passive mobs
          for (let j = 0; j < 20; j++) {
            const p = new Pigeon();
            p.x = Math.random() * (worldSize * 16);
            p.y = Math.random() * (worldSize * 16);
            lvl.add(p);
          }
          for (let j = 0; j < 10; j++) {
            const ch = new Chicken(1);
            ch.x = Math.random() * (worldSize * 16);
            ch.y = Math.random() * (worldSize * 16);
            lvl.add(ch);
          }
          for (let j = 0; j < 8; j++) {
            const sh = new Sheep(1);
            sh.x = Math.random() * (worldSize * 16);
            sh.y = Math.random() * (worldSize * 16);
            lvl.add(sh);
          }
        }
        if (i < 3) {
          // Underground
          for (let j = 0; j < 5; j++) {
            const c = new Chest();
            c.x = Math.random() * (worldSize * 16);
            c.y = Math.random() * (worldSize * 16);
            lvl.add(c);
          }
        }
      }
    }

    // Find a valid spawn point on top map (index 3)
    const topLevel = levels[3];
    let spawnX = worldSize / 2;
    let spawnY = worldSize / 2;
    let found = false;
    for (let i = 0; i < 1000 && !found; i++) {
      let tx = Math.floor(Math.random() * worldSize);
      let ty = Math.floor(Math.random() * worldSize);
      const t = topLevel.map[tx + ty * worldSize];
      if (t === 0 || t === 3 || t === 5 || t === 6) {
        spawnX = tx;
        spawnY = ty;
        found = true;
      }
    }

    player.x = spawnX * 16 + 8;
    player.y = spawnY * 16 + 8;
    topLevel.add(player);

    const imageData = new ImageData(WIDTH, HEIGHT);

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = WIDTH;
    offscreenCanvas.height = HEIGHT;
    const offscreenCtx = offscreenCanvas.getContext("2d") as CanvasRenderingContext2D;

    let tickCount = 0;
    let screenShake = 0;

    game.shake = (amount) => {
      screenShake = amount;
    };

    function tick() {
      tickCount++;
      if (screenShake > 0) screenShake--;
      const level = levels[currentLevelIdx];
      if (menu) {
        if (!menuJustOpened) menu.tick(input);
        menuJustOpened = false;
      } else {
        level.tick(input);

        // Day/Night cycle (only on top level)
        if (currentLevelIdx === 3 && tickCount % 900 === 0) {
          if (player.rising) {
            player.lightlvl2++;
            if (player.lightlvl2 >= 12) player.rising = false;
          } else {
            player.lightlvl2--;
            if (player.lightlvl2 <= 0) player.rising = true;
          }
        }

        if (input.clicked("Escape")) {
          game.setMenu(new PauseMenu());
        }
      }

      input.tick();
    }

    function render() {
      const level = levels[currentLevelIdx];
      let xScroll = player.x - WIDTH / 2;
      let yScroll = player.y - HEIGHT / 2;

      if (screenShake > 0) {
        xScroll += (Math.random() - 0.5) * screenShake;
        yScroll += (Math.random() - 0.5) * screenShake;
      }

      screen.clear(0);
      level.renderTiles(screen, Math.floor(xScroll), Math.floor(yScroll));
      level.renderEntities(screen);

      // Lighting Overlay
      if (currentLevelIdx < 3) {
        lightScreen.clear(0);
        level.renderLight(
          lightScreen,
          Math.floor(xScroll),
          Math.floor(yScroll),
          0,
        );
        screen.overlay(lightScreen);
      } else if (player.lightlvl2 < 12) {
        lightScreen.clear(0);
        level.renderLight(
          lightScreen,
          Math.floor(xScroll),
          Math.floor(yScroll),
          player.lightlvl2 * 8,
        );
        screen.overlay(lightScreen);
      }

      screen.setOffset(0, 0);

      if (!menu) {
        Gui.render(screen, player);
      }

      if (menu) {
        menu.render(screen);
      }

      // Direct byte assignment avoids endianness or Buffer sharing bugs
      for (let i = 0; i < screen.pixels.length; i++) {
        const color = screen.pixels[i];
        const idx = i * 4;
        imageData.data[idx] = color & 0xff; // R
        imageData.data[idx + 1] = (color >> 8) & 0xff; // G
        imageData.data[idx + 2] = (color >> 16) & 0xff; // B
        imageData.data[idx + 3] = 255; // A
      }

      offscreenCtx.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
    }

    function loop() {
      tick();
      render();
      requestAnimationFrame(loop);
    }

    game.setMenu(new TitleMenu());
    loop();
  } catch (err) {
    const e = err as Error;
    console.error(e);
    document.body.style.background = "white";
    document.body.style.color = "red";
    document.body.innerHTML = `<h1>CRITICAL ERROR</h1><pre>${e.stack || e}</pre>`;
  }
}

init();
