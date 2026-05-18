import sys
import os

try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def remove_white_bg(input_path, output_path, tolerance=200):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    newData = []
    
    for item in datas:
        # Check if the pixel is close to white
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            newData.append((255, 255, 255, 0)) # Make it transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Crop to bounding box of non-transparent pixels to remove extra transparent space
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

in_path = r"gik.png"
out_path = r"favicon.png"

remove_white_bg(in_path, out_path)
