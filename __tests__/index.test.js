import { beforeEach, describe, expect } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import nock from 'nock';
import { generateFilename, loadPage } from '../src/utils.js';

const baseUrl = 'https://ru.hexlet.io';
test('generateFilename should convert URL to valid filename', () => {
  const url = `${baseUrl}/courses`;
  const expected = 'ru-hexlet-io-courses.html';
  expect(generateFilename(url)).toBe(expected);
});

describe('loadPage', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  test('should download page and save to file', async () => {
    const url = `${baseUrl}/courses`;
    const scope = nock(baseUrl).get('/courses').reply(200, 'test content');

    const { filePath } = await loadPage(url, tmpDir);
    const content = await fs.readFile(filePath, 'utf-8');

    expect(content).toBe('test content');
    expect(path.basename(filePath)).toBe('ru-hexlet-io-courses.html');
    scope.done();
  });

  test('should throw error if page is not available', async () => {
    const url = `${baseUrl}/courses`;

    nock(baseUrl).get('/courses').reply(404);

    await expect(loadPage(url, tmpDir)).rejects.toThrow();
  });
});
