# Copyright 2016 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

"""Contains the definition of the Inception Resnet V1 architecture.
As described in http://arxiv.org/abs/1602.07261.
  Inception-v4, Inception-ResNet and the Impact of Residual Connections
    on Learning
  Christian Szegedy, Sergey Ioffe, Vincent Vanhoucke, Alex Alemi
"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
import tensorflow.contrib.tf.contrib.slim as slim


# Inception-Resnet-A
def block35(net, scale=1.0, activation_fn=tf.nn.relu, scope=None, reuse=None):
    """Builds the 35x35 resnet block."""
    tower_conv = tf.contrib.slim.conv2d(net, 32, 1, scope='Conv2d_1x1')
    tower_conv1_0 = tf.contrib.slim.conv2d(net, 32, 1, scope='Conv2d_0a_1x1')
    tower_conv1_1 = tf.contrib.slim.conv2d(tower_conv1_0, 32, 3, scope='Conv2d_0b_3x3')
    tower_conv2_0 = tf.contrib.slim.conv2d(net, 32, 1, scope='Conv2d_0a_1x1')
    tower_conv2_1 = tf.contrib.slim.conv2d(tower_conv2_0, 32, 3, scope='Conv2d_0b_3x3')
    tower_conv2_2 = tf.contrib.slim.conv2d(tower_conv2_1, 32, 3, scope='Conv2d_0c_3x3')
    mixed = tf.concat([tower_conv, tower_conv1_1, tower_conv2_2], 3)
    up = tf.contrib.slim.conv2d(mixed, net.get_shape()[3], 1, normalizer_fn=None,activation_fn=None, scope='Conv2d_1x1')
    net = tf.nn.relu(net)
    return net


# Inception-Resnet-B
def block17(net, scale=1.0, activation_fn=tf.nn.relu, scope=None, reuse=None):
    """Builds the 17x17 resnet block."""
    tower_conv = tf.contrib.slim.conv2d(net, 128, 1, scope='Conv2d_1x1')
    tower_conv1_0 = tf.contrib.slim.conv2d(net, 128, 1, scope='Conv2d_0a_1x1')
    tower_conv1_1 = tf.contrib.slim.conv2d(tower_conv1_0, 128, [1, 7],scope='Conv2d_0b_1x7')
    tower_conv1_2 = tf.contrib.slim.conv2d(tower_conv1_1, 128, [7, 1],scope='Conv2d_0c_7x1')
    mixed = tf.concat([tower_conv, tower_conv1_2], 3)
    up = tf.contrib.slim.conv2d(mixed, net.get_shape()[3], 1, normalizer_fn=None,activation_fn=None, scope='Conv2d_1x1')
    net = tf.nn.relu(net)
    return net


# Inception-Resnet-C
def block8(net, scale=1.0, activation_fn=tf.nn.relu, scope=None, reuse=None):
    """Builds the 8x8 resnet block."""
    tower_conv = tf.contrib.slim.conv2d(net, 192, 1, scope='Conv2d_1x1')
    tower_conv1_0 = tf.contrib.slim.conv2d(net, 192, 1, scope='Conv2d_0a_1x1')
    tower_conv1_1 = tf.contrib.slim.conv2d(tower_conv1_0, 192, [1, 3],scope='Conv2d_0b_1x3')
    tower_conv1_2 = tf.contrib.slim.conv2d(tower_conv1_1, 192, [3, 1],scope='Conv2d_0c_3x1')
    mixed = tf.concat([tower_conv, tower_conv1_2], 3)
    up = tf.contrib.slim.conv2d(mixed, net.get_shape()[3], 1, normalizer_fn=None,activation_fn=None, scope='Conv2d_1x1')
    net = tf.nn.relu(net)
    return net


def reduction_a(net, k, l, m, n):
    tower_conv = tf.contrib.slim.conv2d(net, n, 3, stride=2, padding='VALID',scope='Conv2d_1a_3x3')
    tower_conv1_0 = tf.contrib.slim.conv2d(net, k, 1, scope='Conv2d_0a_1x1')
    tower_conv1_1 = tf.contrib.slim.conv2d(tower_conv1_0, l, 3,scope='Conv2d_0b_3x3')
    tower_conv1_2 = tf.contrib.slim.conv2d(tower_conv1_1, m, 3,stride=2, padding='VALID',scope='Conv2d_1a_3x3')
    tower_pool = tf.contrib.slim.max_pool2d(net, 3, stride=2, padding='VALID',scope='MaxPool_1a_3x3')
    net = tf.concat([tower_conv, tower_conv1_2, tower_pool], 3)
    return net


def reduction_b(net):
    tower_conv = tf.contrib.slim.conv2d(net, 256, 1, scope='Conv2d_0a_1x1')
    tower_conv_1 = tf.contrib.slim.conv2d(tower_conv, 384, 3, stride=2,padding='VALID', scope='Conv2d_1a_3x3')
    tower_conv1 = tf.contrib.slim.conv2d(net, 256, 1, scope='Conv2d_0a_1x1')
    tower_conv1_1 = tf.contrib.slim.conv2d(tower_conv1, 256, 3, stride=2,padding='VALID', scope='Conv2d_1a_3x3')

    tower_conv2 = tf.contrib.slim.conv2d(net, 256, 1, scope='Conv2d_0a_1x1')
    tower_conv2_1 = tf.contrib.slim.conv2d(tower_conv2, 256, 3,scope='Conv2d_0b_3x3')
    tower_conv2_2 = tf.contrib.slim.conv2d(tower_conv2_1, 256, 3, stride=2,padding='VALID', scope='Conv2d_1a_3x3')

    tower_pool = tf.contrib.slim.max_pool2d(net, 3, stride=2, padding='VALID',scope='MaxPool_1a_3x3')
    net = tf.concat([tower_conv_1, tower_conv1_1,tower_conv2_2, tower_pool], 3)
    return net


def inception_resnet_v1_out(net, end_points):
    age_logits = tf.contrib.slim.fully_connected(net, 101, activation_fn=None,weights_initializer=tf.truncated_normal_initializer(stddev=0.01),weights_regularizer=tf.contrib.slim.l2_regularizer(1e-5),scope='logits/age', reuse=False)
    gender_logits = tf.contrib.slim.fully_connected(net, 2, activation_fn=None,weights_initializer=tf.truncated_normal_initializer(stddev=0.01),weights_regularizer=tf.contrib.slim.l2_regularizer(1e-5),scope='logits/gender', reuse=False)
    return age_logits, gender_logits, end_points


def inception_resnet_v1(inputs, is_training=True,
                        dropout_keep_prob=0.8,
                        bottleneck_layer_size=128,
                        reuse=None,
                        scope='InceptionResnetV1'):
    """Creates the Inception Resnet V1 model.
    Args:
      inputs: a 4-D tensor of size [batch_size, height, width, 3].
      num_classes: number of predicted classes.
      is_training: whether is training or not.
      dropout_keep_prob: float, the fraction to keep before final layer.
      reuse: whether or not the network and its variables should be reused. To be
        able to reuse 'scope' must be given.
      scope: Optional variable_scope.
    Returns:
      logits: the logits outputs of the model.
      end_points: the set of end_points from the inception model.
    """
    end_points = {}

                # 149 x 149 x 32
    net = tf.contrib.slim.conv2d(inputs, 32, 3, stride=2, padding='VALID',scope='Conv2d_1a_3x3')
    end_points['Conv2d_1a_3x3'] = net
    # 147 x 147 x 32
    net = tf.contrib.slim.conv2d(net, 32, 3, padding='VALID',scope='Conv2d_2a_3x3')
    end_points['Conv2d_2a_3x3'] = net
    # 147 x 147 x 64
    net = tf.contrib.slim.conv2d(net, 64, 3, scope='Conv2d_2b_3x3')
    end_points['Conv2d_2b_3x3'] = net
    # 73 x 73 x 64
    net = tf.contrib.slim.max_pool2d(net, 3, stride=2, padding='VALID',scope='MaxPool_3a_3x3')
    end_points['MaxPool_3a_3x3'] = net
    # 73 x 73 x 80
    net = tf.contrib.slim.conv2d(net, 80, 1, padding='VALID',scope='Conv2d_3b_1x1')
    end_points['Conv2d_3b_1x1'] = net
    # 71 x 71 x 192
    net = tf.contrib.slim.conv2d(net, 192, 3, padding='VALID',scope='Conv2d_4a_3x3')
    end_points['Conv2d_4a_3x3'] = net
    # 35 x 35 x 256
    net = tf.contrib.slim.conv2d(net, 256, 3, stride=2, padding='VALID',scope='Conv2d_4b_3x3')
    end_points['Conv2d_4b_3x3'] = net

    # 5 x Inception-resnet-A
    for _ in range(5):
        net = block35()

    net = reduction_a(net, 192, 192, 256, 384)

    for _ in range(10):
        net = block17()
    # Reduction-B
    
    net = reduction_b(net)

    # 5 x Inception-Resnet-C
    for _ in range(8):
        net = block35()

    net = block8(net, activation_fn=None)
    net = tf.contrib.slim.avg_pool2d(net, net.get_shape()[1:3], padding='VALID',scope='AvgPool_1a_8x8')
    net = tf.contrib.slim.flatten(net)

    net = tf.contrib.slim.dropout(net, dropout_keep_prob, is_training=is_training,scope='Dropout')


    net = tf.contrib.slim.fully_connected(net, bottleneck_layer_size, activation_fn=None,scope='Bottleneck', reuse=False)

    return net, end_points

if __name__ == "__main__":
    lr = 1e-3
    decay_rate = 1e-5
    epochs = 6
    batch_size = 128
    keep_prob = 0.8
    inception_resnet_v1()
    inception_resnet_v1_out(net, end_points)
