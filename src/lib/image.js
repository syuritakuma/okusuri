/* 写真の読み込みです。
   写真はそのままだと端末の保存容量を使いすぎるため、長辺600pxのJPEGに縮めてから保存します。 */

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_SIDE = 600;

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export async function loadResizedImage(file) {
  const original = await readAsDataURL(file);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const cv = document.createElement("canvas");
      cv.width = Math.max(1, Math.round(img.width * scale));
      cv.height = Math.max(1, Math.round(img.height * scale));
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      try {
        resolve(cv.toDataURL("image/jpeg", 0.8));
      } catch (e) {
        resolve(original);
      }
    };
    // 縮められない形式のときは、元の画像をそのまま使います
    img.onerror = () => resolve(original);
    img.src = original;
  });
}
