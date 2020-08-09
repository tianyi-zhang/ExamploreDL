import tensorflow as tf
from tflearn.layers.conv import global_avg_pool
from tensorflow.contrib.layers import batch_norm, flatten
from tensorflow.contrib.framework import arg_scope
from cifar10 import *
import numpy as np

weight_decay = 0.0005
momentum = 0.9

init_learning_rate = 0.1
cardinality = 8 # how many split ?
blocks = 3 # res_block ! (split + transition)
depth = 64 # out channel

"""
So, the total number of layers is (3*blokcs)*residual_layer_num + 2
because, blocks = split(conv 2) + transition(conv 1) = 3 layer
and, first conv layer 1, last dense layer 1
thus, total number of layers = (3*blocks)*residual_layer_num + 2
"""

reduction_ratio = 4

batch_size = 128
iteration = 391
# 128 * 391 ~ 50,000

test_iteration = 10

total_epochs = 100

class SE_ResNeXt():
    def __init__(self, x, training):
        self.training = training
        self.model = self.Build_SEnet(x)

    def first_layer(self, x, scope):
        x = tf.layers.conv2d(x, filter=64, kernel=[3, 3], stride=1, layer_name=scope+'_conv1')
        x = tf.nn.batch_normalization(x)
        x = tf.nn.relu(x)

        return x

    def transform_layer(self, x, stride, scope):
        x = tf.layers.conv2d(x, filter=depth, kernel=[1,1], stride=1, layer_name=scope+'_conv1')
        x = tf.nn.batch_normalization(x)
        x = tf.nn.relu(x)

        x = tf.layers.conv2d(x, filter=depth, kernel=[3,3], stride=stride, layer_name=scope+'_conv2')
        x = tf.nn.batch_normalization(x)
        x = tf.nn.relu(x)
        return x

    def transition_layer(self, x, out_dim, scope):

        x = tf.layers.conv2d(x, filter=out_dim, kernel=[1,1], stride=1, layer_name=scope+'_conv1')
        x = tf.nn.batch_normalization(x)
        # x = tf.nn.relu(x)

        return x

    def split_layer(self, input_x, stride, layer_name):
        for i in range(8) :
            splits = self.transform_layer(input_x, stride=stride, scope=layer_name + '_splitN_' + str(i))
            layers_split.append(splits)

    def squeeze_excitation_layer(self, input_x, out_dim, ratio, layer_name):

        excitation = tf.layers.dense(squeeze, units=out_dim / ratio, layer_name=layer_name+'_fully_connected1')
        excitation = tf.nn.relu(excitation)
        excitation = tf.layers.dense(excitation, units=out_dim, layer_name=layer_name+'_fully_connected2')
        excitation = tf.nn.sigmoid(excitation)

        excitation = tf.reshape(excitation, [-1,1,1,out_dim])
        scale = input_x * excitation

        return scale

    def residual_layer(self, input_x, out_dim, layer_num, res_block=blocks):
        # split + transform(bottleneck) + transition + merge
        # input_dim = input_x.get_shape().as_list()[-1]

        for i in range(3):

            x = self.split_layer(input_x, stride=stride, layer_name='split_layer_'+layer_num+'_'+str(i))
            x = self.transition_layer(x, out_dim=out_dim, scope='trans_layer_'+layer_num+'_'+str(i))
            x = self.squeeze_excitation_layer(x, out_dim=out_dim, ratio=reduction_ratio, layer_name='squeeze_layer_'+layer_num+'_'+str(i))

            pad_input_x = tf.layers.average_pooling2d(input_x, pool_size=[2,2], stride=2, padding='SAME')
            pad_input_x = tf.pad(pad_input_x, [[0, 0], [0, 0], [0, 0], [channel, channel]]) # [?, height, width, channel]

            input_x = tf.nn.relu(x + pad_input_x)

        return input_x


    def Build_SEnet(self, input_x):
        # only cifar10 architecture

        input_x = self.first_layer(input_x, scope='first_layer')

        x = self.residual_layer(input_x, out_dim=64, layer_num='1')
        x = self.residual_layer(x, out_dim=128, layer_num='2')
        x = self.residual_layer(x, out_dim=256, layer_num='3')

        x = flatten(x)

        x = tf.layers.dense(x, layer_name='final_fully_connected')
        return x


logits = SE_ResNeXt(x, training=training_flag)
loss = tf.nn.softmax_cross_entropy_with_logits(labels=label, logits=logits)
cost = tf.reduce_mean(loss)
optimizer = tf.train.MomentumOptimizer(learning_rate=learning_rate, momentum=momentum, use_nesterov=True)