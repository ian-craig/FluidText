import * as React from "react";
import { RectangleStore } from "../masks/RectangleStore";
const Draggable = require("react-draggable");

export interface RectangleProps {
    store: RectangleStore;
}

interface RectangleState {
    x: number;
    y: number;
}

export class Rectangle extends React.Component<RectangleProps, RectangleState> {
    public constructor(props: RectangleProps) {
        super(props);
        this.state = {
            x: props.store.posX,
            y: props.store.posY,
        }
    }

    private onControlledDrag = (_e, position) => {
        const {x, y} = position;
        this.setState({x, y});
        this.props.store.updatePosition(x, y);
    }

    public render() {
        const style: React.CSSProperties = {
            width: `${this.props.store.width}px`,
            height: `${this.props.store.height}px`,
            backgroundColor: "blue",
            position: "absolute",
        }

        return (
            <Draggable defaultPosition={{x: 0, y: 0}} position={this.state} onDrag={this.onControlledDrag}>
                <div style={style}></div>
            </Draggable>
        );
    }
}
