// Calculate total localStorage usage in bytes
export function getLocalStorageUsage(): number {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      // UTF-16 encoding: each character is 2 bytes
      total += (localStorage[key].length + key.length) * 2;
    }
  }
  return total;
}

// Compress base64 image using canvas
export async function compressBase64Image(base64: string, quality: number = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      
      // Export as JPEG with specified quality
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64;
  });
}

// Calculate base64 string size in bytes
export function getBase64Size(base64: string): number {
  // Remove data URL prefix if present
  const base64Data = base64.split(',')[1] || base64;
  
  // Base64 encoding: 4 characters = 3 bytes
  // Account for padding
  const padding = (base64Data.match(/=/g) || []).length;
  return (base64Data.length * 3) / 4 - padding;
}
