import { OnRpcRequestHandler } from '@metamask/snap-types';

// Using code-splitted import to avoid bundling all of the files in the package
// Uncomment and run these one by one:
// import { FILE_10M_BASE64 as largeFile } from './file-10M-base64'; // ~1200 ms
// import { FILE_25M_BASE64 as largeFile } from './file-25M-base64'; // ~2800 ms
import { FILE_100M_BASE64 as largeFile } from './file-100M-base64'; // Crashes!

const arrayBufferFromBase64 = (base64String: string) =>
  Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));

export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  const t1 = Date.now();
  const bytes = arrayBufferFromBase64(largeFile);
  const t2 = Date.now();

  const info = `Loaded bytes: ${bytes.length}\nStartup time: ${t2 - t1} ms`;
  console.log(info);

  switch (request.method) {
    case 'hello':
      return info;
    default:
      throw new Error('Method not found.');
  }
};
