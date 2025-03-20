#!/usr/bin/env node

import { program } from 'commander';
import { loadPage } from '../src/utils';

program
  .version('1.0.0')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output directory', process.cwd())
  .arguments('<url>')
  .action(async (url) => {
    try {
      const { filePath } = await loadPage(url, program.opts().output);
      console.log(filePath);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  })
  .parse(process.argv);
