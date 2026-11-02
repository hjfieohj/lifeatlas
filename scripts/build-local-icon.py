"""Raster sizes for the existing favicon.svg geometry; no new design or remote asset."""
from pathlib import Path
from PIL import Image, ImageDraw
import xml.etree.ElementTree as ET
root=Path(__file__).resolve().parent.parent
svg=ET.parse(root/'public/favicon.svg').getroot()
background=svg[0].attrib['fill'];ink=svg[1].attrib['stroke']
scale=24
image=Image.new('RGBA',(40*scale,40*scale),(0,0,0,0));draw=ImageDraw.Draw(image)
draw.rounded_rectangle((0,0,40*scale-1,40*scale-1),radius=10*scale,fill=background)
for points in [[(12,10),(12,30),(29,30)],[(20,10),(20,23),(29,23)]]:
    draw.line([(x*scale,y*scale) for x,y in points],fill=ink,width=3*scale,joint='curve')
image=image.resize((256,256),Image.Resampling.LANCZOS)
image.save(root/'local/lifeatlas.ico',sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
