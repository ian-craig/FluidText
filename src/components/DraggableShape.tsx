import * as React from "react";
import { IDraggableShape } from "../masks/IDraggableShape";
const Draggable = require("react-draggable");

export interface DraggableShapeProps {
    store: IDraggableShape;
}

interface DraggableShapeState {
    x: number;
    y: number;
}

export class DraggableShape extends React.Component<DraggableShapeProps, DraggableShapeState> {
    public constructor(props: DraggableShapeProps) {
        super(props);
        this.state = {
            x: props.store.x,
            y: props.store.y,
        }
    }

    private onControlledDrag = (_e, position) => {
        const {x, y} = position;
        this.setState({x, y});
        this.props.store.updatePosition(x, y);
    }

    public render() {
        return (
            <Draggable defaultPosition={{x: 0, y: 0}} position={this.state} onDrag={this.onControlledDrag}>
                {this.props.children}
            </Draggable>
        );
    }
}
