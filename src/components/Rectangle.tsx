import * as React from "react";
import { RectangleStore } from "../masks/RectangleStore";

export interface RectangleProps {
    store: RectangleStore;
}

export class Rectangle extends React.Component<RectangleProps, {}> {
    render() {
        const style: React.CSSProperties = {
            width: `${this.props.store.width}px`,
            height: `${this.props.store.height}px`,
            backgroundColor: "blue",
            position: "absolute",
            top: `${this.props.store.posY}px`,
            left: `${this.props.store.posX}px`,
        }
        return (
            <div style={style}></div>
        );
    }
}
