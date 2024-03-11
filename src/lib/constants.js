import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// dirname ends up coming from the build/server/chunks folder,
// we want the files to be in the main folder
const dir = `${__dirname}/../../../files`;

export const FILES = dir;