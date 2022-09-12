import { OnRpcRequestHandler } from '@metamask/snap-types';

// Using code-splitted import to avoid bundling all of the files in the package
// Uncomment and run these one by one:
// import { FILE_10M_BASE64 as largeFile } from './file-10M-base64'; // ~1200 ms
// import { FILE_25M_BASE64 as largeFile } from './file-25M-base64'; // ~2800 ms
// import { FILE_100M_BASE64 as largeFile } from './file-100M-base64'; // Crashes!

const arrayBufferFromBase64 = (base64String: string) =>
  Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));

const REMOTE_FILES = [10, 25, 100].map(
  (size) =>
    `https://raw.githubusercontent.com/piotr-roslaniec/large-files/48d47e6ced425c264a742294d6208f351040a4e7/${size}M.bin`,
);

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  // const t1 = Date.now();
  // const bytes = arrayBufferFromBase64(largeFile);
  // const t2 = Date.now();
  // const info = `Loaded bytes: ${bytes.length}\nStartup time: ${t2 - t1} ms`;
  // console.log(info);

  for (const url of REMOTE_FILES) {
    const t1 = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
    });
    const bytes = await response.arrayBuffer();
    const t2 = Date.now();
    // TODO: For some reason fetch is non blocking and so the data returned here is not reliable
    // The data in BENCHMARK.MD has been taken from browsers "Net"
    const info =
      `Url: ${url}\n` +
      `Loaded bytes: ${bytes.byteLength}\n` +
      `Startup time: ${t2 - t1} ms`;
    console.log(info);
  }

  switch (request.method) {
    case 'hello':
      return true;
    default:
      throw new Error('Method not found.');
  }
};
