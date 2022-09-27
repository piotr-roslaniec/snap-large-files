const { promises: fs } = require('fs');
const path = require('path');

/**
 *
 * @param encoding
 */
async function main(encoding) {
  const fileSizes = [10, 25, 100];
  fileSizes.forEach(async (size) => {
    const file = path.join(__dirname, `../../../../large-files/${size}M.bin`);
    const fileBin = await fs.readFile(file);
    const fileEncoded = fileBin.toString(encoding);
    const jsFileString = `
    // THIS IS A GENERATED FILE. DO NOT EDIT.
    // SEE scripts/wasm-encode.js FOR MORE INFORMATION
    export const FILE_${size}M_${encoding.toUpperCase()}: string = '${fileEncoded}';
    `;
    await fs.writeFile(`./src/file-${size}M-${encoding}.ts`, jsFileString);
    console.log(`Encoded ${size}M file`);
  });
}

main('base64');
// main('hex');
