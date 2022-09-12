# snap-large-files

This repo shows how to load large files into a snap.

We're going to use measure performance of loading files from snap (package) sources, and from GitHub.

## Usage

Notice that `packages/snap/scripts/file-encode.js` depends on access to [some large files](https://github.com/piotr-roslaniec/snap-large-files). I recommend cloning the repo or recreating files locally.

To run the snap, run:

```sh
yarn install
yarn start
```

See the original `README.md` in `README.old.md` file for more information.

## Results

Notice that base64-encoded files are actually ~33% larger than the original files. This is because base64 encoding uses 6 bits per character, and 8 bits per byte.

```bash
$ du -h src/file-*
134M	src/file-100M-base64.ts
14M	src/file-10M-base64.ts
34M	src/file-25M-base64.ts
```

| Type                      | Size (bytes, M) | Load time (ms) |
| ------------------------- | :-------------: | -------------: |
| In source, base64-encoded |       10        |          ~1200 |
| In source, base64-encoded |       25        |          ~2800 |
| In source, base64-encoded |       100       |       Crashes! |
| On GH, binary             |       10        |           ~953 |
| On GH, binary             |       25        |          ~2580 |
| On GH, binary             |       100       |          ~5540 |

## Current issues

Loading large files from snap sources is not possible. The snap crashes when trying to load a 100MB-sized file.

The size of the bundle is 134M, so we're probably hitting the limit on the bundle size. However, loading from external sources (from GH using fetch) may still be possible.

```bash
$ du -h dist/bundle.js
134M	dist/bundle.js
```
