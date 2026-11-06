import { Signale } from 'signale';
import * as fs from 'fs';

// Test that Signale accepts a standard fs.WriteStream
const stream = fs.createWriteStream('test.log');
const logger = new Signale({ stream });

logger.info('Testing type compatibility with fs.WriteStream');
