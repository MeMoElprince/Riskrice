import { join } from 'path';

export const UPLOAD_PATH = join(process.cwd(), 'uploads');
export const VIEW_PATH = join(process.cwd(), 'views');
export const ROOT_PATH = join(process.cwd());

console.log('ROOT_PATH', ROOT_PATH);
console.log('UPLOAD_PATH', UPLOAD_PATH);
console.log('VIEW_PATH', VIEW_PATH);
