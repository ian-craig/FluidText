export interface ITextMask {
    getHorizontalMaskAt(offsetY: number): [number, number] | undefined;
    getHashCode(): string;
}