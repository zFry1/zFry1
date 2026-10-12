@echo off
color 0A
setlocal EnableDelayedExpansion

:: -------------------------
:: BatchGotAdmin - Request Admin if Needed
:: -------------------------
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
set params=%*:"=""
echo UAC.ShellExecute "cmd.exe", "/c %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs"
"%temp%\getadmin.vbs"
del "%temp%\getadmin.vbs"
exit /B

:gotAdmin
pushd "%CD%"
CD /D "%~dp0"

:: -------------------------
:: Paths
:: -------------------------
set "patchFolder=%~dp0"
set "defaultBackupFolder=%SystemDrive%\Boost\Games-Programs Optimization\Discord Optimization\My Settings Discord"
set "discordStable=%appdata%\discord"
set "discordCanary=%appdata%\discordcanary"
set "discordPTB=%appdata%\discordptb"
set "settingsFile=settings.json"

:: -------------------------
:: Main Menu
:: -------------------------
:menu
cls
echo =====================================================
echo               DISCORD MY SETTINGS MANAGER
echo =====================================================
echo 1. Replace settings.json in All Discord Clients
echo 2. Replace settings.json in Stable Only
echo 3. Replace settings.json in Canary Only
echo 4. Replace settings.json in PTB Only
echo 5. Backup Discord Settings
echo 6. Exit
echo =====================================================
set /p choice="Select an option [1-6]: "

if "%choice%"=="1" goto replaceAll
if "%choice%"=="2" goto replaceStable
if "%choice%"=="3" goto replaceCanary
if "%choice%"=="4" goto replacePTB
if "%choice%"=="5" goto backupSettings
if "%choice%"=="6" goto end
echo Invalid choice! Press any key to try again...
pause >nul
goto menu

:: -------------------------
:: Replace Settings Functions
:: -------------------------
:replaceAll
echo =====================================================
echo Replacing settings.json in All Discord Clients...
echo =====================================================
call :replaceFile "%discordStable%"
call :replaceFile "%discordCanary%"
call :replaceFile "%discordPTB%"
echo =====================================================
echo Replacement completed.
pause
goto menu

:replaceStable
echo =====================================================
echo Replacing settings.json in Stable...
echo =====================================================
call :replaceFile "%discordStable%"
echo =====================================================
pause
goto menu

:replaceCanary
echo =====================================================
echo Replacing settings.json in Canary...
echo =====================================================
call :replaceFile "%discordCanary%"
echo =====================================================
pause
goto menu

:replacePTB
echo =====================================================
echo Replacing settings.json in PTB...
echo =====================================================
call :replaceFile "%discordPTB%"
echo =====================================================
pause
goto menu

:replaceFile
set "target=%~1"
set "source=%patchFolder%\%settingsFile%"

if not exist "%source%" (
    echo ERROR: Patch file "%source%" not found!
    goto :eof
)

if exist "%target%" (
    xcopy /Y "%source%" "%target%\" >nul
    echo Replaced settings.json in "%target%"
) else (
    echo Target folder "%target%" not found. Using default backup path.
    if exist "%defaultBackupFolder%" (
        xcopy /Y "%source%" "%defaultBackupFolder%\" >nul
        echo Replaced settings.json in default folder "%defaultBackupFolder%"
    ) else (
        echo Default folder "%defaultBackupFolder%" not found!
    )
)
goto :eof

:: -------------------------
:: Backup Settings
:: -------------------------
:backupSettings
cls
echo =====================================================
echo               DISCORD SETTINGS BACKUP
echo =====================================================
echo 1. Backup All Clients
echo 2. Backup Stable Only
echo 3. Backup Canary Only
echo 4. Backup PTB Only
echo 0. Go Back to Main Menu
echo =====================================================
set /p bchoice="Select backup option [0-4]: "

if "%bchoice%"=="0" goto menu

set "backupFolder=%defaultBackupFolder%\Backup_%date:/=-%_%time::=-%"
mkdir "%backupFolder%" >nul 2>&1

if "%bchoice%"=="1" (
    echo Backing up all Discord clients...
    call :backupFile "%discordStable%"
    call :backupFile "%discordCanary%"
    call :backupFile "%discordPTB%"
) else if "%bchoice%"=="2" (
    echo Backing up Stable only...
    call :backupFile "%discordStable%"
) else if "%bchoice%"=="3" (
    echo Backing up Canary only...
    call :backupFile "%discordCanary%"
) else if "%bchoice%"=="4" (
    echo Backing up PTB only...
    call :backupFile "%discordPTB%"
) else (
    echo Invalid backup choice! Returning to menu...
    pause >nul
    goto menu
)

echo =====================================================
echo Backup completed successfully!
echo Stored in: "%backupFolder%"
echo =====================================================
pause
goto menu

:backupFile
set "target=%~1"
if exist "%target%\%settingsFile%" (
    xcopy /Y "%target%\%settingsFile%" "%backupFolder%\" >nul
    echo Backed up settings.json from "%target%" to "%backupFolder%"
) else (
    echo No settings.json found in "%target%"
)
goto :eof

:end
echo =====================================================
echo Exiting Discord Settings Manager...
echo =====================================================
pause
exit