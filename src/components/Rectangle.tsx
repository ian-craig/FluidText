
import * as React from "react";
import { DraggableShape } from "./DraggableShape";
import { RectangleStore } from "../masks/RectangleStore";

export const Rectangle = (props: {store: RectangleStore}) => {
    const style: React.CSSProperties = {
        width: `${props.store.width}px`,
        height: `${props.store.height}px`,
        backgroundColor: "blue",
        position: "absolute",
    };
    return (
        <DraggableShape store={props.store}>
            <div style={style}></div>
        </DraggableShape>
    );
}
    