import { Line } from './Line';
import { Dot } from './Dot';
import { score, highScore, timer, timeLimit } from '$lib/stores';
import { writable } from 'svelte/store';
import clickSound from '$lib/sounds/click.mp3';
import playSound from '$lib/sounds/play.mp3';
import gameOverSound from '$lib/sounds/gameover.mp3';
import nextLevelSound from '$lib/sounds/nextlevel.mp3';

const scoreStore = writable(0);

export function getDistance(obj1: { cx: number; cy: number }, obj2: { cx: number; cy: number }) {
  return Math.floor(
    Math.sqrt(Math.pow(obj1.cx - obj2.cx, 2) + Math.pow(obj1.cy - obj2.cy, 2))
  );
}

export function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function comparator(a: [number, number], b: [number, number]) {
  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return 1;
  return 0;
}

export function difference(source: any[], toRemove: any[]) {
  return source.filter(function(value) {
    return toRemove.indexOf(value) == -1;
  });
}

export let svg: SVGSVGElement | null = null;
export let dotMatrix: SVGCircleElement | null = null;
export let lineMatrix: SVGLineElement | null = null;
export let screenW: number = 0;
export let screenH: number = 0;
export let totalDist: HTMLElement | null = null;

export function initializeDOMElements() {
  svg = document.getElementById("svg") as unknown as SVGSVGElement;
  dotMatrix = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  lineMatrix = document.createElementNS("http://www.w3.org/2000/svg", "line");
  screenW = window.innerWidth * 0.95;
  screenH = window.innerHeight * 0.95;
  totalDist = document.getElementById("distance");
  app.preline = new Line(0, 0, 200, 200);
  app.preline.setAttr("id", "preline");
  app.score.el = document.getElementById("score"); // Initialize score element
}

export const lines = {
  list: [] as Line[]
};

export const dots = {
  num: 20,
  list: [] as Dot[],
  start: 0,
  selected: { id: 0, cx: 0, cy: 0 },
  left: [] as number[],
  preline: {} as Line,
  maxDots: 50 // Add maximum dot limit
};

export const app = {
  level: 5, // Change initial level to 5 dots
  score: {
    number: 0,
    el: null as HTMLElement | null,
    update(scoreValue: number) {
      this.number += scoreValue;
      score.update(n => n + scoreValue);
    },
    reset() {
      this.number = 0;
      score.set(0);
    }
  },
  results(points: number | "reset") {
    if (points === "reset") {
      sessionStorage.setItem("results", "0");
    } else {
      const currentResults = sessionStorage.getItem("results");
      const newScore = currentResults ? parseInt(currentResults) + points : points;
      sessionStorage.setItem("results", newScore.toString());
    }
  },
  launchScreen(lastScore: number, title: string, description: string, btnText: string) {
    const launchScreenEl = document.getElementById("launch-screen");
    if (launchScreenEl) {
      launchScreenEl.setAttribute("class", "is-visible");
    }

    const launchScreenTitle = document.getElementById("launch-screen__title");
    if (launchScreenTitle) {
      launchScreenTitle.textContent = title;
    }

    let currentTimeLimit;
    timeLimit.subscribe(value => currentTimeLimit = value)();

    const launchScreenDescription = document.getElementById("launch-screen__description");
    if (launchScreenDescription) {
      launchScreenDescription.textContent = description + ` Time limit: ${currentTimeLimit} seconds.`;
    }

    const launchScreenBtn = document.getElementById("start-btn");
    if (launchScreenBtn) {
      launchScreenBtn.textContent = btnText;
      launchScreenBtn.addEventListener("click", function lauch() {
        if (launchScreenEl) {
          launchScreenEl.setAttribute("class", "");
        }
        app.start(app.level);
        app.playSoundEffect(playSound);
        launchScreenBtn.removeEventListener("click", lauch);
      });
    }
  },
  preline: new Line(0, 0, 200, 200),
  startTimer: () => {},
  resetTimer: () => {},
  playSoundEffect(sound: string) {
    const audio = new Audio(sound);
    audio.play().catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Error playing sound:', error);
      }
    });
  },
  start(dotsNum: number) {
    this.resetTimer();
    this.startTimer();
    
    // Subscribe to timer to check for time limit
    const unsubscribe = timer.subscribe(time => {
      let limit;
      timeLimit.subscribe(value => limit = value)();
      
      if (limit !== undefined && time >= limit) {
        unsubscribe();
        this.end(false); // Game over when time runs out
      }
    });

    dots.num = dotsNum;

    for (let i = 0; i < dots.num; i++) {
      let cx: number, cy: number;
      let isTooClose;
      do {
        cx = getRandomArbitrary(10, screenW - 10);
        cy = getRandomArbitrary(10, screenH - 10);
        isTooClose = dots.list.some(dot => getDistance(dot, { cx, cy }) < 50);
      } while (isTooClose);

      dots.list[i] = new Dot(8, cx, cy);
      dots.list[i].setAttr("data-id", "id-" + i);
      dots.list[i].setAttr(
        "style", 
        "animation-delay:" + i / 10 + "s; transform-origin: " + cx + 'px ' + cy + 'px;');
      dots.list[i].update();
      dots.list[i].append();
      dots.left.push(i);

      dots.list[i].el?.addEventListener("click", () => app.playSoundEffect(clickSound));

      if (i === dots.start) {
        dots.selected.cx = dots.list[dots.start].cx;
        dots.selected.cy = dots.list[dots.start].cy;
        dots.list[dots.start].setAttr("class", "dot dot--starting");
        dots.left.splice(i, 1);
      }

      app.preline.update(
        dots.selected.cx,
        dots.selected.cy,
        dots.selected.cx,
        dots.selected.cy
      );
      app.preline.append();

      svg?.addEventListener("mousemove", function prelineMove(e) {
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        app.preline.update(dots.selected.cx, dots.selected.cy, mouseX, mouseY);
      });
    }

    dots.list[dots.start].setAttr("data-selected", "true");
  },
  end(win: boolean) {
    this.resetTimer();
    if (win) {
      // Increase level by 3 dots and add 5 seconds to time limit
      this.level = Math.min(this.level + 3, dots.maxDots);
      timeLimit.update(t => t + 5);
      app.results(app.score.number);
      highScore.update(n => Math.max(n, app.score.number));
      app.playSoundEffect(nextLevelSound);
    } else {
      this.level = 5;
      timeLimit.set(30); // Reset time limit
      app.playSoundEffect(gameOverSound);
    }

    dots.list = [];
    dots.selected = { id: 0, cx: 0, cy: 0 };
    dots.left.length = 0;
    if (svg) {
      svg.innerHTML = "";
    }

    const finalScore = sessionStorage.getItem("results") || "0";

    if (win) {
      app.launchScreen(
        app.score.number,
        "Well done!",
        `Your score is: ${finalScore}. Next level: ${this.level} dots`,
        "PLAY NEXT LEVEL"
      );
    } else {
      app.launchScreen(
        0,
        "Game over!",
        `Your final score is: ${finalScore}`,
        "PLAY AGAIN"
      );
      app.results("reset");
      app.score.reset();
    }
  }
};
