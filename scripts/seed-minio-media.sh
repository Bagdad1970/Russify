#!/bin/sh
set -eu

alias_name="dockerminio"
music_dir="/seed-music"

until /usr/bin/mc alias set "$alias_name" http://minio:9000 minioadmin miniopassword >/dev/null 2>&1; do
  sleep 1
done

/usr/bin/mc mb --ignore-existing "$alias_name/music" >/dev/null
/usr/bin/mc mb --ignore-existing "$alias_name/images" >/dev/null
/usr/bin/mc anonymous set download "$alias_name/music" >/dev/null
/usr/bin/mc anonymous set download "$alias_name/images" >/dev/null

set -- "$music_dir"/*

if [ "$#" -lt 3 ]; then
  echo "Expected at least 3 files in $music_dir" >&2
  exit 1
fi

file_1=$1
file_2=$2
file_3=$3

/usr/bin/mc rm --force "$alias_name/music/audio1" >/dev/null 2>&1 || true
/usr/bin/mc rm --force "$alias_name/music/audio2" >/dev/null 2>&1 || true
/usr/bin/mc rm --force "$alias_name/music/audio3" >/dev/null 2>&1 || true

/usr/bin/mc cp --attr "Content-Type=audio/mpeg" "$file_1" "$alias_name/music/audio1" >/dev/null
/usr/bin/mc cp --attr "Content-Type=audio/mpeg" "$file_2" "$alias_name/music/audio2" >/dev/null
/usr/bin/mc cp --attr "Content-Type=audio/mpeg" "$file_3" "$alias_name/music/audio3" >/dev/null

echo "Seeded sample tracks into MinIO:"
echo "  audio1 <- $(basename "$file_1")"
echo "  audio2 <- $(basename "$file_2")"
echo "  audio3 <- $(basename "$file_3")"
