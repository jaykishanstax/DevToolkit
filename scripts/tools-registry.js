export const categories = [
  { id: 'text', name: 'Text Tools' },
  { id: 'json', name: 'JSON Tools' },
  { id: 'security', name: 'Security Tools' },
  { id: 'web', name: 'Web Tools' },
  { id: 'ai', name: 'AI Tools' }
];

export const tools = [
  { id: 'text-diff', title: 'Diff Checker', categoryId: 'text', category: 'Text Tools', description: 'Compare two text blocks with line and inline differences.', keywords: ['diff', 'compare', 'text'], load: () => import('../tools/text-diff.js') },
  { id: 'regex-tester', title: 'Regex Tester', categoryId: 'text', category: 'Text Tools', description: 'Test JavaScript regular expressions with match highlighting.', keywords: ['regex', 'regexp', 'match'], load: () => import('../tools/regex-tester.js') },
  { id: 'text-formatter', title: 'Text Formatter', categoryId: 'text', category: 'Text Tools', description: 'Convert text case and inspect character, word, and line counts.', keywords: ['case', 'uppercase', 'camelcase'], load: () => import('../tools/text-formatter.js') },
  { id: 'json-formatter', title: 'JSON Formatter', categoryId: 'json', category: 'JSON Tools', description: 'Validate, pretty print, minify, sort, and inspect JSON.', keywords: ['json', 'format', 'minify', 'tree'], load: () => import('../tools/json-formatter.js') },
  { id: 'json-compare', title: 'JSON Compare', categoryId: 'json', category: 'JSON Tools', description: 'Compare JSON documents and highlight added, removed, and changed fields.', keywords: ['json', 'compare', 'diff'], load: () => import('../tools/json-compare.js') },
  { id: 'json-path-tester', title: 'JSON Path Tester', categoryId: 'json', category: 'JSON Tools', description: 'Evaluate a practical JSONPath subset against JSON documents.', keywords: ['jsonpath', 'path', 'query'], load: () => import('../tools/json-path-tester.js') },
  { id: 'base64-tool', title: 'Base64 Tool', categoryId: 'security', category: 'Security Tools', description: 'Encode and decode UTF-8 text or convert files to Base64.', keywords: ['base64', 'encode', 'decode'], load: () => import('../tools/base64-tool.js') },
  { id: 'jwt-decoder', title: 'JWT Decoder', categoryId: 'security', category: 'Security Tools', description: 'Decode JWT headers and payloads with timestamp warnings.', keywords: ['jwt', 'token', 'decode'], load: () => import('../tools/jwt-decoder.js') },
  { id: 'hash-generator', title: 'Hash Generator', categoryId: 'security', category: 'Security Tools', description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.', keywords: ['hash', 'sha', 'md5'], load: () => import('../tools/hash-generator.js') },
  { id: 'uuid-generator', title: 'UUID Generator', categoryId: 'security', category: 'Security Tools', description: 'Generate secure UUID v4 values in bulk.', keywords: ['uuid', 'guid', 'random'], load: () => import('../tools/uuid-generator.js') },
  { id: 'html-preview', title: 'HTML Preview', categoryId: 'web', category: 'Web Tools', description: 'Preview HTML live in a sandboxed iframe and download it.', keywords: ['html', 'preview', 'iframe'], load: () => import('../tools/html-preview.js') },
  { id: 'css-generator', title: 'CSS Generator', categoryId: 'web', category: 'Web Tools', description: 'Generate button, gradient, shadow, and radius CSS visually.', keywords: ['css', 'generator', 'gradient', 'shadow'], load: () => import('../tools/css-generator.js') },
  { id: 'token-counter', title: 'Token Counter', categoryId: 'ai', category: 'AI Tools', description: 'Estimate tokens and costs for AI prompt text.', keywords: ['tokens', 'ai', 'cost'], load: () => import('../tools/token-counter.js') },
  { id: 'prompt-builder', title: 'Prompt Builder', categoryId: 'ai', category: 'AI Tools', description: 'Compose structured prompts from reusable sections.', keywords: ['prompt', 'ai', 'builder'], load: () => import('../tools/prompt-builder.js') }
];

export function getTool(id) { return tools.find((tool) => tool.id === id); }
export function getCategory(id) { return categories.find((category) => category.id === id); }
export function getToolsByCategory(categoryId) { return tools.filter((tool) => tool.categoryId === categoryId); }
