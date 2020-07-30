from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow.compat.v1 as tf


def cifarnet(images, num_classes=10, is_training=False,
             dropout_keep_prob=0.5,
             prediction_fn=tf.contrib.slim.softmax,
             scope='CifarNet'):
  """Creates a variant of the CifarNet model.
  Note that since the output is a set of 'logits', the values fall in the
  interval of (-infinity, infinity). Consequently, to convert the outputs to a
  probability distribution over the characters, one will need to convert them
  using the softmax function:
        logits = cifarnet.cifarnet(images, is_training=False)
        probabilities = tf.nn.softmax(logits)
        predictions = tf.argmax(logits, 1)
  Args:
    images: A batch of `Tensors` of size [batch_size, height, width, channels].
    num_classes: the number of classes in the dataset. If 0 or None, the logits
      layer is omitted and the input features to the logits layer are returned
      instead.
    is_training: specifies whether or not we're currently training the model.
      This variable will determine the behaviour of the dropout layer.
    dropout_keep_prob: the percentage of activation values that are retained.
    prediction_fn: a function to get predictions out of logits.
    scope: Optional variable_scope.
  Returns:
    net: a 2D Tensor with the logits (pre-softmax activations) if num_classes
      is a non-zero integer, or the input to the logits layer if num_classes
      is 0 or None.
    end_points: a dictionary from components of the network to the corresponding
      activation.
  """
  end_points = {}
  
  net = tf.contrib.slim.conv2d(images, 64, [5, 5], scope='conv1')
  end_points['conv1'] = net
  net = tf.contrib.slim.max_pool2d(net, [2, 2], 2, scope='pool1')
  end_points['pool1'] = net
  net = tf.nn.lrn(net, 4, bias=1.0, alpha=0.001/9.0, beta=0.75, name='norm1')
  net = tf.contrib.slim.conv2d(net, 64, [5, 5], scope='conv2')
  end_points['conv2'] = net
  net = tf.nn.lrn(net, 4, bias=1.0, alpha=0.001/9.0, beta=0.75, name='norm2')
  net = tf.contrib.slim.max_pool2d(net, [2, 2], 2, scope='pool2')
  end_points['pool2'] = net
  net = tf.contrib.slim.flatten(net)
  end_points['Flatten'] = net
  net = tf.contrib.slim.fully_connected(net, 384, scope='fc3')
  end_points['fc3'] = net
  net = tf.contrib.slim.dropout(net, 0.5, is_training=is_training,
                     scope='dropout3')
  net = tf.contrib.slim.fully_connected(net, 192, scope='fc4')
  end_points['fc4'] = net

  logits = tf.contrib.slim.fully_connected(
      net,
      10,
      biases_initializer=tf.zeros_initializer(),
      weights_initializer=trunc_normal(1 / 192.0),
      weights_regularizer=None,
      activation_fn=None,
      scope='logits')
  end_points['Predictions'] = tf.contrib.slim.softmax(logits, scope='Predictions')

  return logits, end_points

if __name__ == '__main__':
  width = 32
  height = 32
  num_classes = 10
  dropout_keep_prob=0.5
  cifarnet()