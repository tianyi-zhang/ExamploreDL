import numpy as np
import tensorflow as tf
import test1

def cnn_scrope(input_value):
	with tf.name_scope("cnn"):
		net = test1.My_network()
		cnn = net.cnn_net(input_value)
		return cnn

if __name__ == "__main__":
	cnn_scrope(np.array([[0, 1, 1],[1, 1, 1],[1, 2, 1]]))