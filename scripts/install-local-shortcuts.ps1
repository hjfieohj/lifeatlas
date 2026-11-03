param([Parameter(Mandatory=$true)][string]$ApplicationDirectory)
$appDirectory=(Resolve-Path -LiteralPath $ApplicationDirectory).Path
if(!(Test-Path -LiteralPath (Join-Path $appDirectory 'LifeAtlas.exe'))){throw 'Native application launcher not found.'}
$desktopDirectory=[Environment]::GetFolderPath('Desktop')
$menuDirectory=Join-Path ([Environment]::GetFolderPath('Programs')) 'LifeAtlas'
New-Item -ItemType Directory -Path $menuDirectory -Force | Out-Null
$dataDirectory=[IO.Path]::GetFullPath((Join-Path $appDirectory '../LifeAtlas本地资料'))
$shell=New-Object -ComObject WScript.Shell
function New-LifeAtlasShortcut([string]$ShortcutFile,[string]$TargetFile,[string]$ShortcutArguments,[string]$Description){
 $link=$shell.CreateShortcut($ShortcutFile)
 $link.TargetPath=$TargetFile;$link.Arguments=$ShortcutArguments;$link.WorkingDirectory=$appDirectory
 $link.Description=$Description;$link.IconLocation=(Join-Path $appDirectory 'LifeAtlas-Orbit-v2.ico')+',0';$link.Save()
}
$nativeLauncher=Join-Path $appDirectory 'LifeAtlas.exe'
New-LifeAtlasShortcut (Join-Path $desktopDirectory 'LifeAtlas.lnk') $nativeLauncher '' 'LifeAtlas 本地生活全图'
foreach($entry in @(@('LifeAtlas','open'),@('停止LifeAtlas','stop'),@('备份全部资料','backup'))){
 New-LifeAtlasShortcut (Join-Path $menuDirectory ($entry[0]+'.lnk')) $nativeLauncher $entry[1] $entry[0]
}
New-LifeAtlasShortcut (Join-Path $menuDirectory '资料与备份.lnk') (Join-Path $env:WINDIR 'explorer.exe') ('"'+$dataDirectory+'"') '打开本机资料与备份目录'
[PSCustomObject]@{DesktopShortcut=Join-Path $desktopDirectory 'LifeAtlas.lnk';StartMenu=$menuDirectory;DataDirectory=$dataDirectory}
