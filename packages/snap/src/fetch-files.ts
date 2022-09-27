export const fetchFile = async (url: string) => {
  console.log(`Start fetching file at: ${url}`);
  const t1 = Date.now();
  const response = await fetch(url, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch a file: ${url}`);
  }

  const bytes = await response.arrayBuffer();
  console.log(`Fetched ${bytes.byteLength} bytes`);

  const t2 = Date.now();
  const info =
    `Url: ${url}\n` +
    `Loaded bytes: ${bytes.byteLength}\n` +
    `Startup time: ${t2 - t1} ms`;
  console.log(info);

  return bytes;
};

const fetchLfsFile = async (url: string) => {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch LFS file info: ${url}`);
  }
  const text = await resp.text();
  const oid = text.split('sha256:')[1].split('\n')[0].trim();
  const size = parseInt(text.split('size ')[1].trim(), 10);

  const lfsUrl = `https://github.com/piotr-roslaniec/large-files-lfs.git/info/lfs/objects/batch`;
  // The CORS error:
  /*
    metamask.github.io/:1 Access to fetch at 'https://github.com/piotr-roslaniec/large-files-lfs.git/info/lfs/objects/batch' 
    from origin 'https://metamask.github.io' has been blocked by CORS policy: Response to preflight request doesn't pass 
    access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque 
    response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
  */
  const lfsResp = await fetch(lfsUrl, {
    mode: 'no-cors', // Comment-out to get the original CORS error
    method: 'POST',
    headers: {
      Accept: 'application/vnd.git-lfs+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operation: 'download',
      transfers: ['basic'],
      objects: [
        {
          oid,
          size,
        },
      ],
    }),
  });
  if (!lfsResp.ok) {
    throw new Error(`Failed to fetch LFS file: ${lfsUrl}`);
  }
  const lfsJson = await lfsResp.json();
  console.log({ lfsJson });
  const lfsFileUrl = lfsJson.objects[0].actions.download.href;

  const bytes = await fetchFile(lfsFileUrl);
  return bytes;
};

const BASE_URL =
  'https://raw.githubusercontent.com/piotr-roslaniec/large-files-lfs/8d4dafa274833c71c63de6f7611123fe8f3da4d0';
const LARGE_FILE_URL = `${BASE_URL}/100M.bin`;

export const fetchLargeFile = () => fetchLfsFile(LARGE_FILE_URL);
