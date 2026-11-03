param([Parameter(Mandatory=$true)][string]$InputDirectory,[Parameter(Mandatory=$true)][string]$OutputFile)
$source=(Resolve-Path -LiteralPath $InputDirectory).Path
$destination=[IO.Path]::GetFullPath($OutputFile)
if($destination.StartsWith($source+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'ZIP output must be outside its input directory.'}
Compress-Archive -LiteralPath $source -DestinationPath $destination -Force
if(!(Test-Path -LiteralPath $destination)){throw 'ZIP was not produced.'}
