import * as React from "react";
import { Paragraph } from "./Paragraph";
const loremIpsum = require("lorem-ipsum");

/**
 * The area representing the area within the document margins where text may appear.
 */
export class DocumentContent extends React.Component {
    private paragraphStrings: string[] = [];

    public constructor(props: {}) {
        super(props);

        for (let i = 0; i < 5; i++) {
            this.paragraphStrings.push(
                loremIpsum({
                    count: 1,                      // Number of words, sentences, or paragraphs to generate.
                    units: 'paragraphs',            // Generate words, sentences, or paragraphs.
                    sentenceLowerBound: 5,         // Minimum words per sentence.
                    sentenceUpperBound: 15,        // Maximum words per sentence.
                    paragraphLowerBound: 5,        // Minimum sentences per paragraph.
                    paragraphUpperBound: 7,        // Maximum sentences per paragraph.
                    format: 'plain'               // Plain text or html
                })
            );
        }
    }

    render() {
        const paragraphs = this.paragraphStrings.map((text, index) => <Paragraph key={index} text={text} />)

        return (
            <div className="document-content">
                {paragraphs}
            </div>
        );
    }
}
