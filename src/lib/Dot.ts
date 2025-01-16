import { getDistance, comparator, dots, lines, app, svg } from '$lib/helper';
import { Line } from '$lib/Line';

export class Dot {
  r: number;
  cx: number;
  cy: number;
  el: SVGCircleElement;
  class: string;

  constructor(r: number, cx: number, cy: number) {
    this.r = r;
    this.cx = cx;
    this.cy = cy;
    this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.class = "dot";
    this.onClick = this.onClick.bind(this);
  }

  update() {
    this.el.setAttribute("r", this.r.toString());
    this.el.setAttribute("cx", this.cx.toString());
    this.el.setAttribute("cy", this.cy.toString());
    this.setAttr("class", this.class);
  }

  activate() {
    for (let i = 0; i < dots.num; i++) {
      dots.list[i].setAttr("data-selected", "false");
    }
    this.setAttr("data-selected", "true");
  }

  visited() {
    this.setAttr("data-visited", "true");
  }

  setAttr(attr: string, value: string) {
    this.el.setAttribute(attr, value);
  }

  getAttr(attr: string) {
    return this.el.getAttribute(attr);
  }

  append() {
    const svg = document.getElementById("svg");
    if (svg) {
      svg.appendChild(this.el);
      this.el.addEventListener("click", this.onClick);
    }
  }

  onClick(event: MouseEvent) {
    const thisId = Number(this.getAttr("data-id")?.substr(3, 2));
    const thisCx = dots.list[thisId].cx;
    const thisCy = dots.list[thisId].cy;

    if (thisId === dots.selected.id) {
      return; // Prevent game over when clicking the same dot
    }

    const distances: [number, number][] = [];
    for (let i = 0; i < dots.num; i++) {
      distances[i] = [i, getDistance(dots.selected, dots.list[i])];
    }
    distances.sort(comparator);
    distances.splice(0, 1);
    const distancesLeft = [];
    for (let i = 0; i < distances.length; i++) {
      if (dots.left.includes(distances[i][0])) {
        distancesLeft.push(distances[i][0]);
      }
    }

    if (thisId === distancesLeft[0] && dots.left.includes(thisId)) {
      const newDistance = getDistance(dots.list[thisId], dots.selected);

      app.score.update(1); // Update score by 1
      // app.score.update(newDistance); // Uncomment to update score by distance

      dots.list[thisId].activate();
      dots.list[thisId].visited();

      lines.list.push(
        new Line(
          dots.selected.cx,
          dots.selected.cy,
          dots.list[thisId].cx,
          dots.list[thisId].cy
        )
      );
      lines.list[lines.list.length - 1].update();
      lines.list[lines.list.length - 1].append();

      svg?.addEventListener("mousemove", function prelineMove(e) {
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        app.preline.update(thisCx, thisCy, mouseX, mouseY);
      });

      dots.selected.id = thisId;
      dots.selected.cx = thisCx;
      dots.selected.cy = thisCy;

      for (let i = 0; i < dots.left.length; i++) {
        if (dots.left[i] === thisId) {
          dots.left.splice(i, 1);
        }
      }

      if (dots.left.length === 0) {
        app.end(true);
      }
    } else {
      app.end(false);
    }
  }
}
