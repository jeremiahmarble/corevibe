import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT_PATH = path.join(__dirname, '..', '..', 'prompts', 'system.txt');

export async function loadSystemPrompt() {
  const text = await readFile(SYSTEM_PROMPT_PATH, 'utf8');
  return text.trimEnd();
}
