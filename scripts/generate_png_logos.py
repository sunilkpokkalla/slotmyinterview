from PIL import Image, ImageDraw

def create_cursor_grok_logo_png(filename):
    size = (1024, 1024)
    img = Image.new("RGBA", size, (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    # Ambient Violet/Cyan Glow
    center = (512, 512)
    for r in range(450, 0, -4):
        alpha = int(45 * (1 - r / 450))
        draw.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r], fill=(129, 140, 248, alpha))

    # Scale factor for 3D Isometric Cube (32x32 SVG mapped to 1024x1024 canvas)
    # Scale: 24, Offset: 128
    def convert_pt(x, y):
        return (x * 24 + 128, y * 24 + 128)

    # Top Face (M 16 3 L 27 9.33 L 16 15.66 L 5 9.33 Z)
    top_face = [convert_pt(16, 3), convert_pt(27, 9.33333), convert_pt(16, 15.6667), convert_pt(5, 9.33333)]
    draw.polygon(top_face, outline=(255, 255, 255, 230), width=12)

    # Left Wall (M 5 9.33 V 22.66 L 16 29 V 15.66 Z)
    left_wall = [convert_pt(5, 9.33333), convert_pt(5, 22.6667), convert_pt(16, 29), convert_pt(16, 15.6667)]
    draw.polygon(left_wall, outline=(129, 140, 248, 220), width=12)

    # Right Wall Edge (M 27 9.33 V 22.66 L 16 29)
    right_lines = [convert_pt(27, 9.33333), convert_pt(27, 22.6667), convert_pt(16, 29)]
    draw.line(right_lines, fill=(168, 85, 247, 220), width=12, joint="round")

    # Inner Diagonal Pointer Chevron Sliced Trajectory (M 11 14 L 16 18.5 L 24 10.5)
    chevron = [convert_pt(11, 14), convert_pt(16, 18.5), convert_pt(24, 10.5)]
    draw.line(chevron, fill=(56, 189, 248, 255), width=20, joint="round")

    img.save(filename, "PNG")
    print(f"Generated {filename}")

if __name__ == "__main__":
    create_cursor_grok_logo_png("public/logo.png")
    create_cursor_grok_logo_png("public/logo-concept-1.png")
