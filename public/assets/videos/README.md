# Fakhri Mart intro film

Place the optimized H.264 intro at:

`public/assets/videos/fakhri-intro.mp4`

Expected production properties:

- Duration: about 8.04 seconds
- Resolution: 960 × 720 (4:3)
- Codec: H.264 / AVC
- Pixel format: yuv420p
- Audio: none (required for reliable autoplay)
- Fast start: enabled (`moov` atom at the beginning)
- Recommended size: below 1 MB

The intro component falls back safely and opens the website if the asset fails to load.
