# -*- coding: utf-8 -*-
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
import numpy as np
import pickle

class Model():
    def __init__(self, weight_file_path):

      self.tiny_face()

    def residual_block(self, bottom, name, in_channel, neck_channel, out_channel, trunk):

      conv = tf.nn.conv2d(bottom, weight, strides=[1,1,1,1], padding="VALID")

      pre_activation = tf.nn.batch_normalization(pre_activation, mean, variance, offset, scale, variance_epsilon=eps)

      relu = tf.nn.relu(pre_activation) 

      conv = tf.nn.conv2d(bottom, weight, strides=[1,1,1,1], padding="SAME")

      pre_activation = tf.nn.batch_normalization(pre_activation, mean, variance, offset, scale, variance_epsilon=eps)

      relu = tf.nn.relu(pre_activation) 

      conv = tf.nn.conv2d(bottom, weight, strides=[1,1,1,1], padding="VALID")

      pre_activation = tf.nn.batch_normalization(pre_activation, mean, variance, offset, scale, variance_epsilon=eps)

      res = tf.nn.relu(res)

      return res

    def tiny_face(self, image):

        conv = tf.nn.conv2d(img, weight, strides=[1, 2, 2, 1], padding="VALID")

        pre_activation = tf.nn.batch_normalization(conv, mean, variance, offset, scale, variance_epsilon=eps)

        relu = tf.nn.relu(pre_activation) 

        pool1 = tf.nn.max_pool(conv, ksize=[1, 3, 3, 1], strides=[1, 2, 2, 1], padding='SAME')

        res2a_branch1 = tf.nn.conv2d(img, weight, strides=[1, 2, 2, 1], padding="VALID")

        res2a_branch1 = tf.nn.batch_normalization(res2a_branch1, mean, variance, offset, scale, variance_epsilon=eps)

        res2a = self.residual_block(pool1, 'res2a', 64, 64, 256, res2a_branch1)
        res2b = self.residual_block(res2a, 'res2b', 256, 64, 256, res2a)
        res2c = self.residual_block(res2b, 'res2c', 256, 64, 256, res2b)

        res3a_branch1 = tf.nn.conv2d(img, weight, strides=[1, 2, 2, 1], padding="VALID")

        res3a_branch1 = tf.nn.batch_normalization(res3a_branch1, mean, variance, offset, scale, variance_epsilon=eps)
        res3a = self.residual_block(res2c, 'res3a', 256, 128, 512, res3a_branch1)

        res3b1 = self.residual_block(res3a, 'res3b1', 512, 128, 512, res3a)
        res3b2 = self.residual_block(res3b1, 'res3b2', 512, 128, 512, res3b1)
        res3b3 = self.residual_block(res3b2, 'res3b3', 512, 128, 512, res3b2)

        res4a_branch1 = tf.nn.conv2d(img, weight, strides=[1, 2, 2, 1], padding="VALID")

        res4a_branch1 = tf.nn.batch_normalization(res4a_branch1, mean, variance, offset, scale, variance_epsilon=eps)

        res4a = self.residual_block(res3b3, 'res4a', 512, 256, 1024, res4a_branch1)

        res4b = res4a
        for i in range(22):
          res4b = self.residual_block(res4b , 1024, 256, 1024, res4b)

        score_res4 = tf.nn.conv2d(img, weight, strides=[1, 2, 2, 1], padding="VALID")

        score4 = tf.nn.conv2d_transpose(bottom, weight, output_shape, strides=[1, 2, 2, 1], padding="SAME")

        score_res3 = tf.nn.conv2d(img, weight, strides=[1, 2, 2, 1], padding="VALID")

        score_final = score4 + score_res3c
        return score_final
if __name__ == "__main__":
  Model()