import fs from '../paths';

export default function hasSvgFilesInDirectory(dir: string | string[]): boolean {
  if (typeof dir === 'string') {
    const files = fs.readdirSync(dir);
    return files.some((filename: string) => filename.endsWith('.svg'));
  } else if (Array.isArray(dir)) {
    return dir.some(subDir => {
      const files = fs.readdirSync(subDir);
      return files.some((filename: string) => filename.endsWith('.svg'));
    });
  }
  return false;
}