import React from "react";
import { HighlightedText, HighlightedTextProps } from "./HighlightedText";
import { useLocalStorage } from "./useLocalStorage";

interface FuzzyFilesProps {
  files: string[];
}

export const FuzzyFiles: React.FunctionComponent<FuzzyFilesProps> = (props) => {
  const [query, setQuery] = useLocalStorage("fuzzy-files.query", "");
  const start = new Date();
  const regexp = new RegExp(query, "g");
  const MAX_RESULTS = 100;
  const candidates: HighlightedTextProps[] = [];
  for (var i = 0; i < props.files.length; i++) {
    if (candidates.length >= MAX_RESULTS) {
      break;
    }
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
  }
  const end = new Date();
  const elapsed = Math.max(0, end.getMilliseconds() - start.getMilliseconds());

  return (
    <>
      <input
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      ></input>
      <p>
        {candidates.length} results in {elapsed}ms
      </p>
      <ul className="fuzzy-files-results">
        {candidates.map((f) => (
          <li key={f.text}>
            <HighlightedText {...f} />
          </li>
        ))}
      </ul>
    </>
  );
};
