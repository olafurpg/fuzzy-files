import React from "react";

export interface RangePosition {
  startOffset: number;
  endOffset: number;
}

export interface HighlightedTextProps {
  text: string;
  positions: RangePosition[];
}

export const HighlightedText: React.FunctionComponent<HighlightedTextProps> = (
  props
) => {
  const spans: JSX.Element[] = [];
  let start = 0;
  function pushSpan(
    className: string,
    startOffset: number,
    endOffset: number
  ): void {
    if (startOffset >= endOffset) return;
    const span = (
      <span className={className}>
        {props.text.substring(startOffset, endOffset)}
      </span>
    );
    spans.push(span);
  }
  for (let i = 0; i < props.positions.length; i++) {
    const pos = props.positions[i];
    if (pos.startOffset > start) {
      pushSpan("fuzzy-files-plaintext", start, pos.startOffset);
    }
    start = pos.endOffset;
    pushSpan("fuzzy-files-highlighted", pos.startOffset, pos.endOffset);
  }
  pushSpan("fuzzy-files-plaintext", start, props.text.length);
  console.log(props.positions);

  return <>{spans}</>;
};
