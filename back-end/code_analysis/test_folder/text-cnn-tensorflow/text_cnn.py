
from hbconfig import Config
import tensorflow as tf



class Graph:

    def __init__(self, mode, dtype=tf.float32):
        self.build()

    def build(self, input_data):
        embedding_input = self.build_embed(input_data)
        conv_output = self.build_conv_layers(embedding_input)
        self.build_fully_connected_layers(conv_output)
        tf.losses.softmax_cross_entropy()

    def build_embed(self, input_data):
        tf.nn.embedding_lookup(embedding, input_data)

    def build_conv_layers(self, embedding_input):
        pooled_outputs = self._build_conv_maxpool(embedding_input)
        h_dropout = tf.layers.dropout(flat_pooled, 0.5)

    def _build_conv_maxpool(self, embedding_input):
        pooled_outputs = []

        conv = tf.layers.conv2d(embedding_input,256,(2, 300), activation=tf.nn.relu)
        pool = tf.layers.max_pooling2d(conv)
        conv = tf.layers.conv2d(embedding_input,256,(3, 300), activation=tf.nn.relu)
        pool = tf.layers.max_pooling2d(conv)
        conv = tf.layers.conv2d(embedding_input,256,(4, 300), activation=tf.nn.relu)
        pool = tf.layers.max_pooling2d(conv)
        conv = tf.layers.conv2d(embedding_input,256,(5, 300), activation=tf.nn.relu)
        pool = tf.layers.max_pooling2d(conv)

        return pooled_outputs

    def build_fully_connected_layers(self, conv_output):
        tf.layers.dense(conv_output,5)

if __name__ == "__main__":
    batch_size: 64
    learning_rate: 0.00005
    keep_prob: 0.5
    Graph()
