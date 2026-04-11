@echo off
title DevDashboard
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Launch-DevDashboard.ps1"
if errorlevel 1 pause
