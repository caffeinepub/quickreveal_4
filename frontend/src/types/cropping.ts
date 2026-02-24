// TypeScript interface for crop parameters
export interface CropParams {
  scale: number; // Zoom factor (1.0 = original size, 1.5 = 150%, etc.)
  offsetX: number; // Horizontal offset percentage (-50 to 50)
  offsetY: number; // Vertical offset percentage (-50 to 50)
  imageBase64: string; // Base64 encoded image data
  originalWidth: number; // Original image width in pixels
  originalHeight: number; // Original image height in pixels
}

export interface ImageData {
  base64: string;
  cropParams: CropParams | null;
}
