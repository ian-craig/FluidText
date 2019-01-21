import { ITextMask } from "./TextMask";
import { IDraggableShape } from "./IDraggableShape";

const marginLeftRight = 5;

export class CircleStore implements ITextMask, IDraggableShape {
    public constructor(
        public readonly radius: number,
        public x: number,
        public y: number,
        private onHashChange: (hash: string) => void,
    ) {}

    public getHorizontalMaskAt(y: number): [number, number] | undefined {
        if (y < this.y || y > this.y + 2 * this.radius)
            return undefined;

        const yFromCenter = this.y + this.radius - y;
        const xFromCenter = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(yFromCenter, 2));
        return [this.x + this.radius - xFromCenter - marginLeftRight, this.x + this.radius + xFromCenter + marginLeftRight];
    }

    public updatePosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.onHashChange(this.getHashCode());
    }

    public getHashCode(): string {
        return `Circle:${this.radius},${this.x},${this.y}`;
    }
}