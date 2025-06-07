import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import argparse

def load_image(image_path):
    """Load an image from file path"""
    try:
        img = Image.open(image_path)
        return np.array(img)
    except Exception as e:
        print(f"Error loading image: {e}")
        return None

def normalize_image(image):
    """Normalize image values to range [0, 1]"""
    img_min = image.min()
    img_max = image.max()
    
    # Avoid division by zero
    if img_max == img_min:
        return np.zeros_like(image, dtype=float)
    
    return (image - img_min) / (img_max - img_min)

def rgb_to_grayscale(rgb_image, method='weighted'):
    """
    Convert RGB image to grayscale using different methods
    
    Parameters:
    - rgb_image: RGB image as numpy array
    - method: Method to convert to grayscale
        'weighted': Standard weighted method (0.299R + 0.587G + 0.114B)
        'average': Simple average of RGB channels
        'luminance': Perceived luminance method
        'desaturate': Average of max and min RGB values
    """
    if len(rgb_image.shape) != 3 or rgb_image.shape[2] < 3:
        print("Input is not a valid RGB image")
        return None
    
    # Extract RGB channels
    r, g, b = rgb_image[:,:,0], rgb_image[:,:,1], rgb_image[:,:,2]
    
    if method == 'weighted':
        # Standard weighted conversion (ITU-R BT.601)
        gray = 0.299 * r + 0.587 * g + 0.114 * b
    elif method == 'average':
        # Simple average
        gray = (r + g + b) / 3
    elif method == 'luminance':
        # Perceived luminance method
        gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
    elif method == 'desaturate':
        # Photoshop-like desaturate (average of max and min)
        max_val = np.maximum(np.maximum(r, g), b)
        min_val = np.minimum(np.minimum(r, g), b)
        gray = (max_val + min_val) / 2
    else:
        print(f"Unknown method: {method}. Using weighted method.")
        gray = 0.299 * r + 0.587 * g + 0.114 * b
    
    return gray

def adjust_contrast(image, factor=1.5):
    """Adjust contrast of grayscale image"""
    # Find the mean value
    mean = np.mean(image)
    
    # Apply contrast adjustment
    adjusted = mean + factor * (image - mean)
    
    # Clip values to valid range [0, 1]
    return np.clip(adjusted, 0, 1)

def apply_threshold(image, threshold=0.5):
    """Apply thresholding to create pure black and white image"""
    return (image > threshold).astype(float)

def main():
    parser = argparse.ArgumentParser(description='Convert RGB image to black and white')
    parser.add_argument('image_path', help='Path to input image')
    parser.add_argument('--output', '-o', default='bw_output.png', help='Output file path')
    parser.add_argument('--method', '-m', choices=['weighted', 'average', 'luminance', 'desaturate'], 
                        default='weighted', help='Grayscale conversion method')
    parser.add_argument('--normalize', '-n', action='store_true', help='Normalize the image')
    parser.add_argument('--contrast', '-c', type=float, default=1.0, 
                        help='Contrast adjustment factor (default: 1.0)')
    parser.add_argument('--threshold', '-t', type=float, default=None,
                        help='Apply threshold to create pure black and white (0.0-1.0)')
    parser.add_argument('--show', '-s', action='store_true', help='Show images')
    
    args = parser.parse_args()
    
    # Load the image
    rgb_image = load_image(args.image_path)
    if rgb_image is None:
        return
    
    # Normalize if requested
    if args.normalize:
        rgb_image = normalize_image(rgb_image)
    
    # Convert to grayscale
    gray_image = rgb_to_grayscale(rgb_image, method=args.method)
    
    # Adjust contrast if factor is not 1.0
    if args.contrast != 1.0:
        gray_image = adjust_contrast(gray_image, args.contrast)
    
    # Apply thresholding if specified
    if args.threshold is not None:
        gray_image = apply_threshold(gray_image, args.threshold)
    
    # Save the result
    plt.imsave(args.output, gray_image, cmap='gray')
    print(f"Black and white image saved to {args.output}")
    
    # Display the results if requested
    if args.show:
        plt.figure(figsize=(12, 6))
        
        plt.subplot(1, 2, 1)
        plt.imshow(rgb_image)
        plt.title('Original RGB Image')
        plt.axis('off')
        
        plt.subplot(1, 2, 2)
        plt.imshow(gray_image, cmap='gray')
        plt.title('Black and White Image')
        plt.axis('off')
        
        plt.tight_layout()
        plt.show()

if __name__ == "__main__":
    main()