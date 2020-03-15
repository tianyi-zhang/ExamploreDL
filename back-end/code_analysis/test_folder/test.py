import numpy as np
import tensorflow as tf

class My_network():

	def __init__(self):
		lr = 0.01
		batch = 128

	def cnn_cell(self, input):
		output = tf.nn.conv2d(input, 3, 2, 'SAME')
		output = tf.nn.max_pool(output, 3, 2, 'SAME')
		output = tf.nn.relu(output)
		return output

	def cnn_net(self, input):
		output = tf.nn.conv2d(input, 1, 2, 'SAME')
		output = self.cnn_cell(output)
		output = tf.nn.conv2d(input, 12, 2, 'SAME')
		output = self.cnn_cell(output)
		output = tf.nn.conv2d(output, 22, 2, 'SAME')
		return output

if __name__ == "__main__":
	net = My_network()
	cnn = net.cnn_net(np.array([[0,1,1],
	                             [1,1,1],
	                             [1,2,1]]))

