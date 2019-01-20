import * as React from "react";

export interface ParagraphProps {
    text: string;
}

export class Paragraph extends React.Component<ParagraphProps, {}> {
    render() {
        return (
            <p>{this.props.text}</p>
        );
    }
}
