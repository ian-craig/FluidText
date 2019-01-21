

export interface ITextMask {
    getHorizontalMaskAt(offsetY: number): [number, number] | undefined;
}

const marginLeftRight = 5;

export class RectangleStore implements ITextMask {
    public constructor(
        public readonly width: number,
        public readonly height: number,
        public readonly posX: number,
        public readonly posY: number,
    ) {}

    public getHorizontalMaskAt(offsetY: number): [number, number] | undefined {
        if (offsetY < this.posY || offsetY > this.posY + this.height)
            return undefined;
        return [this.posX - marginLeftRight, this.posX + this.width + marginLeftRight];
    }
}