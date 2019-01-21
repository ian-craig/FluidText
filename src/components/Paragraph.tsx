import * as React from "react";
import measureText from "measure-text";
import { ITextMask } from "../masks/TextMask";

export interface ParagraphProps {
    /**
     * The content of the paragraph.
     */
    text: string;
    
    /**
     * The width of the paragraph element (or the area it can take up) in pixels.
     */
    width: number;

    topY: number;

    /**
     * Masks defining areas text should not be rendered.
     */
    masks: ITextMask[];

    /**
     * Callback to report changes in calculated height for the paragraph
     */
    onHeightChange: (height: number) => void;
}

const lineHeight = 20;
const textStyle: React.CSSProperties = {
    fontFamily: "Arial",
    fontSize: "16px",
    lineHeight: `${lineHeight}px`,
};

/**
 * Generate inline style for a line.
 * This is purely to help differentiate lines so overflow issues are obvious.
 */
const getLineStyle = (index: number): React.CSSProperties => {
    return index % 2 === 0 ? { background: "#EEE" } : { };
};

const makeSpan = (text: string, index: number, width?: number) => {
    const style = getLineStyle(index);
    if (width !== undefined) {
        style.width = width;
        style.display = "inline-block";
    };
    return <span key={index} style={style}>{text}</span>
};

export class Paragraph extends React.Component<ParagraphProps> {
    private cachedText: string | undefined = undefined;
    private wordWidths = {};
    private spaceWidth: number;
    private lastUsedMasks = [];
    private height = 0;

    public constructor(props: ParagraphProps) {
        super(props);
        this.spaceWidth = measureText({ text: " ", ...textStyle }).width.value;
    }

    private setHeight(height: number) {
        if (height !== this.height) {
            this.height = height;
            this.props.onHeightChange(height);
        }
    }

    private getMasksAt(posYTop: number, posYBottom: number): [number,number][] {
        const hMasks = [
            ...this.props.masks.map(mask => mask.getHorizontalMaskAt(posYTop + this.props.topY)),
            ...this.props.masks.map(mask => mask.getHorizontalMaskAt(posYBottom + this.props.topY)),
        ]
        .filter(hm => hm !== undefined && hm[0] < this.props.width && hm[1] > 0)
        .sort((a, b) => a[0] - b[0]);


        if (hMasks.length === 0) {
            return [];
        }

        const aggregatedMasks = [];
        let currentMask = hMasks[0];
        for (const nextMask of hMasks.slice(1)) {
            if (nextMask[0] < currentMask[1]) {
                currentMask[1] = Math.max(currentMask[1], nextMask[1]);
            } else {
                aggregatedMasks.push(currentMask);
                currentMask = nextMask;
            }
        }
        aggregatedMasks.push(currentMask);

        // Crop masks to content area
        aggregatedMasks[0][0] = Math.max(0, aggregatedMasks[0][0]);
        aggregatedMasks[aggregatedMasks.length-1][1] = Math.min(this.props.width, aggregatedMasks[aggregatedMasks.length-1][1]);
        
        return aggregatedMasks;
    }

    /**
     * Split a string of text into lines which will fit on the page.
     * 
     * Requires measuring text and iterating through the text to build up lines.
     * For now, this is done word by word because we want to break lines on whole words. It could equally be done character by character,
     * and longer-term that may be faster as you would only need to measure the alphabet once per text style.
     */
    private buildSpans(): JSX.Element[] {
        const words =  this.props.text.split(" ");

        // If text has updated, measure it
        if (this.cachedText !== this.props.text) {
            this.wordWidths = words.reduce((out, text) => {
                out[text] = measureText({ text, ...textStyle }).width.value;
                return out;
            }, {});
            this.cachedText = this.props.text;
        }

        const spans = [];
        let currentSpan = "";
        let lineWidth = 0;
        let lineTopY = 0;
        let lineMasks = this.getMasksAt(lineTopY, lineTopY + lineHeight);
        let maskIndex = 0;

        const startNewLine = () => {
            currentSpan = "";
            lineWidth = 0;
            lineTopY += lineHeight;
            lineMasks = this.getMasksAt(lineTopY, lineTopY + lineHeight);
            maskIndex = 0;
        }

        const newLineWidth = (wordWidth: number) => {
            return lineWidth + this.spaceWidth + wordWidth;
        }

        for (const word of words) {
            const wordWidth = this.wordWidths[word];

            // If the next word doesn't fit on the current line, start a new line
            if (newLineWidth(wordWidth) > this.props.width) {
                if (currentSpan !== "") {
                    spans.push(makeSpan(currentSpan + " ", spans.length));
                }
                startNewLine();
            }

            // If the next word would overlap a mask, insert necessary space
            while (lineMasks[maskIndex] !== undefined && (lineWidth > lineMasks[maskIndex][0] || newLineWidth(wordWidth) > lineMasks[maskIndex][0])) {
                // Finish current span
                if (currentSpan !== "") {
                    let spanWidth = lineMasks[maskIndex][0];
                    if (maskIndex > 0) {
                        spanWidth -= lineMasks[maskIndex-1][1];
                    } 
                    spans.push(makeSpan(currentSpan, spans.length, spanWidth));
                    currentSpan = "";
                }

                // Insert space span
                spans.push(makeSpan("", spans.length, lineMasks[maskIndex][1] - lineMasks[maskIndex][0]));
                if (lineMasks[maskIndex][1] >= this.props.width) {
                    startNewLine();
                } else {
                    lineWidth = lineMasks[maskIndex][1];
                    maskIndex++;
                }
            }

            // Add word to the span
            if (currentSpan.length === 0) {
                currentSpan = word;
                lineWidth += wordWidth;
            } else {
                currentSpan = `${currentSpan} ${word}`;
                lineWidth += this.spaceWidth + wordWidth;
            }            
        }
        spans.push(makeSpan(currentSpan, spans.length));

        this.setHeight(lineTopY + lineHeight);
        this.lastUsedMasks = this.props.masks.map(mask => mask.getHashCode());

        return spans;
    }

    public shouldComponentUpdate(nextProps: ParagraphProps): boolean {
        if (nextProps.masks.length !== this.lastUsedMasks.length) {
            return true;
        }
        for (let i = 0; i < nextProps.masks.length; i++) {
            if (this.lastUsedMasks[i] !== nextProps.masks[i].getHashCode()) {
                return true;
            }
        }
        return (
            this.props.text !== nextProps.text ||
            this.props.topY !== nextProps.topY ||
            this.props.width !== nextProps.width
        );
    }

    public render() {
        const paraStyle: React.CSSProperties = {
            ...textStyle,            
            top: `${this.props.topY}px`,
        }
        return (
            <p style={paraStyle} className="document-para">{this.buildSpans()}</p>
        );
    }
}
