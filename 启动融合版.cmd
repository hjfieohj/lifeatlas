@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js 22.13 or newer is required.
 pause
 exit /b 1
)
if not exist "node_modules\vinext\dist\cli.js" (
 call npm.cmd ci
 if errorlevel 1 exit /b 1
)
node scripts/local-app.mjs start
echo Open http://localhost:5173/#knowledge in your browser.
pause
