import { Readable, Writable } from 'stream';

export interface CommandContext {
  cwd: string;
  quiet: boolean;
  stdin: Readable;
  stdout: Writable;
  stderr: Writable;
}
