def vgg_19(inputs,
          num_classes=1000,
          is_training=True,
          dropout_keep_prob=0.5,
          spatial_squeeze=True,
          reuse=None,
          scope='vgg_a',
          fc_conv_padding='VALID',
          global_pool=False):
  """Oxford Net VGG 11-Layers version A Example.
  Note: All the fully_connected layers have been transformed to conv2d layers.
        To use in classification mode, resize input to 224x224.
  Args:
    inputs: a tensor of size [batch_size, height, width, channels].
    num_classes: number of predicted classes. If 0 or None, the logits layer is
      omitted and the input features to the logits layer are returned instead.
    is_training: whether or not the model is being trained.
    dropout_keep_prob: the probability that activations are kept in the dropout
      layers during training.
    spatial_squeeze: whether or not should squeeze the spatial dimensions of the
      outputs. Useful to remove unnecessary dimensions for classification.
    reuse: whether or not the network and its variables should be reused. To be
      able to reuse 'scope' must be given.
    scope: Optional scope for the variables.
    fc_conv_padding: the type of padding to use for the fully connected layer
      that is implemented as a convolutional layer. Use 'SAME' padding if you
      are applying the network in a fully convolutional manner and want to
      get a prediction map downsampled by a factor of 32 as an output.
      Otherwise, the output prediction map will be (input / 32) - 6 in case of
      'VALID' padding.
    global_pool: Optional boolean flag. If True, the input to the classification
      layer is avgpooled to size 1x1, for any input size. (This is not part
      of the original VGG architecture.)
  Returns:
    net: the output of the logits layer (if num_classes is a non-zero integer),
      or the input to the logits layer (if num_classes is 0 or None).
    end_points: a dict of tensors with intermediate activations.
  """
 
  net = tf.contrib.slim.conv2d(inputs, 64, [3, 3], scope='conv1')
  net = tf.contrib.slim.conv2d(inputs, 64, [3, 3], scope='conv1')
  net = tf.contrib.slim.max_pool2d(net, [2, 2], scope='pool1')
  net = tf.contrib.slim.conv2d(net, 128, [3, 3], scope='conv2')
  net = tf.contrib.slim.conv2d(net, 128, [3, 3], scope='conv2')
  net = tf.contrib.slim.max_pool2d(net, [2, 2], scope='pool2')
  net = tf.contrib.slim.conv2d(net, 256, [3, 3], scope='conv3')
  net = tf.contrib.slim.conv2d(net, 256, [3, 3], scope='conv3')
  net = tf.contrib.slim.conv2d(net, 256, [3, 3], scope='conv3')
  net = tf.contrib.slim.conv2d(net, 256, [3, 3], scope='conv3')
  net = tf.contrib.slim.max_pool2d(net, [2, 2], scope='pool3')
  net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv4')
  net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv4')
  net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv4')
  net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv4')
  net = tf.contrib.slim.max_pool2d(net, [2, 2], scope='pool4')
  net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv5')
  net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv5')
  net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv5')
  net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv5')
  net = tf.contrib.slim.max_pool2d(net, [2, 2], scope='pool5')

  # Use conv2d instead of fully_connected layers.
  net = tf.contrib.slim.conv2d(net, 4096, [7, 7], padding='VALID', scope='fc6')
  net = tf.contrib.slim.dropout(net, 0.5, is_training=is_training,
                     scope='dropout6')
  net = tf.contrib.slim.conv2d(net, 4096, [1, 1], scope='fc7')
  # Convert end_points_collection into a end_point dict.
  end_points = tf.contrib.slim.utils.convert_collection_to_dict(end_points_collection)
      
  net = tf.reduce_mean(input_tensor=net, axis=[1, 2], keepdims=True, name='global_pool')
  end_points['global_pool'] = net
  
  net = tf.contrib.slim.dropout(net, 0.5, is_training=is_training,scope='dropout7')
  net = tf.contrib.slim.conv2d(net, 1000, [1, 1],
                          activation_fn=None,
                          normalizer_fn=None,
                          scope='fc8')
  net = tf.squeeze(net, [1, 2], name='fc8/squeezed')
  end_points[sc.name + '/fc8'] = net
  return net, end_points

if __name__ == '__main__':
  vgg_19()
  width = 224
  height = 224
  num_classes=1000
  batch_size = 5
  dropout_keep_prob=0.5