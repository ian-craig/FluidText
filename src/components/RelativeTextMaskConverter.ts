import { ITextMask } from "./RectangleStore";

/**
 * Wrap a text mask so that calls use coordinates relative to a given point.
 */
export class RelativeTextMaskConverter implements ITextMask {
    public constructor(
        private readonly mask: ITextMask,
        private readonly relativeToX: number,
        private readonly relativeToY: number,
    ) {}

    public getHorizontalMaskAt(offsetY: number): [number, number] | undefined {
        const horizontalMask = this.mask.getHorizontalMaskAt(this.relativeToY + offsetY);
        if (horizontalMask === undefined)
            return undefined;
        return [horizontalMask[0] - this.relativeToX, horizontalMask[1] - this.relativeToX];
    }
}