import { OnRpcRequestHandler } from '@metamask/snap-types';

const fetchFile = async (url: string) => {
  console.log('start fetching file');
  const t1 = Date.now();
  const response = await fetch(url, {
    method: 'GET',
    // mode: 'no-cors',
  });
  console.log(response);
  const bytes = await response.arrayBuffer();
  console.log(`fetchedd ${bytes.byteLength}`);

  const t2 = Date.now();

  const info =
    `Url: ${url}\n` +
    `Loaded bytes: ${bytes.byteLength}\n` +
    `Startup time: ${t2 - t1} ms`;

  console.log(info);
  
  return info;
};

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
      return await fetchFile(request.params[0]);
    default:
      throw new Error('Method not found.');
  }
};
