#!/usr/bin/env python3
"""
Enhanced 3D Standing Pouch Mockup Generator for PT Pangan Masa Depan
Renders flat 2D packaging artwork onto a photorealistic 3D standing 5kg rice pouch
with transparent background (PNG), cylindrical volume warp, realistic plastic gloss,
crimped top heat seal, die-cut 3-finger handle with beveled edges, tear notches,
and realistic dual-layer contact drop shadow.
"""

import os
import math
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

def create_3d_pouch(
    artwork_path,
    output_path,
    canvas_w=900,
    canvas_h=1200,
    pouch_w=630,
    pouch_h=970,
    seal_h=72,
    pouch_top=125,
    handle_style="three_finger"
):
    # 1. Load source artwork
    art_img = Image.open(artwork_path).convert("RGB")
    art_w, art_h = art_img.size

    # Pouch boundaries
    pouch_left = (canvas_w - pouch_w) // 2
    pouch_right = pouch_left + pouch_w
    pouch_bottom = pouch_top + pouch_h
    body_top = pouch_top + seal_h

    # Coordinate grid
    y_coords = np.arange(canvas_h, dtype=np.float32)
    x_coords = np.arange(canvas_w, dtype=np.float32)
    X, Y = np.meshgrid(x_coords, y_coords)

    # Normalized coordinates inside pouch
    u = (X - pouch_left) / pouch_w * 2.0 - 1.0  # -1 to 1 across width
    v = (Y - pouch_top) / pouch_h               # 0 to 1 down height

    # Fullness profile (slight organic bulge from rice weight in lower half)
    fullness_factor = 1.0 + 0.04 * np.sin(np.clip(v * math.pi, 0, math.pi))
    u_adjusted = u / fullness_factor

    # 2. Base Silhouette Mask
    inside_x = np.abs(u_adjusted) <= 1.0
    # Bottom curved base where pouch stands
    bottom_curve = pouch_bottom - 16.0 * (1.0 - np.clip(u_adjusted**2, 0.0, 1.0))
    inside_y = (Y >= pouch_top) & (Y <= bottom_curve)
    pouch_mask = inside_x & inside_y

    # Rounded top corners (radius 6px)
    r_top = 7.0
    top_left_dist = np.sqrt(np.maximum(0.0, (X - (pouch_left + r_top))**2 + (Y - (pouch_top + r_top))**2))
    cut_top_left = (X < pouch_left + r_top) & (Y < pouch_top + r_top) & (top_left_dist > r_top)
    top_right_dist = np.sqrt(np.maximum(0.0, (X - (pouch_right - r_top))**2 + (Y - (pouch_top + r_top))**2))
    cut_top_right = (X > pouch_right - r_top) & (Y < pouch_top + r_top) & (top_right_dist > r_top)
    pouch_mask = pouch_mask & (~cut_top_left) & (~cut_top_right)

    # 3. Tear Notches (tiny V notches on left and right at seal line)
    notch_y = body_top - 12
    notch_depth = 5
    notch_half_h = 4
    left_notch = (X <= pouch_left + notch_depth) & (np.abs(Y - notch_y) <= (notch_depth - (X - pouch_left)) * (notch_half_h / notch_depth)) & (X >= pouch_left)
    right_notch = (X >= pouch_right - notch_depth) & (np.abs(Y - notch_y) <= (notch_depth - (pouch_right - X)) * (notch_half_h / notch_depth)) & (X <= pouch_right)
    pouch_mask = pouch_mask & (~left_notch) & (~right_notch)

    # 4. Handle Cutout Mask & Bevel
    handle_mask = np.zeros((canvas_h, canvas_w), dtype=bool)
    handle_bevel_highlight = np.zeros((canvas_h, canvas_w), dtype=np.float32)
    handle_bevel_shadow = np.zeros((canvas_h, canvas_w), dtype=np.float32)

    if handle_style == "three_finger":
        center_x = canvas_w // 2
        handle_y = pouch_top + seal_h // 2 - 2
        spacing = 38
        rx, ry = 9.5, 15.0
        for offset in [-spacing, 0, spacing]:
            hx = center_x + offset
            dist_val = ((X - hx) / rx)**2 + ((Y - handle_y) / ry)**2
            in_hole = (dist_val <= 1.0)
            handle_mask |= in_hole

            # Bevel edges around the hole (plastic thickness rim)
            rim = (dist_val > 1.0) & (dist_val <= 1.35)
            # Bottom of hole catches light
            handle_bevel_highlight += rim * np.maximum(0.0, (Y - handle_y) / ry) * 0.4
            # Top of hole has shadow
            handle_bevel_shadow += rim * np.maximum(0.0, (handle_y - Y) / ry) * 0.35

    pouch_mask = pouch_mask & (~handle_mask)

    # 5. 3D Surface Height Map Z(x, y) & Normal Vectors
    Z = np.zeros((canvas_h, canvas_w), dtype=np.float32)
    body_mask = pouch_mask & (Y >= body_top)
    seal_mask = pouch_mask & (Y < body_top)

    v_body = np.clip((Y - body_top) / (pouch_bottom - body_top), 0.0, 1.0)
    # Realistic vertical volume profile
    v_profile = np.sin(v_body * math.pi * 0.88 + 0.12) * (0.62 + 0.38 * v_body)

    u_clamped = np.clip(u_adjusted, -0.999, 0.999)
    # Smooth cylindrical arch with quad-seal flattening near edges
    h_profile = np.sqrt(np.maximum(0.0, 1.0 - u_clamped**2))

    # Subtle organic packaging crinkles
    crinkle = (
        0.015 * np.sin(u_clamped * 12.0 + v_body * 16.0) * (1.0 - u_clamped**2) +
        0.010 * np.cos(u_clamped * 20.0 - v_body * 14.0) * (1.0 - u_clamped**2)
    )

    Z[body_mask] = (h_profile[body_mask] + crinkle[body_mask]) * v_profile[body_mask] * 125.0
    Z[seal_mask] = 6.0 * (1.0 - np.abs(u_clamped[seal_mask]))

    # Surface Normals
    dZ_dx = np.gradient(Z, axis=1)
    dZ_dy = np.gradient(Z, axis=0)

    # Fine heat-seal crimp lines
    crimp_wave = np.sin(X * (2.0 * math.pi / 4.0))
    dZ_dx[seal_mask] += crimp_wave[seal_mask] * 0.75

    Nx = -dZ_dx
    Ny = -dZ_dy
    Nz = np.ones_like(Z)
    norm_len = np.sqrt(Nx**2 + Ny**2 + Nz**2) + 1e-6
    Nx /= norm_len
    Ny /= norm_len
    Nz /= norm_len

    # 6. Studio Lighting Setup
    # Key Light (Top Left Softbox)
    L1 = np.array([-0.42, -0.52, 0.74])
    L1 /= np.linalg.norm(L1)
    dot1 = np.maximum(0.0, Nx * L1[0] + Ny * L1[1] + Nz * L1[2])

    # Fill Light (Top Right Soft Bounce)
    L2 = np.array([0.50, -0.32, 0.80])
    L2 /= np.linalg.norm(L2)
    dot2 = np.maximum(0.0, Nx * L2[0] + Ny * L2[1] + Nz * L2[2])

    # Ambient Light
    ambient = 0.60
    diffuse = ambient + 0.36 * dot1 + 0.15 * dot2

    # Specular Plastic Film Highlight (Soft sheen across vertical crest)
    R1_z = 2.0 * dot1 * Nz - L1[2]
    specular1 = np.maximum(0.0, R1_z) ** 20
    specular_intensity = 0.16 * specular1
    specular_intensity[seal_mask] *= 0.30

    # 7. Optical Cylindrical UV Mapping
    u_warp = np.arcsin(np.clip(u_adjusted * 0.93, -0.93, 0.93)) / np.arcsin(0.93)
    u_tex = (u_warp + 1.0) * 0.5
    v_tex = np.clip(v, 0.0, 1.0)

    src_x = np.clip((u_tex * (art_w - 1)).astype(np.int32), 0, art_w - 1)
    src_y = np.clip((v_tex * (art_h - 1)).astype(np.int32), 0, art_h - 1)

    art_arr = np.array(art_img, dtype=np.float32)
    mapped_pixels = art_arr[src_y, src_x]

    # 8. Apply Shading, Edge Vignette, and Bevel Highlights
    lit_pixels = mapped_pixels * diffuse[:, :, np.newaxis] + (specular_intensity[:, :, np.newaxis] * 255.0)

    # Edge depth falloff
    edge_shadow = 1.0 - 0.20 * np.power(np.abs(u_clamped), 3.2)
    lit_pixels *= edge_shadow[:, :, np.newaxis]

    # Top seal seam line
    seal_seam = (Y >= body_top - 2) & (Y <= body_top + 1) & pouch_mask
    lit_pixels[seal_seam] *= 0.74

    # Handle hole bevel illumination
    lit_pixels += (handle_bevel_highlight[:, :, np.newaxis] * 255.0)
    lit_pixels *= (1.0 - handle_bevel_shadow[:, :, np.newaxis] * 0.5)

    lit_pixels = np.clip(lit_pixels, 0, 255).astype(np.uint8)

    # 9. Realistic Multi-Layer Contact & Ground Shadows
    shadow_canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_canvas)
    shadow_cx = canvas_w // 2
    shadow_cy = pouch_bottom + 10

    # Deep contact occlusion shadow
    rx_occ = pouch_w * 0.40
    ry_occ = 14
    sdraw.ellipse(
        [shadow_cx - rx_occ, shadow_cy - ry_occ, shadow_cx + rx_occ, shadow_cy + ry_occ],
        fill=(20, 14, 8, 160)
    )

    # Medium soft bounce shadow
    rx_mid = pouch_w * 0.46
    ry_mid = 26
    sdraw.ellipse(
        [shadow_cx - rx_mid, shadow_cy - ry_mid + 4, shadow_cx + rx_mid, shadow_cy + ry_mid + 4],
        fill=(30, 22, 14, 90)
    )

    # Broad diffuse floor shadow
    rx_diff = pouch_w * 0.53
    ry_diff = 40
    sdraw.ellipse(
        [shadow_cx - rx_diff, shadow_cy - ry_diff + 8, shadow_cx + rx_diff, shadow_cy + ry_diff + 8],
        fill=(40, 28, 18, 45)
    )

    shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(radius=15))

    # 10. Anti-Aliased Alpha Cutout Composite
    raw_alpha = (pouch_mask.astype(np.float32) * 255.0)
    alpha_img = Image.fromarray(raw_alpha.astype(np.uint8), mode="L")
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=0.7))

    pouch_render = Image.fromarray(lit_pixels, mode="RGB")
    final_pouch = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    final_pouch.paste(pouch_render, (0, 0), mask=alpha_img)

    # Final composite
    final_canvas = Image.alpha_composite(shadow_canvas, final_pouch)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_canvas.save(output_path, "PNG", optimize=True)
    print(f"Generated: {output_path}")
    return output_path

