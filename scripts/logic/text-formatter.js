const NEW_LINE = String.fromCharCode(10);
const LINE_BREAK_PATTERN = new RegExp(String.fromCharCode(13) + '?' + NEW_LINE);
const WORD_PATTERN = /[\p{L}\p{N}]+/gu;
const TITLE_CASE_PATTERN = /(^|\s|[-_])[\p{L}\p{N}]/gu;
const SENTENCE_CASE_PATTERN = /(^\s*[a-z]|[.!?]\s+[a-z])/g;

export function getWords(text) {
  return String(text ?? '').match(WORD_PATTERN) || [];
}

export function getWordParts(text) {
  return getWords(text).map((word) => word.toLowerCase());
}

export function countLines(text) {
  const value = String(text ?? '');
  return value ? value.split(LINE_BREAK_PATTERN).length : 0;
}

export function getTextStats(text) {
  const value = String(text ?? '');
  return {
    characters: value.length,
    words: getWords(value).length,
    lines: countLines(value)
  };
}

export function toTitleCase(text) {
  return String(text ?? '').toLowerCase().replace(TITLE_CASE_PATTERN, (match) => match.toUpperCase());
}

export function toSentenceCase(text) {
  return String(text ?? '').toLowerCase().replace(SENTENCE_CASE_PATTERN, (part) => part.toUpperCase());
}

export function toCamelCase(text) {
  return getWordParts(text).map((word, index) => index === 0 ? word : capitalize(word)).join('');
}

export function toPascalCase(text) {
  return getWordParts(text).map(capitalize).join('');
}

export function toSnakeCase(text) {
  return getWordParts(text).join('_');
}

export function toKebabCase(text) {
  return getWordParts(text).join('-');
}

function capitalize(word) {
  return word ? word[0].toUpperCase() + word.slice(1) : '';
}

export const textTransforms = [
  { label: 'Uppercase', apply: (text) => String(text ?? '').toUpperCase() },
  { label: 'Lowercase', apply: (text) => String(text ?? '').toLowerCase() },
  { label: 'Title Case', apply: toTitleCase },
  { label: 'Sentence Case', apply: toSentenceCase },
  { label: 'camelCase', apply: toCamelCase },
  { label: 'PascalCase', apply: toPascalCase },
  { label: 'snake_case', apply: toSnakeCase },
  { label: 'kebab-case', apply: toKebabCase }
];
