
import * as React from "react";
import { DraggableShape } from "./DraggableShape";
import { CircleStore } from "../masks/CircleStore";

export const Circle = (props: {store: CircleStore}) => {
    const style: React.CSSProperties = {
        width: `${props.store.radius*2}px`,
        height: `${props.store.radius*2}px`,
        borderRadius: "50%",
        backgroundColor: "blue",
        position: "absolute",
    };
    return (
        <DraggableShape store={props.store}>
            <div style={style}></div>
        </DraggableShape>
    );
}
    