import * as React from "react";
import { Paragraph } from "./Paragraph";
import { Rectangle } from "./Rectangle";
import { RectangleStore } from "../masks/RectangleStore";
const loremIpsum = require("lorem-ipsum");

/**
 * The width of the content area.
 * This should really be calculated from zoom, page size, margins, etc. For now these are all hard-coded anyway.
 */
const contentWidth = 690;

const paragraphMarginBottom = 20;

const numberOfParagraphs = 5;

interface ParagraphInfo {
    text: string;
    topY: number | undefined;
    height: number;
    onHeightChange: (height: number) => void;
}

interface DocumentContentState {
    paragraphs: ParagraphInfo[];
}

/**
 * The area representing the area within the document margins where text may appear.
 */
export class DocumentContent extends React.Component<{}, DocumentContentState> {
    private rectangles = [
        new RectangleStore(250, 250, 100, 33),
        new RectangleStore(50, 150, 450, 60),
    ];

    public constructor(props: {}) {
        super(props);

        const paragraphs = [];
        for (let i = 0; i < numberOfParagraphs; i++) {
            const text = loremIpsum({
                count: 1,                      // Number of words, sentences, or paragraphs to generate.
                units: 'paragraphs',            // Generate words, sentences, or paragraphs.
                sentenceLowerBound: 5,         // Minimum words per sentence.
                sentenceUpperBound: 15,        // Maximum words per sentence.
                paragraphLowerBound: 5,        // Minimum sentences per paragraph.
                paragraphUpperBound: 7,        // Maximum sentences per paragraph.
                format: 'plain'               // Plain text or html
            });
            paragraphs.push({
                text,
                topY: i === 0 ? 0 : undefined,
                height: 0,
                onHeightChange: (height: number) => this.onParaHeightChange(i, height),
            });
        }
        this.state = { paragraphs };
    }

    private onParaHeightChange(paraIndex: number, height: number) {
        const { paragraphs } = this.state;
        const heightDelta = height - paragraphs[paraIndex].height;
        paragraphs[paraIndex].height = height;

        if (paragraphs[paraIndex+1] !== undefined && paragraphs[paraIndex+1].topY === undefined) {
           paragraphs[paraIndex+1].topY = paragraphs[paraIndex].topY + paragraphs[paraIndex].height + paragraphMarginBottom;
        } else {
            for (let i = paraIndex + 1; i < paragraphs.length && paragraphs[i].topY !== undefined; i++) {
               paragraphs[i].topY += heightDelta;
            }
        }

        this.setState({ paragraphs });
    }

    public render() {
        const paragraphs = this.state.paragraphs.map((para, index) => {
            const topY = this.state.paragraphs[index].topY;
            if (topY === undefined) {
                return null;
            }
            const masks = this.rectangles;
            
            return <Paragraph key={index} text={para.text} width={contentWidth} masks={masks} onHeightChange={para.onHeightChange} topY={topY} />;
        });

        const rectangles = this.rectangles.map((rectangleStore, i) => <Rectangle store={rectangleStore} key={`rect${i}`} />);

        return (
            <div className="document-content">
                {paragraphs}
                {rectangles}
            </div>
        );
    }
}
