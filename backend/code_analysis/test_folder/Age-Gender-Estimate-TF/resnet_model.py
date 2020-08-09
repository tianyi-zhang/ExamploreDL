# Copyright 2017 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
"""Contains definitions for the preactivation form of Residual Networks.

Residual networks (ResNets) were originally proposed in:
[1] Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun
    Deep Residual Learning for Image Recognition. arXiv:1512.03385

The full preactivation 'v2' ResNet variant implemented in this module was
introduced by:
[2] Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun
    Identity Mappings in Deep Residual Networks. arXiv: 1603.05027

The key difference of the full preactivation 'v2' variant compared to the
'v1' variant in [1] is the use of batch normalization before every weight layer
rather than after.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf

def cifar10_resnet_v2_generator(resnet_size, num_classes, data_format=None):
    """Generator for CIFAR-10 ResNet v2 models.

    Args:
      resnet_size: A single integer for the size of the ResNet model.
      num_classes: The number of possible classes for image classification.
      data_format: The input format ('channels_last', 'channels_first', or None).
        If set to None, the format is dependent on whether a GPU is available.

    Returns:
      The model function that takes in `inputs` and `is_training` and
      returns the output tensor of the ResNet model.

    Raises:
      ValueError: If `resnet_size` is invalid.
    """
        

    tf.layers.conv2d(inputs=inputs, filters=16, kernel_size=3, strides=1,padding='SAME')

    inputs = batch_norm_relu(inputs, is_training, data_format)

    tf.layers.conv2d(inputs=inputs, filters=16, kernel_size=3, strides=1,padding='SAME')

    tf.layers.conv2d(inputs=inputs, filters=16, kernel_size=3, strides=1,padding='SAME')

    inputs = batch_norm_relu(inputs, is_training, data_format)
    tf.layers.conv2d(inputs=inputs, filters=16, kernel_size=3, strides=1,padding='SAME')

    inputs = batch_norm_relu(inputs, is_training, data_format)

    tf.layers.conv2d(inputs=inputs, filters=32, kernel_size=3, strides=2,padding='VALID')

    tf.layers.conv2d(inputs=inputs, filters=32, kernel_size=3, strides=2,padding='VALID')

    inputs = batch_norm_relu(inputs, is_training, data_format)
    tf.layers.conv2d(inputs=inputs, filters=32, kernel_size=3, strides=1,padding='SAME')
    inputs = batch_norm_relu(inputs, is_training, data_format)

    tf.layers.conv2d(inputs=inputs, filters=64, kernel_size=3, strides=2,padding='VALID')

    tf.layers.conv2d(inputs=inputs, filters=64, kernel_size=3, strides=2,padding='VALID')

    inputs = batch_norm_relu(inputs, is_training, data_format)
    tf.layers.conv2d(inputs=inputs, filters=64, kernel_size=3, strides=1,padding='SAME')

    inputs = batch_norm_relu(inputs, is_training, data_format)

    tf.layers.conv2d(inputs=inputs, filters=128, kernel_size=3, strides=2,padding='VALID')

    tf.layers.conv2d(inputs=inputs, filters=128, kernel_size=3, strides=2,padding='VALID')

    inputs = batch_norm_relu(inputs, is_training, data_format)
    tf.layers.conv2d(inputs=inputs, filters=128, kernel_size=3, strides=1,padding='SAME')

    inputs = batch_norm_relu(inputs, is_training, data_format)

    tf.layers.conv2d(inputs=inputs, filters=256, kernel_size=3, strides=2,padding='VALID')

    tf.layers.conv2d(inputs=inputs, filters=256, kernel_size=3, strides=2,padding='VALID')

    inputs = batch_norm_relu(inputs, is_training, data_format)
    tf.layers.conv2d(inputs=inputs, filters=256, kernel_size=3, strides=1,padding='SAME')


    inputs = batch_norm_relu(inputs, is_training, data_format)

    tf.layers.conv2d(inputs=inputs, filters=512, kernel_size=3, strides=2,padding='VALID')

    tf.layers.conv2d(inputs=inputs, filters=512, kernel_size=3, strides=2,padding='VALID')

    inputs = batch_norm_relu(inputs, is_training, data_format)
    tf.layers.conv2d(inputs=inputs, filters=512, kernel_size=3, strides=1,padding='SAME')

    inputs = batch_norm_relu(inputs, is_training, data_format)
    inputs = tf.layers.average_pooling2d(inputs=inputs, pool_size=8, strides=1, padding='VALID',)
    inputs = tf.identity(inputs, 'final_avg_pool')
    inputs = tf.reshape(inputs, [-1, 64])
    inputs = tf.layers.dense(inputs=inputs, units=num_classes)
    inputs = tf.identity(inputs, 'final_dense')
    return inputs

if __name__ == "__main__":
    lr = 1e-3
    decay_rate = 1e-5
    epochs = 6
    batch_size = 128
    keep_prob = 0.8
    cifar10_resnet_v2_generator()