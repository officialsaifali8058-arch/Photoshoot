
/**
 * Pads a base64 encoded image to a target aspect ratio.
 * The image is centered on a black background.
 * @param base64Image The base64 data URL of the image.
 * @param targetRatio The target aspect ratio as a string (e.g., "16:9").
 * @returns A Promise that resolves with the new base64 data URL of the padded image in PNG format.
 */
export const resizeImageToAspectRatio = (base64Image: string, targetRatio: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            const [targetW, targetH] = targetRatio.split(':').map(Number);
            if (!targetW || !targetH) {
                return reject(new Error('Invalid aspect ratio format.'));
            }
            const targetAspectRatio = targetW / targetH;
            const imageAspectRatio = img.width / img.height;

            let canvasWidth, canvasHeight;
            let drawX, drawY, drawWidth, drawHeight;

            // The goal is to create a canvas with the target aspect ratio,
            // and fit the original image inside it, centered.
            if (targetAspectRatio > imageAspectRatio) {
                // Target is wider than the image (letterbox).
                // Set canvas height to image height, calculate width based on target ratio.
                canvasHeight = img.height;
                canvasWidth = img.height * targetAspectRatio;
                drawWidth = img.width;
                drawHeight = img.height;
                drawX = (canvasWidth - img.width) / 2; // Center horizontally
                drawY = 0;
            } else {
                // Target is taller than the image (pillarbox).
                // Set canvas width to image width, calculate height based on target ratio.
                canvasWidth = img.width;
                canvasHeight = img.width / targetAspectRatio;
                drawWidth = img.width;
                drawHeight = img.height;
                drawX = 0;
                drawY = (canvasHeight - img.height) / 2; // Center vertically
            }

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Fill canvas with a black background
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the original image onto the canvas
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            
            // Get the new base64 string as a PNG
            resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = (err) => reject(err instanceof Error ? err : new Error('Image loading failed'));
        img.src = base64Image;
    });
};
