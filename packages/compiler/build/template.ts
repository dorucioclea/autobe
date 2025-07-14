import { FileSystemIterator } from "@autobe/filesystem";
import fs from "fs";

const template = async (props: {
  root: string;
  name: string;
}): Promise<void> => {
  const files: Record<string, string> = await FileSystemIterator.read({
    root: props.root,
  });
  await fs.promises.writeFile(
    `${__dirname}/../src/raw/${props.name}.ts`,
    [
      `export const ${props.name}: Record<string, string> = ${JSON.stringify(files, null, 2)};`,
    ].join("\n"),
    "utf8",
  );
};

const main = async (): Promise<void> => {
  try {
    await fs.promises.mkdir(`${__dirname}/../src/raw`);
  } catch {}
  await template({
    root: `${__dirname}/../../../internals/template/interface`,
    name: "AutoBeCompilerInterfaceTemplate",
  });
  await template({
    root: `${__dirname}/../../../internals/template/test`,
    name: "AutoBeCompilerTestTemplate",
  });
  await template({
    root: `${__dirname}/../../../internals/template/realize`,
    name: "AutoBeCompilerRealizeTemplate",
  });
};
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
