@echo off
:loop
echo 🚀 Starting Mastra Tunnel...
call npx localtunnel --port 4111 --subdomain chammpu-man-isawsommm
echo ❌ Tunnel crashed! Restarting in 2 seconds...
timeout /t 2 >nul
goto loop