#!/usr/bin/env bash
# NextGen Roofing — drone footage enhancement pipeline.
#
# Usage: scripts/media/process-footage.sh <raw-dir> [out-dir]
#   <raw-dir> must contain d1.mov, d2.mov, d3.mov (the three supplied drone
#   recordings from the "Next Gen Roofing - Project Assets" Drive folder):
#     d1.mov = "Drone footage - Next Gen Roofing.MOV"   (sunny hip roof orbit)
#     d2.mov = "Drone footage 2 - Next Gen Roofing.MOV" (tear-off → install → complete)
#     d3.mov = "Drone footage 3 - Next Gen Roofing.MOV" (overcast farmhouse + ridge detail)
#
# Source facts (ffprobe): HEVC 1320x742-758, 60 fps container, but every other
# frame is a duplicate (screen capture of ~30 fps footage). We drop duplicates
# with mpdecimate and retime to a true 30 fps, crop the thin letterbox lines,
# apply light temporal denoise, a restrained grade, and contrast-adaptive
# sharpening. No AI upscaling is applied: output never exceeds native detail.
set -euo pipefail

RAW=${1:?raw dir required}
OUT=${2:-public/media}
mkdir -p "$OUT/video" "$OUT/stills"

DEDUP="mpdecimate=hi=768:lo=320:frac=0.33,setpts=N/30/TB"
DENOISE="hqdn3d=1.5:1.5:4:4"
SHARP="cas=0.35"
# Grade for sunny footage (d1, d2): tame saturation, deeper blacks, neutral highlights.
G_SUN="eq=contrast=1.06:brightness=-0.015:saturation=0.9:gamma=0.97,curves=master='0/0.02 0.25/0.22 0.5/0.5 0.78/0.8 1/0.97',colorbalance=rs=-0.02:bs=0.03:rh=0.03:bh=-0.02"
# Grade for overcast footage (d3): lift contrast, slight warmth in mids.
G_OVC="eq=contrast=1.12:brightness=-0.01:saturation=1.02:gamma=0.95,curves=master='0/0.01 0.25/0.2 0.5/0.5 0.78/0.82 1/0.98',colorbalance=rm=0.02:bm=-0.015:rh=0.02"

declare -A CROPY=([d1]=11 [d2]=3 [d3]=7)
declare -A GRADE=([d1]="$G_SUN" [d2]="$G_SUN" [d3]="$G_OVC")

X264="-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an"
AV1="-c:v libsvtav1 -preset 6 -pix_fmt yuv420p -an"

# 1) Master intermediates: dedup + crop + denoise + grade + sharpen (near-lossless).
for c in d1 d2 d3; do
  [ -f "$RAW/master_$c.mkv" ] && continue
  ffmpeg -v error -y -i "$RAW/$c.mov" -an \
    -vf "$DEDUP,crop=1312:736:4:${CROPY[$c]},$DENOISE,${GRADE[$c]},$SHARP" \
    -c:v libx264 -preset medium -crf 12 -pix_fmt yuv420p "$RAW/master_$c.mkv"
done

# Seamless loop helper: body = S[X..L]; its last X seconds crossfade into S[0..X].
loop() { # src start len xfade out_base
  local src=$1 ss=$2 L=$3 X=$4 base=$5
  local off; off=$(python3 -c "print(round($L-2*$X,3))")
  local fc="[0]trim=start=$ss:duration=$L,setpts=PTS-STARTPTS,split[a][b];[a]trim=start=$X,setpts=PTS-STARTPTS[body];[b]trim=end=$X,setpts=PTS-STARTPTS[head];[body][head]xfade=transition=fade:duration=$X:offset=$off,format=yuv420p"
  # Desktop 1280x720
  ffmpeg -v error -y -i "$src" -filter_complex "$fc,scale=1280:720:flags=lanczos" $X264 -crf 22 -r 30 "$OUT/video/$base-1280.mp4"
  ffmpeg -v error -y -i "$src" -filter_complex "$fc,scale=1280:720:flags=lanczos" $AV1 -crf 36 -r 30 "$OUT/video/$base-1280.webm"
  # Mobile portrait crop (center), 540x720
  ffmpeg -v error -y -i "$src" -filter_complex "$fc,crop=552:736:(iw-552)/2:0,scale=540:720:flags=lanczos" $X264 -crf 24 -r 30 "$OUT/video/$base-540.mp4"
  ffmpeg -v error -y -i "$src" -filter_complex "$fc,crop=552:736:(iw-552)/2:0,scale=540:720:flags=lanczos" $AV1 -crf 38 -r 30 "$OUT/video/$base-540.webm"
  # Posters (first frame == loop seam frame)
  ffmpeg -v error -y -ss $(python3 -c "print($ss+$X)") -i "$src" -frames:v 1 -vf "scale=1280:720:flags=lanczos" -q:v 3 "$OUT/stills/$base-poster.jpg"
  ffmpeg -v error -y -ss $(python3 -c "print($ss+$X)") -i "$src" -frames:v 1 -vf "crop=552:736:(iw-552)/2:0,scale=540:720:flags=lanczos" -q:v 3 "$OUT/stills/$base-poster-540.jpg"
}

# 2) Hero loops
loop "$RAW/master_d1.mkv" 5.2 6.8 0.8 hero-arrival   # sunny hip-roof orbit
loop "$RAW/master_d3.mkv" 10.4 6.0 0.8 hero-detail   # ridge-cap close-up, overcast

# 3) Project showcase films (full authentic edits, 720p)
film() { # src ss dur base
  ffmpeg -v error -y -ss $2 -t $3 -i "$1" -vf "scale=1280:720:flags=lanczos" $X264 -crf 23 -r 30 "$OUT/video/$4.mp4"
  ffmpeg -v error -y -ss $2 -t $3 -i "$1" -vf "scale=1280:720:flags=lanczos" $AV1 -crf 38 -r 30 "$OUT/video/$4.webm"
}
film "$RAW/master_d1.mkv" 0 22 project-hip-roof
film "$RAW/master_d2.mkv" 0 20.2 project-full-replacement
film "$RAW/master_d3.mkv" 0 23.5 project-farmhouse

# 4) Stills for Concept B, galleries and page heroes (native 1312px, graded).
still() { ffmpeg -v error -y -ss $2 -i "$1" -frames:v 1 -q:v 2 "$OUT/stills/$3.jpg"; }
M=$RAW
still "$M/master_d1.mkv" 1.0  hip-roof-ridge-lines
still "$M/master_d1.mkv" 8.6  hip-roof-vents
still "$M/master_d1.mkv" 14.5 hip-roof-context
still "$M/master_d1.mkv" 18.0 hip-roof-wide
still "$M/master_d2.mkv" 0.6  replacement-tearoff-crew
still "$M/master_d2.mkv" 5.4  replacement-decking      # new sheathing (6.0–8.8s are crossfades)
still "$M/master_d2.mkv" 9.9  replacement-ridge-detail  # finished hip/ridge + chimney flashing
still "$M/master_d2.mkv" 14.0 replacement-complete
still "$M/master_d3.mkv" 2.4  farmhouse-street
still "$M/master_d3.mkv" 7.6  farmhouse-orbit
still "$M/master_d3.mkv" 11.0 farmhouse-ridge-detail
still "$M/master_d3.mkv" 13.5 farmhouse-ridge-vent
still "$M/master_d3.mkv" 21.0 farmhouse-top-down
echo "done"
ls -la "$OUT/video" "$OUT/stills"
