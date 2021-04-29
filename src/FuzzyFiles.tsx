import React from "react";
import { useLocalStorage } from "./useLocalStorage";

interface FuzzyFilesProps {
  files: string[];
}

export const FuzzyFiles: React.FunctionComponent<FuzzyFilesProps> = (props) => {
  const [query, setQuery] = useLocalStorage("fuzzy-files.query", "");
  const regexp = new RegExp(query, "g");
  const MAX_RESULTS = 10;
  const candidates: HighlightedTextProps[] = [];
  for (var i = 0; i < props.files.length; i++) {
    const file = props.files[i];
    const match = regexp.exec(file);
    if (match) {
      candidates.push({
        text: file,
        positions: [
          {
            startOffset: regexp.lastIndex - match[0].length,
            endOffset: regexp.lastIndex,
          },
        ],
      });
    }
    if (candidates.length > MAX_RESULTS) {
      break;
    }
  }

  return (
    <>
      <input
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      ></input>
      <ul className="fuzzy-files-results">
        {candidates.map((f) => (
          <li key={f.text}>
            <Highlighted {...f} />
          </li>
        ))}
      </ul>
    </>
  );
};

interface RangePosition {
  startOffset: number;
  endOffset: number;
}

interface HighlightedTextProps {
  text: string;
  positions: RangePosition[];
}
const Highlighted: React.FunctionComponent<HighlightedTextProps> = (props) => {
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
      start = pos.endOffset;
    }
    pushSpan("fuzzy-files-highlighted", pos.startOffset, pos.endOffset);
  }
  pushSpan("fuzzy-files-plaintext", start, props.text.length);
  console.log(props.positions);

  return <>{spans}</>;
};
