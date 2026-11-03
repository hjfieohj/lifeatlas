param([Parameter(Mandatory=$true)][string]$ApplicationDirectory)
$appDirectory=(Resolve-Path -LiteralPath $ApplicationDirectory).Path
if(!(Test-Path -LiteralPath (Join-Path $appDirectory 'LifeAtlas.exe'))){throw 'Native application launcher not found.'}
# Packaged hosts can redirect LocalAppData. Explorer must receive physical paths
# for both the launcher and its icon, rather than a mix of redirected aliases.
if(-not ('LifeAtlasShortcutPaths' -as [type])){
 Add-Type @'
using System;
using System.Text;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;
public static class LifeAtlasShortcutPaths {
 [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
 public static extern uint GetFinalPathNameByHandle(SafeFileHandle file, StringBuilder path, uint size, uint flags);
 [DllImport("shell32.dll", CharSet=CharSet.Unicode)]
 public static extern void SHChangeNotify(uint change, uint flags, string item1, IntPtr item2);
}
'@
}
$launcherStream=[IO.File]::OpenRead((Join-Path $appDirectory 'LifeAtlas.exe'))
try{
 $physicalPath=New-Object Text.StringBuilder 32768
 $length=[LifeAtlasShortcutPaths]::GetFinalPathNameByHandle($launcherStream.SafeFileHandle,$physicalPath,32768,0)
 if($length -eq 0 -or $length -ge 32768){throw 'Cannot resolve physical launcher path.'}
 $launcherPath=$physicalPath.ToString()
 if($launcherPath.StartsWith('\\?\UNC\')){$launcherPath='\\'+$launcherPath.Substring(8)}
 elseif($launcherPath.StartsWith('\\?\')){$launcherPath=$launcherPath.Substring(4)}
 $appDirectory=Split-Path -Parent $launcherPath
}finally{$launcherStream.Dispose()}
$sourceIcon=Join-Path $appDirectory 'LifeAtlas-Orbit-v2.ico'
if(!(Test-Path -LiteralPath $sourceIcon)){throw 'Application icon not found.'}
$iconHash=(Get-FileHash -LiteralPath $sourceIcon -Algorithm SHA256).Hash.Substring(0,12).ToLowerInvariant()
$shortcutIcon=Join-Path $appDirectory ('LifeAtlas-Shortcut-'+$iconHash+'.ico')
if(!(Test-Path -LiteralPath $shortcutIcon)){Copy-Item -LiteralPath $sourceIcon -Destination $shortcutIcon}
$desktopDirectory=[Environment]::GetFolderPath('Desktop')
$menuDirectory=Join-Path ([Environment]::GetFolderPath('Programs')) 'LifeAtlas'
New-Item -ItemType Directory -Path $menuDirectory -Force | Out-Null
$dataDirectory=[IO.Path]::GetFullPath((Join-Path $appDirectory '../LifeAtlas本地资料'))
$shell=New-Object -ComObject WScript.Shell
function New-LifeAtlasShortcut([string]$ShortcutFile,[string]$TargetFile,[string]$ShortcutArguments,[string]$Description){
 $link=$shell.CreateShortcut($ShortcutFile)
 $link.TargetPath=$TargetFile;$link.Arguments=$ShortcutArguments;$link.WorkingDirectory=$appDirectory
 $link.Description=$Description;$link.IconLocation=$shortcutIcon+',0';$link.Save()
 [LifeAtlasShortcutPaths]::SHChangeNotify(0x00002000,0x0005,$ShortcutFile,[IntPtr]::Zero)
}
$nativeLauncher=Join-Path $appDirectory 'LifeAtlas.exe'
New-LifeAtlasShortcut (Join-Path $desktopDirectory 'LifeAtlas.lnk') $nativeLauncher '' 'LifeAtlas 本地生活全图'
foreach($entry in @(@('LifeAtlas','open'),@('停止LifeAtlas','stop'),@('备份全部资料','backup'))){
 New-LifeAtlasShortcut (Join-Path $menuDirectory ($entry[0]+'.lnk')) $nativeLauncher $entry[1] $entry[0]
}
New-LifeAtlasShortcut (Join-Path $menuDirectory '资料与备份.lnk') (Join-Path $env:WINDIR 'explorer.exe') ('"'+$dataDirectory+'"') '打开本机资料与备份目录'
[LifeAtlasShortcutPaths]::SHChangeNotify(0x00001000,0x0005,$desktopDirectory,[IntPtr]::Zero)
[PSCustomObject]@{DesktopShortcut=Join-Path $desktopDirectory 'LifeAtlas.lnk';StartMenu=$menuDirectory;DataDirectory=$dataDirectory}
