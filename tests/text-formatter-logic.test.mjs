import assert from 'node:assert/strict';
import { countLines, getTextStats, getWords, toCamelCase, toKebabCase, toPascalCase, toSentenceCase, toSnakeCase, toTitleCase } from '../scripts/logic/text-formatter.js';

assert.deepEqual(getWords('Hello, world 123!'), ['Hello', 'world', '123']);
assert.equal(countLines(''), 0);
assert.equal(countLines(`one
two
three`), 3);
assert.deepEqual(getTextStats(`Hi all
again`), { characters: 12, words: 3, lines: 2 });

assert.equal(toTitleCase('hello world-from_devtoolkit'), 'Hello World-From_Devtoolkit');
assert.equal(toSentenceCase('hello world. next line! done?'), 'Hello world. Next line! Done?');
assert.equal(toCamelCase('hello world dev toolkit'), 'helloWorldDevToolkit');
assert.equal(toPascalCase('hello world dev toolkit'), 'HelloWorldDevToolkit');
assert.equal(toSnakeCase('Hello world DevToolkit'), 'hello_world_devtoolkit');
assert.equal(toKebabCase('Hello world DevToolkit'), 'hello-world-devtoolkit');

console.log('Text Formatter logic tests passed.');
