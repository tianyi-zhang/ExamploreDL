#!/usr/bin/env python
from __future__ import print_function

import skimage as skimage
from skimage import transform, color, exposure
from skimage.viewer import ImageViewer
import random
from random import choice
import numpy as np
from collections import deque
import time

import json
from keras.models import model_from_json
from keras.models import Sequential, load_model, Model
from keras.layers.core import Dropout, Activation
from keras.layers import merge, MaxPooling2D, Input, AveragePooling2D, Lambda, Merge, Activation, Embedding
from keras.optimizers import SGD, Adam, rmsprop
from keras.layers.recurrent import LSTM, GRU
from keras.layers.normalization import BatchNormalization
from keras import backend as K

import tensorflow as tf
#tf.python.control_flow_ops = tf

class Networks(object):
   
    def __init__(input_shape, measurement_size, goal_size, action_size, num_timesteps, learning_rate):
        """
        Neural Network for Direct Future Predition (DFP)
        """

        
        perception_feat = tf.keras.layers.Conv2D(32, 8, 8, subsample=(4,4), activation='relu')
        perception_feat = tf.keras.layers.Conv2D(64, 4, 4, subsample=(2,2), activation='relu')
        perception_feat = tf.keras.layers.Conv2D(64, 3, 3, activation='relu')
        perception_feat = tf.keras.layers.Flatten()
        perception_feat = tf.keras.layers.Dense(512, activation='relu')

        
        measurement_feat = tf.keras.layers.Dense(128, activation='relu')
        measurement_feat = tf.keras.layers.Dense(128, activation='relu')
        measurement_feat = tf.keras.layers.Dense(128, activation='relu')

        
        goal_feat = tf.keras.layers.Dense(128, activation='relu')
        goal_feat = tf.keras.layers.Dense(128, activation='relu')
        goal_feat = tf.keras.layers.Dense(128, activation='relu')


        expectation_stream = tf.keras.layers.Dense(measurement_pred_size, activation='relu')

        prediction_list = []
        for i in range(3):
            action_stream = tf.keras.layers.Dense(measurement_pred_size, activation='relu')

        adam = tf.keras.optimizers.Adam(lr=learning_rate)

        tf.keras.losses.MSE()

        return model

if __name__ == "__main__":
    learning_rate = 0.00001
    batch_size = 32
    Networks()
