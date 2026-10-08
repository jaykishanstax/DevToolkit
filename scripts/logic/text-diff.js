const NEW_LINE = String.fromCharCode(10);
const LINE_BREAK_PATTERN = new RegExp(String.fromCharCode(13) + '?' + NEW_LINE);

export function normalizeDiffLine(value, { ignoreWhitespace = false } = {}) {
  const text = String(value ?? '');
  return ignoreWhitespace ? text.replace(/[ 	]+/g, ' ').trimEnd() : text;
}

export function splitLines(text, options = {}) {
  return String(text ?? '').split(LINE_BREAK_PATTERN).map((line) => normalizeDiffLine(line, options));
}

export function createLineDiff(originalText, changedText, options = {}) {
  const left = splitLines(originalText, options);
  const right = splitLines(changedText, options);
  const dp = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      dp[i][j] = left[i] === right[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const rows = [];
  let i = 0;
  let j = 0;

  while (i < left.length || j < right.length) {
    if (i < left.length && j < right.length && left[i] === right[j]) {
      rows.push({ type: 'same', left: left[i], right: right[j] });
      i += 1;
      j += 1;
    } else if (j < right.length && (i === left.length || dp[i][j + 1] >= dp[i + 1][j])) {
      rows.push({ type: 'add', left: '', right: right[j] });
      j += 1;
    } else {
      rows.push({ type: 'remove', left: left[i], right: '' });
      i += 1;
    }
  }

  return pairModifiedRows(rows);
}

function pairModifiedRows(rows) {
  const paired = [];
  for (let index = 0; index < rows.length; index += 1) {
    const current = rows[index];
    const next = rows[index + 1];
    if (current?.type === 'remove' && next?.type === 'add') {
      paired.push({ type: 'change', left: current.left, right: next.right, words: createWordDiff(current.left, next.right) });
      index += 1;
    } else if (current?.type === 'add' && next?.type === 'remove') {
      paired.push({ type: 'change', left: next.left, right: current.right, words: createWordDiff(next.left, current.right) });
      index += 1;
    } else {
      paired.push(current);
    }
  }
  return paired;
}

export function createWordDiff(originalLine, changedLine) {
  const left = tokenizeWords(originalLine);
  const right = tokenizeWords(changedLine);
  const dp = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      dp[i][j] = left[i] === right[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const removed = [];
  const added = [];
  let i = 0;
  let j = 0;

  while (i < left.length || j < right.length) {
    if (i < left.length && j < right.length && left[i] === right[j]) {
      removed.push({ type: 'same', value: left[i] });
      added.push({ type: 'same', value: right[j] });
      i += 1;
      j += 1;
    } else if (j < right.length && (i === left.length || dp[i][j + 1] >= dp[i + 1][j])) {
      added.push({ type: 'add', value: right[j] });
      j += 1;
    } else {
      removed.push({ type: 'remove', value: left[i] });
      i += 1;
    }
  }

  return { removed, added };
}

function tokenizeWords(value) {
  return String(value ?? '').match(/\s+|[^\s]+/g) ?? [];
}

export function diffToText(rows) {
  return rows.map((row) => {
    if (row.type === 'same') return `  ${row.left}`;
    if (row.type === 'add') return `+ ${row.right}`;
    if (row.type === 'remove') return `- ${row.left}`;
    return [`~ - ${row.left}`, `~ + ${row.right}`].join(NEW_LINE);
  }).join(NEW_LINE);
}

export function summarizeDiff(rows) {
  return rows.reduce((summary, row) => {
    if (row.type === 'add') summary.added += 1;
    if (row.type === 'remove') summary.removed += 1;
    if (row.type === 'change') summary.changed += 1;
    return summary;
  }, { added: 0, removed: 0, changed: 0 });
}
