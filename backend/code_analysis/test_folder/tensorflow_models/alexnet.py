from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow.compat.v1 as tf

def alexnet_v2(inputs,
               num_classes=1000,
               is_training=True,
               dropout_keep_prob=0.5,
               spatial_squeeze=True,
               scope='alexnet_v2',
               global_pool=False):
  """AlexNet version 2.
  Described in: http://arxiv.org/pdf/1404.5997v2.pdf
  Parameters from:
  github.com/akrizhevsky/cuda-convnet2/blob/master/layers/
  layers-imagenet-1gpu.cfg
  Note: All the fully_connected layers have been transformed to conv2d layers.
        To use in classification mode, resize input to 224x224 or set
        global_pool=True. To use in fully convolutional mode, set
        spatial_squeeze to false.
        The LRN layers have been removed and change the initializers from
        random_normal_initializer to xavier_initializer.
  Args:
    inputs: a tensor of size [batch_size, height, width, channels].
    num_classes: the number of predicted classes. If 0 or None, the logits layer
    is omitted and the input features to the logits layer are returned instead.
    is_training: whether or not the model is being trained.
    dropout_keep_prob: the probability that activations are kept in the dropout
      layers during training.
    spatial_squeeze: whether or not should squeeze the spatial dimensions of the
      logits. Useful to remove unnecessary dimensions for classification.
    scope: Optional scope for the variables.
    global_pool: Optional boolean flag. If True, the input to the classification
      layer is avgpooled to size 1x1, for any input size. (This is not part
      of the original AlexNet.)
  Returns:
    net: the output of the logits layer (if num_classes is a non-zero integer),
      or the non-dropped-out input to the logits layer (if num_classes is 0
      or None).
    end_points: a dict of tensors with intermediate activations.
  """
  
  net = tf.contrib.slim.conv2d(inputs, 64, [11, 11], 4, padding='VALID',
                  scope='conv1')
  net = tf.contrib.slim.max_pool2d(net, [3, 3], 2, scope='pool1')
  net = tf.contrib.slim.conv2d(net, 192, [5, 5], scope='conv2')
  net = tf.contrib.slim.max_pool2d(net, [3, 3], 2, scope='pool2')
  net = tf.contrib.slim.conv2d(net, 384, [3, 3], scope='conv3')
  net = tf.contrib.slim.conv2d(net, 384, [3, 3], scope='conv4')
  net = tf.contrib.slim.conv2d(net, 256, [3, 3], scope='conv5')
  net = tf.contrib.slim.max_pool2d(net, [3, 3], 2, scope='pool5')

  # Use conv2d instead of fully_connected layers.
   
  net = tf.contrib.slim.conv2d(net, 4096, [5, 5], padding='VALID',
                    scope='fc6')
  net = tf.contrib.slim.dropout(net, 0.5, is_training=is_training,
                     scope='dropout6')
  net = tf.contrib.slim.conv2d(net, 4096, [1, 1], scope='fc7')
      # Convert end_points_collection into a end_point dict.

  net = tf.contrib.slim.dropout(net, 0.5, is_training=is_training,
                   scope='dropout7')
  net = tf.contrib.slim.conv2d(net,num_classes, [1, 1],activation_fn=None,normalizer_fn=None,biases_initializer=tf.zeros_initializer(),scope='fc8')
  
        
  return net, end_points

batch_size = 5
height, width = 224, 224
num_classes = 1000
alexnet_v2()
dropout_keep_prob=0.5