import { ITextMask } from "./TextMask";

const marginLeftRight = 5;

export class RectangleStore implements ITextMask {
    public constructor(
        public readonly width: number,
        public readonly height: number,
        public posX: number,
        public posY: number,
        private onHashChange: (hash: string) => void,
    ) {}

    public getHorizontalMaskAt(offsetY: number): [number, number] | undefined {
        if (offsetY < this.posY || offsetY > this.posY + this.height)
            return undefined;
        return [this.posX - marginLeftRight, this.posX + this.width + marginLeftRight];
    }

    public updatePosition(x: number, y: number): void {
        this.posX = x;
        this.posY = y;
        this.onHashChange(this.getHashCode());
    }

    public getHashCode(): string {
        return `Rectangle:${this.width},${this.height},${this.posX},${this.posY}`;
    }
}