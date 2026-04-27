import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDataFilePath(fileName: string): string {
  ensureDataDir();
  return path.join(DATA_DIR, fileName);
}

export function readJsonFile<T>(fileName: string, fallback: T): T {
  const filePath = getDataFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export function writeJsonFile<T>(fileName: string, payload: T): void {
  const filePath = getDataFilePath(fileName);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
}
