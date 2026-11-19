import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { uploadImageToCloudinary } from './uploadFile';

describe('uploadImageToCloudinary', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should reject when no file is provided', async () => {
    const result = await uploadImageToCloudinary(null as any);
    expect(result.success).toBe(false);
    expect(result.error).toContain('No file provided');
  });

  it('should reject unsupported file MIME types', async () => {
    const file = new File(['mock content'], 'test.pdf', { type: 'application/pdf' });
    const result = await uploadImageToCloudinary(file);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });

  it('should reject files exceeding 10MB limit', async () => {
    const largeFile = new File(['x'], 'huge.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

    const result = await uploadImageToCloudinary(largeFile);
    expect(result.success).toBe(false);
    expect(result.error).toContain('exceeds the 10MB limit');
  });

  it('should reject if Cloudinary environment variables are missing', async () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const file = new File(['valid'], 'photo.jpg', { type: 'image/jpeg' });
    const result = await uploadImageToCloudinary(file);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Cloudinary upload is not configured');
  });

  it('should resolve successfully with URL on successful XHR upload', async () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = 'test_preset';
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test_cloud';

    const mockXHR = {
      open: vi.fn(),
      send: vi.fn(function (this: any) {
        this.status = 200;
        this.responseText = JSON.stringify({
          secure_url: 'https://res.cloudinary.com/test_cloud/image/upload/v123/photo.jpg',
        });
        if (this.onload) this.onload();
      }),
      upload: {
        onprogress: null,
      },
      status: 200,
      responseText: '',
      onload: null as any,
      onerror: null as any,
      ontimeout: null as any,
      timeout: 0,
    };

    vi.stubGlobal(
      'XMLHttpRequest',
      vi.fn().mockImplementation(function (this: any) {
        return mockXHR;
      }),
    );

    const file = new File(['img_data'], 'photo.png', { type: 'image/png' });
    const result = await uploadImageToCloudinary(file);

    expect(result.success).toBe(true);
    expect(result.url).toBe(
      'https://res.cloudinary.com/test_cloud/image/upload/v123/photo.jpg',
    );
    expect(result.error).toBeNull();
  });
});
