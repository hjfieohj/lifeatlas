param([Parameter(Mandatory=$true)][string]$OutputDirectory)
$repositoryDirectory=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$outputPath=[IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
$compiler=Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319/csc.exe'
if(!(Test-Path -LiteralPath $compiler)){$compiler=Join-Path $env:WINDIR 'Microsoft.NET/Framework/v4.0.30319/csc.exe'}
if(!(Test-Path -LiteralPath $compiler)){throw 'Windows .NET Framework C# compiler not found.'}
$executable=Join-Path $outputPath 'LifeAtlas.exe'
$source=Join-Path $repositoryDirectory 'local/desktop-launcher.cs'
$icon=Join-Path $repositoryDirectory 'local/lifeatlas.ico'
& $compiler /nologo /target:winexe /platform:anycpu /optimize+ /codepage:65001 /reference:System.Windows.Forms.dll /reference:System.Drawing.dll "/win32icon:$icon" "/out:$executable" $source
if($LASTEXITCODE -ne 0){throw 'Native desktop launcher build failed.'}
if(!(Test-Path -LiteralPath $executable)){throw 'Native desktop executable was not produced.'}
Write-Output $executable
