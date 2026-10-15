#!/bin/bash
# Lance Chromium via le proxy de l'environnement : retire les options
# « sans proxy » que Remotion ajoute d'office.
args=()
for a in "$@"; do
  case "$a" in --no-proxy-server|--proxy-server=*|--proxy-bypass-list=*) ;; *) args+=("$a");; esac
done
exec /opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --proxy-server="$HTTPS_PROXY" "${args[@]}"
