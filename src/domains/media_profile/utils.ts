import fs from "fs";
import path from "path";

export function save(content: string, name: string) {
  fs.writeFileSync(path.resolve(process.cwd(), `./mock/${name}`), content);
}
