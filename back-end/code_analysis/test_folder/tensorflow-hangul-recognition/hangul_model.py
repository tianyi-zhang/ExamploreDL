def main(label_file, tfrecords_dir, model_output_dir, num_train_epochs):
    """Perform graph definition and model training.
    Here we will first create our input pipeline for reading in TFRecords
    files and producing random batches of images and labels.
    Next, a convolutional neural network is defined, and training is performed.
    After training, the model is exported to be used in applications.
    """
    global num_classes
    labels = io.open(label_file, 'r', encoding='utf-8').read().splitlines()
    num_classes = len(labels)

    # Define names so we can later reference specific nodes for when we use
    # the model for inference later.
    input_node_name = 'input'
    keep_prob_node_name = 'keep_prob'
    output_node_name = 'output'


    # Create the model!

    # Placeholder to feed in image data.
    x = tf.placeholder(tf.float32, [None, IMAGE_WIDTH*IMAGE_HEIGHT],
                       name=input_node_name)
    # Placeholder to feed in label data. Labels are represented as one_hot
    # vectors.
    y_ = tf.placeholder(tf.float32, [None, num_classes])

    # Reshape the image back into two dimensions so we can perform convolution.
    x_image = tf.reshape(x, [-1, IMAGE_WIDTH, IMAGE_HEIGHT, 1])

    # First convolutional layer. 32 feature maps.
    W_conv1 = weight_variable([5, 5, 1, 32])
    b_conv1 = bias_variable([32])
    x_conv1 = tf.nn.conv2d(x_image, W_conv1, strides=[1, 1, 1, 1],
                           padding='SAME')
    h_conv1 = tf.nn.relu(x_conv1 + b_conv1)

    # Max-pooling.
    h_pool1 = tf.nn.max_pool(h_conv1, ksize=[1, 2, 2, 1],
                             strides=[1, 2, 2, 1], padding='SAME')

    # Second convolutional layer. 64 feature maps.
    W_conv2 = weight_variable([5, 5, 32, 64])
    b_conv2 = bias_variable([64])
    x_conv2 = tf.nn.conv2d(h_pool1, W_conv2, strides=[1, 1, 1, 1],
                           padding='SAME')
    h_conv2 = tf.nn.relu(x_conv2 + b_conv2)

    h_pool2 = tf.nn.max_pool(h_conv2, ksize=[1, 2, 2, 1],
                             strides=[1, 2, 2, 1], padding='SAME')

    # Third convolutional layer. 128 feature maps.
    W_conv3 = weight_variable([3, 3, 64, 128])
    b_conv3 = bias_variable([128])
    x_conv3 = tf.nn.conv2d(h_pool2, W_conv3, strides=[1, 1, 1, 1],
                           padding='SAME')
    h_conv3 = tf.nn.relu(x_conv3 + b_conv3)

    h_pool3 = tf.nn.max_pool(h_conv3, ksize=[1, 2, 2, 1],
                             strides=[1, 2, 2, 1], padding='SAME')

    # Fully connected layer. Here we choose to have 1024 neurons in this layer.
    h_pool_flat = tf.reshape(h_pool3, [-1, 8*8*128])
    W_fc1 = weight_variable([8*8*128, 1024])
    b_fc1 = bias_variable([1024])
    h_fc1 = tf.nn.relu(tf.matmul(h_pool_flat, W_fc1) + b_fc1)

    # Dropout layer. This helps fight overfitting.
    keep_prob = tf.placeholder(tf.float32, name=keep_prob_node_name)
    h_fc1_drop = tf.nn.dropout(h_fc1, rate=1-keep_prob)

    # Classification layer.
    W_fc2 = weight_variable([1024, num_classes])
    b_fc2 = bias_variable([num_classes])
    y = tf.matmul(h_fc1_drop, W_fc2) + b_fc2

    # This isn't used for training, but for when using the saved model.
    tf.nn.softmax(y, name=output_node_name)

    # Define our loss.
    cross_entropy = tf.reduce_mean(
        tf.nn.softmax_cross_entropy_with_logits_v2(
            labels=tf.stop_gradient(y_),
            logits=y
        )
    )

    # Define our optimizer for minimizing our loss. Here we choose a learning
    # rate of 0.0001 with AdamOptimizer. This utilizes someting
    # called the Adam algorithm, and utilizes adaptive learning rates and
    # momentum to get past saddle points.
    train_step = tf.train.AdamOptimizer(0.0001)
main()