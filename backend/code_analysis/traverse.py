import os
import os.path

def get_py(path,list1):
    fileList = os.listdir(path)
    for filename in fileList:
        pathTmp = os.path.join(path,filename)
        if os.path.isdir(pathTmp):
            get_py(pathTmp,list1)
        elif filename[-3:].upper() == '.PY':
            list1.append(pathTmp)
    return list1

def traverse_py(path):
    list1 = []
    path = path.strip()
    list1 = get_py(path,list1)
    return list1
