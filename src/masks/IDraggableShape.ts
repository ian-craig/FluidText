export interface IDraggableShape {
    x: number;
    y: number;
    updatePosition(x: number, y: number): void;
}