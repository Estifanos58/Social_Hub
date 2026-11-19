export interface UploadResult {
  success: boolean;
  error: string | null;
  url: string | null;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return new Promise((resolve) => {
    if (!file) {
      return resolve({
        success: false,
        error: "No file provided",
        url: null,
      });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return resolve({
        success: false,
        error: "Invalid file type. Please upload a JPEG, PNG, GIF, WebP, or SVG image.",
        url: null,
      });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return resolve({
        success: false,
        error: "File size exceeds the 10MB limit.",
        url: null,
      });
    }

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
      return resolve({
        success: false,
        error: "Cloudinary upload is not configured (missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)",
        url: null,
      });
    }

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true);
    xhr.timeout = 60000; // 60s timeout

    // Track progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && response.secure_url) {
          resolve({
            success: true,
            error: null,
            url: response.secure_url,
          });
        } else {
          const message =
            response?.error?.message ||
            `Upload failed with status code ${xhr.status}`;
          resolve({
            success: false,
            error: message,
            url: null,
          });
        }
      } catch {
        resolve({
          success: false,
          error: "Failed to parse upload service response",
          url: null,
        });
      }
    };

    xhr.onerror = () => {
      resolve({
        success: false,
        error: "Network error occurred during image upload.",
        url: null,
      });
    };

    xhr.ontimeout = () => {
      resolve({
        success: false,
        error: "Upload timed out. Please check your internet connection.",
        url: null,
      });
    };

    xhr.send(formDataCloud);
  });
}
