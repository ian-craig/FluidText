import * as React from "react";
import "./../assets/scss/Document.scss";
import { DocumentContent } from "./DocumentContent";

/**
 * The area representing the piece of paper.
 */
export class Document extends React.Component {
    render() {
        return (
            <div className="document">
                <DocumentContent />
            </div>
        );
    }
}
