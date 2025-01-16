export class Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  el!: SVGLineElement;
  class: string;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.class = "line";
    this.initializeDOMElements();
  }

  initializeDOMElements() {
    if (typeof document !== 'undefined') {
      this.el = document.createElementNS("http://www.w3.org/2000/svg", "line");
    }
  }

  update(x1?: number, y1?: number, x2?: number, y2?: number) {
    this.el.setAttribute("x1", (x1 || this.x1).toString());
    this.el.setAttribute("y1", (y1 || this.y1).toString());
    this.el.setAttribute("x2", (x2 || this.x2).toString());
    this.el.setAttribute("y2", (y2 || this.y2).toString());
    this.setAttr("class", this.class);
  }

  setAttr(attr: string, value: string) {
    this.el.setAttribute(attr, value);
  }

  append() {
    const svg = document.getElementById("svg");
    if (svg) {
      svg.insertBefore(this.el, svg.firstChild);
    }
  }
}
