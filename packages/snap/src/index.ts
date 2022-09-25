import { OnRpcRequestHandler } from '@metamask/snap-types';
import { fetchLargeFile } from './fetch-files';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  // const t1 = Date.now();
  // const bytes = arrayBufferFromBase64(largeFile);
  // const t2 = Date.now();
  // const info = `Loaded bytes: ${bytes.length}\nStartup time: ${t2 - t1} ms`;
  // console.log(info);

  switch (request.method) {
    case 'hello':
      return await fetchLargeFile();
    default:
      throw new Error('Method not found.');
  }
};
