param([Parameter(Mandatory=$true)][string]$ApplicationDirectory)
$appDirectory=(Resolve-Path -LiteralPath $ApplicationDirectory).Path
if(!(Test-Path -LiteralPath (Join-Path $appDirectory '打开LifeAtlas.vbs'))){throw 'Application launcher not found.'}
$desktopDirectory=[Environment]::GetFolderPath('Desktop')
$menuDirectory=Join-Path ([Environment]::GetFolderPath('Programs')) 'LifeAtlas'
New-Item -ItemType Directory -Path $menuDirectory -Force | Out-Null
$dataDirectory=[IO.Path]::GetFullPath((Join-Path $appDirectory '../LifeAtlas本地资料'))
$shell=New-Object -ComObject WScript.Shell
function New-LifeAtlasShortcut([string]$ShortcutFile,[string]$TargetFile,[string]$ShortcutArguments,[string]$Description){
 $link=$shell.CreateShortcut($ShortcutFile)
 $link.TargetPath=$TargetFile;$link.Arguments=$ShortcutArguments;$link.WorkingDirectory=$appDirectory
 $link.Description=$Description;$link.IconLocation=(Join-Path $appDirectory 'LifeAtlas.ico')+',0';$link.Save()
}
$scriptHost=Join-Path $env:WINDIR 'System32/wscript.exe'
New-LifeAtlasShortcut (Join-Path $desktopDirectory 'LifeAtlas.lnk') $scriptHost ('"'+(Join-Path $appDirectory '打开LifeAtlas.vbs')+'"') 'LifeAtlas 本地生活全图'
foreach($entry in @(@('LifeAtlas','打开LifeAtlas.vbs'),@('停止LifeAtlas','停止LifeAtlas.vbs'),@('备份全部资料','备份全部资料.vbs'))){
 New-LifeAtlasShortcut (Join-Path $menuDirectory ($entry[0]+'.lnk')) $scriptHost ('"'+(Join-Path $appDirectory $entry[1])+'"') $entry[0]
}
New-LifeAtlasShortcut (Join-Path $menuDirectory '资料与备份.lnk') (Join-Path $env:WINDIR 'explorer.exe') ('"'+$dataDirectory+'"') '打开本机资料与备份目录'
[PSCustomObject]@{DesktopShortcut=Join-Path $desktopDirectory 'LifeAtlas.lnk';StartMenu=$menuDirectory;DataDirectory=$dataDirectory}
