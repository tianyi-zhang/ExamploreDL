
import tensorflow as tf
import numpy as np
import scipy.io
import pdb

MEAN_PIXEL = np.array([ 123.68 ,  116.779,  103.939])

def net(data_path, input_image):
    current = input_image
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.max_pool2d(input=current, ksize=(1, 2, 2, 1), strides=(1, 2, 2, 1),padding='SAME')

    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.max_pool2d(input=current, ksize=(1, 2, 2, 1), strides=(1, 2, 2, 1),padding='SAME')

    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.max_pool2d(input=current, ksize=(1, 2, 2, 1), strides=(1, 2, 2, 1),padding='SAME')

    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.max_pool2d(input=current, ksize=(1, 2, 2, 1), strides=(1, 2, 2, 1),padding='SAME')

    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    current = tf.nn.relu(current)
    current = tf.nn.conv2d(input=current, filters=tf.constant(weights), strides=(1, 1, 1, 1),padding='SAME')
    net = tf.nn.relu(current)

    return net

if __name__ == '__main__':
    BATCH_SIZE = 4
    LEARNING_RATE = 1e-3
    EPOCHS = 2
    net()