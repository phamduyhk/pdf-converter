import os
import sys
import time
args = sys.argv
path = "./"+args[1]+"/"
os.chdir(path)
file_list = os.listdir("./")
start = time.time()
for file in file_list:
    convert_code = "convert -quality 100 -density 300 {} +repage -crop 2x2@  +repage Completed_{}".format(file,file)
    os.system(convert_code)
end = time.time()
print("Completed! Excute time: {}s".format((end-start)))




