import tensorflow as tf

decay_rate = 0.0005

def vgg_16(inputs, scope='vgg_16'):
    net = tf.contrib.slim.conv2d(inputs, 64, [3, 3], scope='conv1-1')
    net = tf.contrib.slim.conv2d(inputs, 64, [3, 3], scope='conv1-2')
    net = tf.contrib.slim.max_pool2d(net, [2, 2], scope='pool1')
    net = tf.contrib.slim.conv2d(inputs, 128, [3, 3], scope='conv2-1')
    net = tf.contrib.slim.conv2d(inputs, 128, [3, 3], scope='conv2-2')
    net = tf.contrib.slim.max_pool2d(net, [2, 2], scope='pool2')
    net = tf.contrib.slim.conv2d(net, 256, [3, 3], scope='conv3-1')
    net = tf.contrib.slim.conv2d(net, 256, [3, 3], scope='conv3-2')
    net = tf.contrib.slim.conv2d(net, 256, [3, 3], scope='conv3-3')
    net = tf.contrib.slim.max_pool2d(net, [2, 2], scope='pool3')
    net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv4-1')
    net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv4-2')
    net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv4-3')
    net = tf.contrib.slim.max_pool2d(net, [2, 2], scope='pool4')
    net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv5-1')
    net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv5-2')
    net = tf.contrib.slim.conv2d(net, 512, [3, 3], scope='conv5-3')

    return net

def model(image):
    image = mean_image_subtraction(image)
    
    conv5_3 = vgg_16(image)

    rpn_conv = tf.contrib.slim.conv2d(conv5_3, 512, 3)

    lstm_output = tf.keras.layers.Bidirectional(rpn_conv, 512, 128, 512, scope_name='BiLSTM')

    bbox_pred = tf.contrib.rnn.BasicLSTMCell(lstm_output, 512, 10 * 4, scope_name="bbox_pred")
    cls_pred = tf.contrib.rnn.BasicLSTMCell(lstm_output, 512, 10 * 2, scope_name="cls_pred")

    # transpose: (1, H, W, A x d) -> (1, H, WxA, d)
    cls_pred_shape = tf.shape(cls_pred)
    cls_pred_reshape = tf.reshape(cls_pred, [cls_pred_shape[0], cls_pred_shape[1], -1, 2])

    cls_pred_reshape_shape = tf.shape(cls_pred_reshape)
    cls_prob = tf.nn.softmax(tf.reshape(cls_pred_reshape, [-1, cls_pred_reshape_shape[3]]))
    cls_prob = tf.reshape(cls_prob,[-1, cls_pred_reshape_shape[1], cls_pred_reshape_shape[2], cls_pred_reshape_shape[3]],name="cls_prob")

    return bbox_pred, cls_pred, cls_prob

model(image)