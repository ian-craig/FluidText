import { ITextMask } from "./TextMask";
import { IDraggableShape } from "./IDraggableShape";

const marginLeftRight = 5;

export class RectangleStore implements ITextMask, IDraggableShape {
    public constructor(
        public readonly width: number,
        public readonly height: number,
        public x: number,
        public y: number,
        private onHashChange: (hash: string) => void,
    ) {}

    public getHorizontalMaskAt(offsetY: number): [number, number] | undefined {
        if (offsetY < this.y || offsetY > this.y + this.height)
            return undefined;
        return [this.x - marginLeftRight, this.x + this.width + marginLeftRight];
    }

    public updatePosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.onHashChange(this.getHashCode());
    }

    public getHashCode(): string {
        return `Rectangle:${this.width},${this.height},${this.x},${this.y}`;
    }
}