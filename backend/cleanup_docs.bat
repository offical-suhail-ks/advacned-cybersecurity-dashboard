@echo off
echo Removing old documentation files...

if exist README.md del /F /Q README.md
if exist API_REFERENCE.md del /F /Q API_REFERENCE.md
if exist FRONTEND_INTEGRATION.md del /F /Q FRONTEND_INTEGRATION.md
if exist IMPLEMENTATION_SUMMARY.md del /F /Q IMPLEMENTATION_SUMMARY.md
if exist QUICKSTART.md del /F /Q QUICKSTART.md
if exist WEB_SCANNER_FIX.md del /F /Q WEB_SCANNER_FIX.md

echo Done! Only SETUP.md and COMPLETE_GUIDE.md remain.
pause
