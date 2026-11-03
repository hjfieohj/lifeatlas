"""Render the authored SVG once, then produce a multi-resolution Windows icon."""
from pathlib import Path
from PIL import Image
import subprocess
root=Path(__file__).resolve().parent.parent
subprocess.run(['node',str(root/'scripts/render-app-icon.mjs')],cwd=root,check=True)
image=Image.open(root/'local/lifeatlas-icon.png').convert('RGBA')
image.save(root/'local/lifeatlas.ico',sizes=[(16,16),(20,20),(24,24),(32,32),(40,40),(48,48),(64,64),(96,96),(128,128),(256,256)])
