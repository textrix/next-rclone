import fs from 'fs';
import os from 'os';
import path from 'path';

let tmpDirFirst = null;
export function tmpDir() {
    if (!tmpDirFirst) {
        tmpDirFirst = path.normalize(`${os.tmpdir()}/nrr`);

        fs.mkdir(`${tmpDirFirst}`, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }

    return tmpDirFirst;
}
