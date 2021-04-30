import React from "react";
import { HighlightedText, HighlightedTextProps } from "./HighlightedText";
import { useLocalStorage } from "./useLocalStorage";

export interface QueryProps {
  value: string;
  maxResults: number;
}
export interface FuzzyFilesProps {
  search(query: QueryProps): HighlightedTextProps[];
}

const MAX_RESULTS = 100;

export const FuzzyFiles: React.FunctionComponent<FuzzyFilesProps> = (props) => {
  const [query, setQuery] = useLocalStorage<string>("fuzzy-files.query", "");
  const start = new Date();
  const candidates = props.search({
    value: query,
    maxResults: MAX_RESULTS,
  });

  // console.log(`query=${query} candidates=${candidates.map((e) => e.text)}`);
  const end = new Date();
  const elapsed = Math.max(0, end.getMilliseconds() - start.getMilliseconds());
  const visibleCandidates = candidates.slice(0, MAX_RESULTS);
  const nonVisibleCandidates = candidates.length - visibleCandidates.length;

  return (
    <>
      <input
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      ></input>
      <p>
        {candidates.length} result{candidates.length !== 1 && "s"} in {elapsed}
        ms
        {nonVisibleCandidates > 1 &&
          ` (only showing top ${MAX_RESULTS} results)`}
      </p>
      <ul className="fuzzy-files-results">
        {candidates.slice(0, MAX_RESULTS).map((f) => (
          <li key={f.text}>
            <HighlightedText value={f} />
          </li>
        ))}
        {nonVisibleCandidates > 0 && (
          <li>
            (...{nonVisibleCandidates} hidden results, type more to narrow your
            filter)
          </li>
        )}
      </ul>
    </>
  );
};
