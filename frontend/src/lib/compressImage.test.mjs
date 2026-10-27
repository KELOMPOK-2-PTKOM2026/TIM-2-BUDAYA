import assert from 'node:assert';
import { compressImage, resolveImageUrl } from './media.js';

async function testCompressImageFallback() {
  const dummyFile = { name: 'sample.jpg', type: 'image/jpeg', size: 1024 * 1024 };
  const result = await compressImage(dummyFile);
  assert.strictEqual(result, dummyFile, 'Fallback non-browser harus mengembalikan file asli tanpa error.');

  const webpFile = { name: 'small.webp', type: 'image/webp', size: 100 * 1024 };
  const webpResult = await compressImage(webpFile);
  assert.strictEqual(webpResult, webpFile, 'File WebP yang sudah kecil tidak perlu diproses ulang.');

  const svgFile = { name: 'icon.svg', type: 'image/svg+xml', size: 500 * 1024 };
  const svgResult = await compressImage(svgFile);
  assert.strictEqual(svgResult, svgFile, 'File SVG tidak boleh dikompres lewat canvas.');

  // Test resolveImageUrl path sanitization (avoid double /storage/)
  const resolvedWithStorage = resolveImageUrl('/storage/cultures/sample.webp', { slug: 'kuliner' });
  assert.strictEqual(
    resolvedWithStorage.includes('/storage//storage/'),
    false,
    'URL tidak boleh mengandung double /storage//'
  );
  assert.strictEqual(
    resolvedWithStorage.endsWith('/storage/cultures/sample.webp'),
    true,
    'URL harus berakhir dengan /storage/cultures/sample.webp'
  );

  const resolvedWithoutSlash = resolveImageUrl('storage/cultures/sample.webp', { slug: 'kuliner' });
  assert.strictEqual(
    resolvedWithoutSlash.endsWith('/storage/cultures/sample.webp'),
    true,
    'Path tanpa leading slash juga harus bersih'
  );

  console.log('compressImage & resolveImageUrl assertions passed.');
}

testCompressImageFallback().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
