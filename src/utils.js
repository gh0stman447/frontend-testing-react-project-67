import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

export const generateFilename = (url) => {
  const cleanedUrl = url.replace(/^https?:\/\//, '');
  const normalized = cleanedUrl.replace(/[^a-zA-Z0-9]/g, '-');
  return `${normalized}.html`;
};

const load = async (url, outputDir) => {
  const { data } = await axios.get(url);

  const filename = generateFilename(url);
  const filePath = path.join(outputDir, filename);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(filePath, data);

  return { filePath };
};

export const loadPage = async (url, outputDir = process.cwd()) => {
  try {
    return load(url, outputDir);
  } catch (error) {
    throw new Error('Request failed with status');
  }
};
