import * as React from "react";
import measureText from "measure-text";

export interface ParagraphProps {
    /**
     * The content of the paragraph.
     */
    text: string;
    
    /**
     * The width of the paragraph element (or the area it can take up) in pixels.
     */
    width: number;
}

const textStyle: React.CSSProperties = {
    fontFamily: "Arial",
    fontSize: "16px",
    lineHeight: "20px",
    textAlign: "justify",
};

/**
 * Generate inline style for a line.
 * This is purely to help differentiate lines so overflow issues are obvious.
 */
const getLineStyle = (index: number): React.CSSProperties => {
    return index % 2 === 0 ? { background: "#DDD" } : { };
}

export class Paragraph extends React.Component<ParagraphProps, {}> {
    private spaceWidth: number;

    public constructor(props: ParagraphProps) {
        super(props);
        this.spaceWidth = measureText({ text: " ", ...textStyle }).width.value;
    }

    /**
     * Split a string of text into lines which will fit on the page.
     * 
     * EXPENSIVE: Requires measuring text and iterating through the text to build up lines.
     * For now, this is done word by word because we want to break lines on whole words. It could equally be done character by character,
     * and longer-term that may be faster as you would only need to measure the alphabet once per text style.
     */
    private splitTextIntoLines(): string[] {
        const words =  this.props.text.split(" ");
        const wordWidths = words.reduce((out, text) => {
            out[text] = measureText({ text, ...textStyle }).width.value;
            return out;
        }, {});

        const lines = [];
        let wordsInCurrentLine = [];
        let currentLineWidth = 0;
        for (const word of words) {
            const wordWidth = wordWidths[word];

            // If the next word doesn't fit on the current line, start a new line
            if ((currentLineWidth + this.spaceWidth + wordWidth) > this.props.width) {
                lines.push(wordsInCurrentLine.join(" ") + " ");
                console.log("Finished line ", currentLineWidth, lines[lines.length-1])
                wordsInCurrentLine = [];
                currentLineWidth = 0;
            }

            currentLineWidth += (wordsInCurrentLine.length === 0 ? 0 : this.spaceWidth) + wordWidth;
            wordsInCurrentLine.push(word);
        }
        lines.push(wordsInCurrentLine.join(" "));
        return lines;
    }

    render() {
        const lines = this.splitTextIntoLines().map((text, index) => (<span key={index} style={getLineStyle(index)}>{text}</span>));

        return (
            <p style={textStyle}>{lines}</p>
        );
    }
}
