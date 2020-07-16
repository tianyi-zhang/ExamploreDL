from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Conv2D, MaxPooling2D, ZeroPadding2D
from keras.optimizers import SGD,RMSprop,adam
from keras.utils import np_utils
import numpy as np
#import matplotlib.pyplot as plt
import os

from PIL import Image
# SKLEARN
from sklearn.utils import shuffle
from sklearn.model_selection import train_test_split
import json

import cv2
import matplotlib
#matplotlib.use("TkAgg")
from matplotlib import pyplot as plt

# input image dimensions
img_rows, img_cols = 200, 200

# number of channels
# For grayscale use 1 value and for color images use 3 (R,G,B channels)
img_channels = 1


# Batch_size to train
batch_size = 32


# Number of epochs to train (change it accordingly)
epochs = 15  #25

# Size of convolution kernel

def loadCNN(bTraining = False):
    global get_output
    model = Sequential()
    
    
    tf.keras.layers.Conv2D(32, (3, 3),padding='valid',input_shape=(img_channels, img_rows, img_cols))
    convout1 = tf.keras.layers.Relu()
    model.add(convout1)
    tf.keras.layers.Conv2D(32, (3, 3))
    convout2 = tf.keras.layers.Relu()
    model.add(convout2)
    tf.keras.layers.MaxPooling2D(pool_size=(2, 2))
    tf.keras.layers.Dropout(0.5)

    tf.keras.layers.Flatten()
    tf.keras.layers.Dense(128)
    tf.keras.layers.Relu()
    tf.keras.layers.Dropout(0.5)
    tf.keras.layers.Dense(5)
    tf.keras.layers.Softmax()
    
    #sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
    tf.keras.losses.categorical_crossentropy()
    tf.keras.optimizers.Adadelta()
    
    # Model summary
    model.summary()
    # Model conig details
    model.get_config()

if __name__ == '__main__':
    lr=0.01
    decay=1e-6
    momentum=0.9
    loadCNN()