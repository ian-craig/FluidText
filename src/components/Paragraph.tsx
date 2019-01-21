import * as React from "react";
import measureText from "measure-text";
import { ITextMask } from "./RectangleStore";

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

export class Paragraph extends React.Component<ParagraphProps, {}> {
    private cachedText: string | undefined = undefined;
    private wordWidths = {};
    private spaceWidth: number;
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

    private getMasksAt(posXTop: number, posXBottom: number): [number,number][] {
        const hMasks = [
            ...this.props.masks.map(mask => mask.getHorizontalMaskAt(posXTop)),
            ...this.props.masks.map(mask => mask.getHorizontalMaskAt(posXBottom)),
        ].filter(hm => hm !== undefined).sort((a, b) => a[0] - b[0]);
 

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

        const lines = [];
        let currentSpan = "";
        let currentLineWidth = 0;
        let currentLineTopY = 0;
        let currentLineMasks = this.getMasksAt(currentLineTopY, currentLineTopY + lineHeight);
        let maskIndex = 0;
        for (const word of words) {
            const wordWidth = this.wordWidths[word];
            const newLineWidth = currentLineWidth + this.spaceWidth + wordWidth;

            // If the next word would overlap a mask, insert necessary space
            if (currentLineMasks[maskIndex] !== undefined && newLineWidth > currentLineMasks[maskIndex][0]) {
                let spanWidth = currentLineMasks[maskIndex][0];
                if (maskIndex > 0) {
                    spanWidth -= currentLineMasks[maskIndex-1][1];
                } 
                lines.push(makeSpan(currentSpan, lines.length, spanWidth));
                lines.push(makeSpan("", lines.length, currentLineMasks[maskIndex][1] - currentLineMasks[maskIndex][0]));
                currentSpan = "";
                currentLineWidth = currentLineMasks[maskIndex][1];
                maskIndex++;
            }

            // If the next word doesn't fit on the current line, start a new line
            if (newLineWidth > this.props.width) {
                lines.push(makeSpan(currentSpan + " ", lines.length));
                currentSpan = "";
                currentLineWidth = 0;
                currentLineTopY += lineHeight;
                currentLineMasks = this.getMasksAt(currentLineTopY, currentLineTopY + lineHeight);
                maskIndex = 0;
            }

            // Add word to the span
            if (currentSpan.length === 0) {
                currentSpan = word;
                currentLineWidth += wordWidth;
            } else {
                currentSpan = `${currentSpan} ${word}`;
                currentLineWidth += this.spaceWidth + wordWidth;
            }            
        }
        lines.push(makeSpan(currentSpan, lines.length));
        this.setHeight(currentLineTopY + lineHeight);
        return lines;
    }

    public render() {
        console.log("Rendering paragraph", this.props);
        const paraStyle: React.CSSProperties = {
            ...textStyle,            
            top: `${this.props.topY}px`,
        }
        return (
            <p style={paraStyle} className="document-para">{this.buildSpans()}</p>
        );
    }
}
