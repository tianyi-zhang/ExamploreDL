import tensorflow as tf
import numpy as np


class TextCNN(object):
    """
    A CNN for text classification.
    Uses an embedding layer, followed by a convolutional, max-pooling and softmax layer.
    """
    def __init__(self, sequence_length, num_classes, vocab_size,embedding_size, filter_sizes, num_filters, l2_reg_lambda=0.0):

        # Placeholders for input, output and dropout
        self.input_x = tf.placeholder(tf.int32, [None, sequence_length], name="input_x")
        self.input_y = tf.placeholder(tf.float32, [None, num_classes], name="input_y")
        self.dropout_keep_prob = tf.placeholder(tf.float32, name="dropout_keep_prob")

        # Keeping track of l2 regularization loss (optional)
        l2_loss = tf.constant(0.0)

        # Embedding layer
        self.embedded_chars = tf.nn.embedding_lookup(self.W, self.input_x)

        # Create a convolution + maxpool layer for each filter size
        pooled_outputs = []
        for i in range(3):
            
            # Convolution Layer
            filter_shape = [filter_size, embedding_size, 1, num_filters]
            conv = tf.nn.conv2d(self.embedded_chars_expanded,W,strides=[1, 1, 1, 1],padding="VALID",name="conv")
            # Apply nonlinearity
            h = tf.nn.relu(conv, name="relu")
            # Maxpooling over the outputs
            pooled = tf.nn.max_pool(h,ksize=[1, sequence_length - filter_size + 1, 1, 1], strides=[1, 1, 1, 1],padding='VALID',name="pool")
            pooled_outputs.append(pooled)

        # Combine all the pooled features
        num_filters_total = num_filters * len(filter_sizes)
        self.h_pool = tf.concat(pooled_outputs, 3)
        self.h_pool_flat = tf.reshape(self.h_pool, [-1, num_filters_total])

        # Add dropout
        self.h_drop = tf.nn.dropout(self.h_pool_flat, self.dropout_keep_prob)

        # Final (unnormalized) scores and predictions
        l2_loss = tf.nn.l2_loss(W)

        losses = tf.nn.softmax_cross_entropy_with_logits(logits=self.scores, labels=self.input_y)

if __name__ == '__main__':
    keep_prob = 0.5
    batch_size = 64
    epochs = 200
    lr = 1e-3
    TextCNN()
    tf.train.AdamOptimizer(1e-3)