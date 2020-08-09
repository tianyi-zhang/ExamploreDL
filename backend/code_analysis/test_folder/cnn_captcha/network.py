import tensorflow as tf
import numpy as np
import os
from PIL import Image
import random

def model(self):
    x = tf.reshape(self.X, shape=[-1, self.image_height, self.image_width, 1])

    # 卷积层1
    conv1 = tf.nn.conv2d(x, wc1, strides=[1, 1, 1, 1], padding='SAME')
    conv1 = tf.nn.relu(tf.nn.bias_add(conv1, bc1))
    conv1 = tf.nn.max_pool(conv1, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')
    conv1 = tf.nn.dropout(conv1, self.keep_prob)

    # 卷积层2
    conv2 = tf.nn.conv2d(conv1, wc2, strides=[1, 1, 1, 1], padding='SAME')
    conv2 = tf.nn.relu(tf.nn.bias_add(conv2, bc2))
    conv2 = tf.nn.max_pool(conv2, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')
    conv2 = tf.nn.dropout(conv2, self.keep_prob)

    # 卷积层3
    conv3 = tf.nn.conv2d(conv2, wc3, strides=[1, 1, 1, 1], padding='SAME')
    conv3 = tf.nn.relu(tf.nn.bias_add(conv3, bc3))
    conv3 = tf.nn.max_pool(conv3, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')
    conv3 = tf.nn.dropout(conv3, self.keep_prob)
    print(">>> convolution 3: ", conv3.shape)
    next_shape = conv3.shape[1] * conv3.shape[2] * conv3.shape[3]

    # 全连接层1
    dense = tf.keras.layers.Dense(conv3, [-1, wd1.get_shape().as_list()[0]])
    dense = tf.nn.relu(tf.add(tf.matmul(dense, wd1), bd1))
    dense = tf.nn.dropout(dense, self.keep_prob)

    # 全连接层2
    tf.keras.layers.Dense()

    tf.nn.sigmoid_cross_entropy_with_logits(logits=y_predict, labels=self.Y)

    tf.nn.sigmoid()

    tf.train.AdamOptimizer(learning_rate=0.0001)

    return y_predict

if __name__ == '__main__':
    batch_size = 128
    learning_rate=0.0001
    epochs = 3000
    model()