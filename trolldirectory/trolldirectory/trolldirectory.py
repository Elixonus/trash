import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3" 
import glob
import random
import cv2
import cvlib as cv
from PIL import Image

dirname = os.path.dirname(__file__)


def troll_directory(directory_path: str) -> None:
    image_paths = []
    for file_path in glob.iglob(directory_path + "**/*.png", recursive=True):
        image_paths.append(file_path)
    for file_path in glob.iglob(directory_path + "**/*.jpg", recursive=True):
        image_paths.append(file_path)
    for file_path in glob.iglob(directory_path + "**/*.jpeg", recursive=True):
        image_paths.append(file_path)
    for file_path in glob.iglob(directory_path + "**/*.gif", recursive=True):
        image_paths.append(file_path)
    counter = 0
    for i, image_path in enumerate(image_paths):
        if troll_image(image_path):
            counter += 1
            print(f"Trolled {counter}")


def troll_image(image_path: str) -> bool:
    image = cv2.imread(image_path)
    faces, confidences = cv.detect_face(image, threshold=0.2)
    image = Image.fromarray(image)
    for face in faces:
        meme = random.choices(
            ["trollface.png", "megustaface.png", "lolface.png", "sombreroface.png"],
            weights=[1, 0.4, 0.4, 0.4]
        )[0]
        meme_face = Image.open(os.path.join(dirname, f"images/{meme}"))
        dx = int(0.4 * (face[2] - face[0]))
        dy = int(0.2 * (face[3] - face[1]))
        if meme == "sombreroface.png":
            dx = int(0.8 * (face[2] - face[0]))
            dy = int(0.4 * (face[3] - face[1]))
        sx, sy = face[0] - dx, face[1] - dy
        ex, ey = face[2] + dx, face[3] + dy
        meme_face = meme_face.resize((ex - sx, ey - sy))
        print(meme)
        image.paste(meme_face, (sx, sy), mask=meme_face)
    if len(faces) > 0:
        image.save(image_path)
        return True
    else:
        return False


print(r"""
  _____    ____    U  ___ u   _       _      
 |_ " _|U |  _"\ u  \/"_ \/  |"|     |"|     
   | |   \| |_) |/  | | | |U | | u U | | u   
  /| |\   |  _ <.-,_| |_| | \| |/__ \| |/__  
 u |_|U   |_| \_\\_)-\___/   |_____| |_____| 
 _// \\_  //   \\_    \\     //  \\  //  \\  
(__) (__)(__)  (__)  (__)   (_")("_)(_")("_) 
""")

directory = input("Directory to troll: ")
print(f"You sure you want to troll directory? {os.path.abspath(directory)}")
while True:
    do = input("Sure? (Y/N): ")
    if do.upper() == "YES" or do.upper() == "Y":
        break
    elif do.upper() == "NO" or do.upper() == "N":
        quit()
    else:
        continue
print()
troll_directory(directory)
print("It's done boss.")