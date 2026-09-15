<!--
SPDX-FileCopyrightText: 2026 Schmiedmayer Lab and the project authors (see CONTRIBUTORS.md)

SPDX-License-Identifier: MIT
-->

# Heart, Lung, and Blood AI Data Science Center brand kit

The center identity pairs the official Stanford Medicine artwork with the center name set on two
lines: “Heart, Lung, and Blood” and “AI Data Science Center.” Small square applications use the
Stanford Medicine shield from the same supplied artwork. Use the supplied assets directly rather
than redrawing or retypesetting the Stanford Medicine identity.

The project identity complements—but does not replace, combine, or modify—official Stanford
University, Stanford Medicine, NIH, or NHLBI marks. Institutional names and marks remain governed by
their respective identity and trademark policies.

## Verbal identity

**Primary line:** Agentic AI for biomedical discovery.

**Supporting line:** Safe, reproducible AI systems for NHLBI-supported research.

**Short description:** A service and community hub advancing safe agentic AI, multimodal models,
and reproducible workflows across NHLBI-supported data and secure research environments.

## Asset selection

| Use                                    | Preferred file                    | Dimensions  |
| -------------------------------------- | --------------------------------- | ----------- |
| Social profile image on dark surfaces  | `public/brand/avatar-dark.png`    | 1024 × 1024 |
| Social profile image on light surfaces | `public/brand/avatar-light.png`   | 1024 × 1024 |
| Website or document on light surfaces  | `public/brand/lockup.svg`         | Vector      |
| Slides or graphics on dark surfaces    | `public/brand/lockup-dark.svg`    | Vector      |
| Open Graph and social sharing          | `public/brand/social-preview.png` | 1200 × 630  |
| Bluesky banner                         | `public/brand/bluesky-banner.png` | 1500 × 500  |
| LinkedIn cover                         | `public/brand/linkedin-cover.png` | 1128 × 191  |
| Browser favicon                        | `public/favicon.svg`              | Vector      |
| Apple touch icon                       | `public/apple-touch-icon.png`     | 180 × 180   |

SVG files are preferred where supported. PNG exports are provided for social platforms and tools
that rasterize SVG inconsistently.

The `avatar-*` files are square profile images for services that display an account image as a
circle or rounded square. They intentionally use the Stanford Medicine shield without text because
avatars are commonly rendered at only 32–96 CSS pixels in feeds, where even a compact wordmark is
not reliably legible. Set the platform profile or display name to “Heart, Lung, and Blood AI Data
Science Center.” The SVG title and description also retain that full accessible name. Choose the
light or dark avatar according to the surrounding interface.

## Usage

- Preserve the Stanford Medicine artwork’s proportions and keep it upright.
- Leave the clear space already built into each supplied asset.
- Use the color lockup on white or warm-neutral surfaces and the white Stanford Medicine lockup on
  dark surfaces.
- Do not place the lockup over busy photography, recolor its elements, or retypeset the Stanford
  Medicine artwork.
- Keep the center’s relationship to the NHLBI-AI Enabled Precision Medicine Initiative clear in
  formal materials.

Regenerate the committed brand kit and browser icons with `npm run brand:generate` after changing
the source artwork, name, or copy.
