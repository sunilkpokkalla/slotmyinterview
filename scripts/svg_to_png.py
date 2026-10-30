import os
import sys

# Check available SVG converters in Python
try:
    import cairosvg
    for i in range(1, 5):
        svg_path = f"public/logo-concept-{i}.svg"
        png_path = f"public/logo-concept-{i}.png"
        cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=1024, output_height=1024)
        print(f"Generated {png_path}")
except ImportError:
    print("cairosvg not installed, writing SVG files.")
