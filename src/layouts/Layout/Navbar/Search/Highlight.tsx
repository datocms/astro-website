import reactStringReplace from 'react-string-replace';

export function Highlight({ children, regexp }: { children: string; regexp: RegExp }) {
  return reactStringReplace(children, regexp, (match, index) => (
    <mark key={index.toString()}>{match}</mark>
  ));
}
