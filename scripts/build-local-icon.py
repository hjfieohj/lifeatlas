"""Render the authored SVG once, then produce a multi-resolution Windows icon."""
from pathlib import Path
from PIL import Image, PngImagePlugin
import subprocess
root=Path(__file__).resolve().parent.parent
subprocess.run(['node',str(root/'scripts/render-app-icon.mjs')],cwd=root,check=True)
image=Image.open(root/'local/lifeatlas-icon.png').convert('RGBA')
metadata=PngImagePlugin.PngInfo()
metadata.add_text('impeccable:prompt','Origin: original LifeAtlas Aurora Nebula geometry in public/brand/lifeatlas-app-icon.svg. Rendered locally by Sharp; no generated bitmap, stock asset or paid service. See public/brand/app-icon-provenance.json.')
image.save(root/'local/lifeatlas-icon.png',pnginfo=metadata)
image.save(root/'local/lifeatlas.ico',sizes=[(16,16),(20,20),(24,24),(32,32),(40,40),(48,48),(64,64),(96,96),(128,128),(256,256)])
