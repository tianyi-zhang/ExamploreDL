import tensorflow as tf
from tflearn.layers.conv import global_avg_pool
from tensorflow.contrib.layers import batch_norm, flatten
from tensorflow.contrib.framework import arg_scope
from cifar10 import *
import numpy as np

weight_decay = 0.0005
momentum = 0.9

init_learning_rate = 0.1
reduction_ratio = 4

batch_size = 128
iteration = 391
# 128 * 391 ~ 50,000

test_iteration = 10

total_epochs = 100

def conv_layer(input, filter, kernel, stride=1, padding='SAME', layer_name="conv"):
    network = tf.layers.conv2d(inputs=input, use_bias=True, filters=filter, kernel_size=kernel, strides=stride, padding=padding)
    network = tf.nn.relu(network)
    return network

class SE_Inception_v4():
    def __init__(self, x, training):
        self.training = training
        self.model = self.Build_SEnet(x)

    def Stem(self, x, scope):
        x = conv_layer(x, filter=32, kernel=[3,3], stride=2, padding='VALID', layer_name=scope+'_conv1')
        x = conv_layer(x, filter=32, kernel=[3,3], padding='VALID', layer_name=scope+'_conv2')
        block_1 = conv_layer(x, filter=64, kernel=[3,3], layer_name=scope+'_conv3')

        split_max_x = tf.layers.max_pooling2d(block_1, pool_size=[3,3], stride=2, padding='VALID')
        split_conv_x = conv_layer(block_1, filter=96, kernel=[3,3], stride=2, padding='VALID', layer_name=scope+'_split_conv1')
        x = Concatenation([split_max_x,split_conv_x])

        split_conv_x1 = conv_layer(x, filter=64, kernel=[1,1], layer_name=scope+'_split_conv2')
        split_conv_x1 = conv_layer(split_conv_x1, filter=96, kernel=[3,3], padding='VALID', layer_name=scope+'_split_conv3')

        split_conv_x2 = conv_layer(x, filter=64, kernel=[1,1], layer_name=scope+'_split_conv4')
        split_conv_x2 = conv_layer(split_conv_x2, filter=64, kernel=[7,1], layer_name=scope+'_split_conv5')
        split_conv_x2 = conv_layer(split_conv_x2, filter=64, kernel=[1,7], layer_name=scope+'_split_conv6')
        split_conv_x2 = conv_layer(split_conv_x2, filter=96, kernel=[3,3], padding='VALID', layer_name=scope+'_split_conv7')

        x = Concatenation([split_conv_x1,split_conv_x2])

        split_conv_x = conv_layer(x, filter=192, kernel=[3,3], stride=2, padding='VALID', layer_name=scope+'_split_conv8')
        split_max_x = tf.layers.max_pooling2d(x, pool_size=[3,3], stride=2, padding='VALID')

        x = Concatenation([split_conv_x, split_max_x])

        x = tf.nn.batch_normalization(x, training=self.training, scope=scope+'_batch1')
        x = tf.nn.relu(x)

        return x

    def Inception_A(self, x, scope):
        split_conv_x1 = tf.layers.average_pooling2d(x, pool_size=[3,3], stride=1, padding='SAME') 
        split_conv_x1 = conv_layer(split_conv_x1, filter=96, kernel=[1,1], layer_name=scope+'_split_conv1')

        split_conv_x2 = conv_layer(x, filter=96, kernel=[1,1], layer_name=scope+'_split_conv2')

        split_conv_x3 = conv_layer(x, filter=64, kernel=[1,1], layer_name=scope+'_split_conv3')
        split_conv_x3 = conv_layer(split_conv_x3, filter=96, kernel=[3,3], layer_name=scope+'_split_conv4')

        split_conv_x4 = conv_layer(x, filter=64, kernel=[1,1], layer_name=scope+'_split_conv5')
        split_conv_x4 = conv_layer(split_conv_x4, filter=96, kernel=[3,3], layer_name=scope+'_split_conv6')
        split_conv_x4 = conv_layer(split_conv_x4, filter=96, kernel=[3,3], layer_name=scope+'_split_conv7')

        x = Concatenation([split_conv_x1, split_conv_x2, split_conv_x3, split_conv_x4])

        x = tf.nn.batch_normalization(x, training=self.training, scope=scope+'_batch1')
        x = tf.nn.relu(x)

        return x

    def Inception_B(self, x, scope):
        init = x

        split_conv_x1 = tf.layers.average_pooling2d(x, pool_size=[3,3], stride=1, padding='SAME') 
        split_conv_x1 = conv_layer(split_conv_x1, filter=128, kernel=[1,1], layer_name=scope+'_split_conv1')

        split_conv_x2 = conv_layer(x, filter=384, kernel=[1,1], layer_name=scope+'_split_conv2')

        split_conv_x3 = conv_layer(x, filter=192, kernel=[1,1], layer_name=scope+'_split_conv3')
        split_conv_x3 = conv_layer(split_conv_x3, filter=224, kernel=[1,7], layer_name=scope+'_split_conv4')
        split_conv_x3 = conv_layer(split_conv_x3, filter=256, kernel=[1,7], layer_name=scope+'_split_conv5')

        split_conv_x4 = conv_layer(x, filter=192, kernel=[1,1], layer_name=scope+'_split_conv6')
        split_conv_x4 = conv_layer(split_conv_x4, filter=192, kernel=[1,7], layer_name=scope+'_split_conv7')
        split_conv_x4 = conv_layer(split_conv_x4, filter=224, kernel=[7,1], layer_name=scope+'_split_conv8')
        split_conv_x4 = conv_layer(split_conv_x4, filter=224, kernel=[1,7], layer_name=scope+'_split_conv9')
        split_conv_x4 = conv_layer(split_conv_x4, filter=256, kernel=[7,1], layer_name=scope+'_split_connv10')

        x = Concatenation([split_conv_x1, split_conv_x2, split_conv_x3, split_conv_x4])

        x = tf.nn.batch_normalization(x, training=self.training, scope=scope+'_batch1')
        x = tf.nn.relu(x)

        return x

    def Inception_C(self, x, scope):

        split_conv_x1 = tf.layers.average_pooling2d(x, pool_size=[3,3], stride=1, padding='SAME') 
        split_conv_x1 = conv_layer(split_conv_x1, filter=256, kernel=[1,1], layer_name=scope+'_split_conv1')

        split_conv_x2 = conv_layer(x, filter=256, kernel=[1,1], layer_name=scope+'_split_conv2')

        split_conv_x3 = conv_layer(x, filter=384, kernel=[1,1], layer_name=scope+'_split_conv3')
        split_conv_x3_1 = conv_layer(split_conv_x3, filter=256, kernel=[1,3], layer_name=scope+'_split_conv4')
        split_conv_x3_2 = conv_layer(split_conv_x3, filter=256, kernel=[3,1], layer_name=scope+'_split_conv5')

        split_conv_x4 = conv_layer(x, filter=384, kernel=[1,1], layer_name=scope+'_split_conv6')
        split_conv_x4 = conv_layer(split_conv_x4, filter=448, kernel=[1,3], layer_name=scope+'_split_conv7')
        split_conv_x4 = conv_layer(split_conv_x4, filter=512, kernel=[3,1], layer_name=scope+'_split_conv8')
        split_conv_x4_1 = conv_layer(split_conv_x4, filter=256, kernel=[3,1], layer_name=scope+'_split_conv9')
        split_conv_x4_2 = conv_layer(split_conv_x4, filter=256, kernel=[1,3], layer_name=scope+'_split_conv10')

        x = Concatenation([split_conv_x1, split_conv_x2, split_conv_x3_1, split_conv_x3_2, split_conv_x4_1, split_conv_x4_2])

        x = tf.nn.batch_normalization(x, training=self.training, scope=scope+'_batch1')
        x = tf.nn.relu(x)

        return x

    def Reduction_A(self, x, scope):


        split_max_x = tf.layers.max_pooling2d(x, pool_size=[3,3], stride=2, padding='VALID')

        split_conv_x1 = conv_layer(x, filter=n, kernel=[3,3], stride=2, padding='VALID', layer_name=scope+'_split_conv1')

        split_conv_x2 = conv_layer(x, filter=k, kernel=[1,1], layer_name=scope+'_split_conv2')
        split_conv_x2 = conv_layer(split_conv_x2, filter=l, kernel=[3,3], layer_name=scope+'_split_conv3')
        split_conv_x2 = conv_layer(split_conv_x2, filter=m, kernel=[3,3], stride=2, padding='VALID', layer_name=scope+'_split_conv4')

        x = Concatenation([split_max_x, split_conv_x1, split_conv_x2])

        x = tf.nn.batch_normalization(x, training=self.training, scope=scope+'_batch1')
        x = tf.nn.relu(x)

        return x

    def Reduction_B(self, x, scope):
        split_max_x = tf.layers.max_pooling2d(x, pool_size=[3,3], stride=2, padding='VALID')

        split_conv_x1 = conv_layer(x, filter=256, kernel=[1,1], layer_name=scope+'_split_conv1')
        split_conv_x1 = conv_layer(split_conv_x1, filter=384, kernel=[3,3], stride=2, padding='VALID', layer_name=scope+'_split_conv2')

        split_conv_x2 = conv_layer(x, filter=256, kernel=[1,1], layer_name=scope+'_split_conv3')
        split_conv_x2 = conv_layer(split_conv_x2, filter=288, kernel=[3,3], stride=2, padding='VALID', layer_name=scope+'_split_conv4')

        split_conv_x3 = conv_layer(x, filter=256, kernel=[1,1], layer_name=scope+'_split_conv5')
        split_conv_x3 = conv_layer(split_conv_x3, filter=288, kernel=[3,3], layer_name=scope+'_split_conv6')
        split_conv_x3 = conv_layer(split_conv_x3, filter=320, kernel=[3,3], stride=2, padding='VALID', layer_name=scope+'_split_conv7')

        x = Concatenation([split_max_x, split_conv_x1, split_conv_x2, split_conv_x3])

        x = tf.nn.batch_normalization(x, training=self.training, scope=scope+'_batch1')
        x = tf.nn.relu(x)

        return x

    def Squeeze_excitation_layer(self, input_x, out_dim, ratio, layer_name):

        excitation = tf.layers.dense(squeeze, units=out_dim / ratio, layer_name=layer_name+'_fully_connected1')
        excitation = tf.nn.relu(excitation)
        excitation = tf.layers.dense(excitation, units=out_dim, layer_name=layer_name+'_fully_connected2')
        excitation = tf.nn.sigmoid(excitation)

        excitation = tf.reshape(excitation, [-1,1,1,out_dim])

        scale = input_x * excitation

        return scale

    def Build_SEnet(self, input_x):
        input_x = tf.pad(input_x, [[0, 0], [32, 32], [32, 32], [0, 0]])
        # size 32 -> 96
        # only cifar10 architecture

        x = self.Stem(input_x, scope='stem')

        for i in range(4) :
            x = self.Inception_A(x, scope='Inception_A'+str(i))
            channel = int(np.shape(x)[-1])
            x = self.Squeeze_excitation_layer(x, out_dim=channel, ratio=reduction_ratio, layer_name='SE_A'+str(i))

        x = self.Reduction_A(x, scope='Reduction_A')

        for i in range(7)  :
            x = self.Inception_B(x, scope='Inception_B'+str(i))
            channel = int(np.shape(x)[-1])
            x = self.Squeeze_excitation_layer(x, out_dim=channel, ratio=reduction_ratio, layer_name='SE_B'+str(i))

        x = self.Reduction_B(x, scope='Reduction_B')

        for i in range(3) :
            x = self.Inception_C(x, scope='Inception_C'+str(i))
            channel = int(np.shape(x)[-1])
            x = self.Squeeze_excitation_layer(x, out_dim=channel, ratio=reduction_ratio, layer_name='SE_C'+str(i))

        x = tf.layers.dropout(x, rate=0.2, training=self.training)
        x = flatten(x)

        x = tf.layers.dense(x, layer_name='final_fully_connected')
        return x


# image_size = 32, img_channels = 3, class_num = 10 in cifar10


logits = SE_Inception_v4(x, training=training_flag)
loss = tf.nn.softmax_cross_entropy_with_logits(labels=label, logits=logits)
cost = tf.reduce_mean(loss)

optimizer = tf.train.MomentumOptimizer(learning_rate=learning_rate, momentum=momentum, use_nesterov=True)