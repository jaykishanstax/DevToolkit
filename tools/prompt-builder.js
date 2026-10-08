import { createEditor } from '../components/editor.js';
import { createToolbar } from '../components/toolbar.js';
import { copyText } from '../scripts/clipboard.js';
import { downloadText } from '../scripts/download.js';
import { getPromptDraft, setPromptDraft } from '../scripts/state.js';
import { showToast } from '../components/toast.js';

const fields = ['role', 'task', 'context', 'rules', 'outputFormat'];
const labels = { role: 'Role', task: 'Task', context: 'Context', rules: 'Rules', outputFormat: 'Output format' };

export function render(container) {
  const draft = getPromptDraft();
  const layout = document.createElement('div');
  layout.className = 'tool-layout';
  const inputs = {};
  const left = document.createElement('section');
  left.className = 'panel';
  const right = document.createElement('section');
  right.className = 'panel';
  right.innerHTML = '<h2>Generated prompt</h2>';
  const output = document.createElement('textarea');
  output.className = 'code-editor monospace prompt-output';
  output.setAttribute('aria-label', 'Generated prompt');
  fields.forEach((key) => {
    const editor = createEditor({ label: labels[key], value: draft[key] || '', rows: 4, onInput: update });
    inputs[key] = editor.textarea;
    left.append(editor.wrapper);
  });
  right.append(output);
  const toolbar = createToolbar([
    { label: 'Copy prompt', variant: 'primary', onClick: () => copyText(output.value) },
    { label: 'Export .txt', onClick: () => downloadText('prompt.txt', output.value) },
    { label: 'Export .md', onClick: () => downloadText('prompt.md', output.value, 'text/markdown') },
    { label: 'Save draft', onClick: save }
  ]);
  layout.append(left, right);
  container.append(toolbar, layout);
  document.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); save(); } });
  function data() { return Object.fromEntries(fields.map((key) => [key, inputs[key].value])); }
  function save() { setPromptDraft(data()); showToast('Prompt draft saved locally.', 'success'); }
  function update() {
    const draftData = data();
    output.value = `# Role
${draftData.role}

# Task
${draftData.task}

# Context
${draftData.context}

# Rules
${draftData.rules}

# Output Format
${draftData.outputFormat}`;
    setPromptDraft(draftData);
  }
  update();
}