def generate_all_mockups():
    artwork_dir = "assets/images/artwork_with_rice"
    mockup_dir = "assets/images/mockups"
    os.makedirs(mockup_dir, exist_ok=True)

    products = [
        ("cruise", "cruise_front.jpg", "cruise_back.jpg"),
        ("pagijaya", "pagijaya_front.jpg", "pagijaya_back.jpg"),
        ("bintangmahkota", "bintangmahkota_front.jpg", "bintangmahkota_back.jpg"),
        ("bpj", "bpj_front.jpg", "bpj_back.jpg"),
        ("macan", "macan_front.jpg", "macan_back.jpg"),
        ("dongakyai", "dongakyai_front.jpg", "dongakyai_back.jpg"),
        ("sultanberas", "sultanberas_front.jpg", "sultanberas_back.jpg"),
        ("nickwell", "nickwell_front.jpg", "nickwell_back.jpg"),
        ("mamaku", "mamaku_front.jpg", "mamaku_back.jpg"),
        ("walemu", "walemu_front.jpg", "walemu_back.jpg"),
    ]

    for key, front_file, back_file in products:
        f_in = os.path.join(artwork_dir, front_file)
        f_out = os.path.join(mockup_dir, f"pouch_{key}_front.png")
        b_in = os.path.join(artwork_dir, back_file)
        b_out = os.path.join(mockup_dir, f"pouch_{key}_back.png")

        print(f"\nProcessing product: {key.upper()}...")
        create_3d_pouch(f_in, f_out)
        create_3d_pouch(b_in, b_out)

    print("\n==========================================")
    print("ALL 20 3D POUCH MOCKUPS SUCCESSFULLY CREATED!")
    print("==========================================")

if __name__ == "__main__":
    generate_all_mockups()
