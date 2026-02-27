import { sampleStoryboard } from '../src/storyboard/sampleStoryboard.js';
import { validateStoryboard } from '../src/storyboard/storyboardSchema.js';

const result = validateStoryboard(sampleStoryboard);
if (!result.valid) {
  console.error('Storyboard is invalid:');
  for (const error of result.errors) {
    console.error(`- ${error.path}: ${error.message}`);
  }
  process.exit(1);
}

console.log('Storyboard is valid.');
