from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import numpy as np
import tensorflow as tf

_BATCH_NORM_DECAY = 0.997
_BATCH_NORM_EPSILON = 1e-5
DEFAULT_VERSION = 2

class Model(object):

    def __init__(self):
      self.data_format = data_format
      self.filter_sizes = [64,128,256,512]
      self.num_convs = 2
      self.num_lmark = num_lmark
      self.kernel_size = 3
      self.img_size = img_size
      self.build()

    def build(self):

      inputs = inputs_imgs

      for i in range(2):
        conv = tf.layers.conv2d(inputs,64,3,1,padding='same',data_format=data_format)
        relu = tf.nn.relu(conv)
        inputs = tf.layers.batch_normalization(relu)
        inputs = tf.layers.max_pooling2d(inputs,2,2)

      for i in range(2):
        conv = tf.layers.conv2d(inputs,128,3,1,padding='same',data_format=data_format)
        relu = tf.nn.relu(conv)
        inputs = tf.layers.batch_normalization(relu)
        inputs = tf.layers.max_pooling2d(inputs,2,2)

      for i in range(2):
        conv = tf.layers.conv2d(inputs,256,3,1,padding='same',data_format=data_format)
        relu = tf.nn.relu(conv)
        inputs = tf.layers.batch_normalization(relu)
        inputs = tf.layers.max_pooling2d(inputs,2,2)

      for i in range(2):
        conv = tf.layers.conv2d(inputs,512,3,1,padding='same',data_format=data_format)
        relu = tf.nn.relu(conv)
        inputs = tf.layers.batch_normalization(relu)
        inputs = tf.layers.max_pooling2d(inputs,2,2)
          
  
      inputs = tf.contrib.layers.flatten(inputs)
      inputs = tf.layers.dropout(inputs,0.5,training=s1_training)

      s1_fc1 = tf.layers.dense(inputs,256,activation=tf.nn.relu)
      s1_fc1 = tf.layers.batch_normalization(s1_fc1,s1_training,data_format=self.data_format)

      s1_fc2 = tf.layers.dense(s1_fc1,activation=None)
      
      s2_feature = tf.layers.dense(s1_fc1,activation=tf.nn.relu)

      inputs = tf.layers.batch_normalization(inputs,s2_training,self.data_format)

      for i in range(2):
        conv = tf.layers.conv2d(inputs,64,3,1,padding='same',data_format=data_format)
        relu = tf.nn.relu(conv)
        inputs = tf.layers.batch_normalization(relu)
        inputs = tf.layers.max_pooling2d(inputs,2,2)

      for i in range(2):
        conv = tf.layers.conv2d(inputs,128,3,1,padding='same',data_format=data_format)
        relu = tf.nn.relu(conv)
        inputs = tf.layers.batch_normalization(relu)
        inputs = tf.layers.max_pooling2d(inputs,2,2)

      for i in range(2):
        conv = tf.layers.conv2d(inputs,256,3,1,padding='same',data_format=data_format)
        relu = tf.nn.relu(conv)
        inputs = tf.layers.batch_normalization(relu)
        inputs = tf.layers.max_pooling2d(inputs,2,2)

      for i in range(2):
        conv = tf.layers.conv2d(inputs,512,3,1,padding='same',data_format=data_format)
        relu = tf.nn.relu(conv)
        inputs = tf.layers.batch_normalization(relu)
        inputs = tf.layers.max_pooling2d(inputs,2,2)
  
      inputs = tf.contrib.layers.flatten(inputs)
      inputs = tf.layers.dropout(inputs,0.5,training=s2_training)

      s2_fc1 = tf.layers.dense(inputs,256,activation=tf.nn.relu)
      s2_fc1 = tf.layers.batch_normalization(s2_fc1,s2_training,data_format=self.data_format)

      s2_fc2 = tf.layers.dense(s2_fc1,activation=None)

      return rd
if __name__ == "__main__" :
  Model()