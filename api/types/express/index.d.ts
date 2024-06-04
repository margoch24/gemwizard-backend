// api/types/express/index.d.ts

import { FileType } from 'types/global';

declare global {
  namespace Express {
    export interface Request {
      file?: FileType;
    }
  }
}
export {};
