import tensorflow as tf
import numpy as np

class TextRNN:
	def __init__(self, filter_sizes,num_filters,num_classes, learning_rate, batch_size, decay_steps, decay_rate, sequence_length, vocab_size, embed_size, initializer=tf.random_normal_initializer(stddev=0.1), multi_label_flag=False, clip_gradients=5.0, decay_rate_big=0.50):
		self.num_classes = num_classes
		self.batch_size = batch_size
		self.sequence_length=sequence_length
		self.vocab_size=vocab_size
		self.embed_size=embed_size
		self.hidden_size=embed_size
		self.is_training=is_training
		self.learning_rate=learning_rate
		self.initializer=initializer
		self.num_sampled=20

		# add placeholder (X,label)
		self.input_x = tf.placeholder(tf.int32, [None, self.sequence_length], name="input_x")  # X
		self.input_y = tf.placeholder(tf.int32,[None], name="input_y")  # y [None,num_classes]
		self.dropout_keep_prob=tf.placeholder(tf.float32,name="dropout_keep_prob")

		self.global_step = tf.Variable(0, trainable=False, name="Global_Step")
		self.epoch_step=tf.Variable(0,trainable=False,name="Epoch_Step")

		self.instantiate_weights()
		self.logits = self.inference() #[None, self.label_size]. main computation graph is here.
		self.loss_val = self.loss() 
		self.predictions = tf.argmax(self.logits, axis=1, name="predictions")  # shape:[None,]
		correct_prediction = tf.equal(tf.cast(self.predictions,tf.int32), self.input_y) #tf.argmax(self.logits, 1)-->[batch_size]
		self.accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32), name="Accuracy")

	def loss(self,l2_lambda=0.0001): #0.0001#this loss function is for multi-label classification
		#input: `logits` and `labels` must have the same shape `[batch_size, num_classes]`
		#output: A 1-D `Tensor` of length `batch_size` of the same type as `logits` with the softmax cross entropy loss.
		#input_y:shape=(?, 1999); logits:shape=(?, 1999)
		# let `x = logits`, `z = labels`.  The logistic loss is:z * -log(sigmoid(x)) + (1 - z) * -log(1 - sigmoid(x))
		v = tf.nn.sparse_softmax_cross_entropy_with_logits(labels=self.input_y, logits=self.logits)#losses=tf.nn.softmax_cross_entropy_with_logits(labels=self.input__y,logits=self.logits)
		#losses=-self.input_y_multilabel*tf.log(self.logits)-(1-self.input_y_multilabel)*tf.log(1-self.logits)
		tf.nn.l2_loss(v)
		return loss

	def inference(self):
		self.embedded_words = tf.nn.embedding_lookup(self.Embedding,self.input_x) #shape:[None,sentence_length,embed_size]
		#2. Bi-lstm layer
		# define lstm cess:get lstm cell output
		lstm_fw_cell=tf.contrib.rnn.BasicLSTMCell(self.hidden_size) #forward direction cell
		lstm_bw_cell=tf.contrib.rnn.BasicLSTMCell(self.hidden_size) #backward direction cell
		lstm_fw_cell=tf.contrib.rnn.DropoutWrapper(lstm_fw_cell,output_keep_prob=self.dropout_keep_prob)
		#lstm_bw_cell=tf.contrib.rnn.DropoutWrapper(lstm_bw_cell,output_keep_prob=self.dropout_keep_prob)
		# bidirectional_dynamic_rnn: input: [batch_size, max_time, input_size]
		#						    output: A tuple (outputs, output_states)
		#								    where:outputs: A tuple (output_fw, output_bw) containing the forward and the backward rnn output `Tensor`.
		outputs,_=tf.nn.bidirectional_dynamic_rnn(lstm_fw_cell,lstm_bw_cell,self.embedded_words,dtype=tf.float32) #[batch_size,sequence_length,hidden_size] #creates a dynamic bidirectional recurrent neural network
		print("outputs:===>",outputs) #outputs:(<tf.Tensor 'bidirectional_rnn/fw/fw/transpose:0' shape=(?, 5, 100) dtype=float32>, <tf.Tensor 'ReverseV2:0' shape=(?, 5, 100) dtype=float32>))
		#3. concat output
		output_rnn=tf.concat(outputs,axis=2) 
		rnn_cell=tf.contrib.rnn.BasicLSTMCell(self.hidden_size*2)
		rnn_cell=tf.contrib.rnn.DropoutWrapper(rnn_cell,output_keep_prob=self.dropout_keep_prob)
		final_state_c_h=tf.nn.dynamic_rnn(rnn_cell,output_rnn,dtype=tf.float32)
		final_state=final_state_c_h[1] ##[batch_size,hidden_size*2] #TODO
		print("output_rnn_last:", self.output_rnn_last) # <tf.Tensor 'strided_slice:0' shape=(?, 200) dtype=float32>
		#4. logits(use linear layer)
		logits = tf.layers.dense(self.output_rnn_last, self.W_projection) # [batch_size,num_classes]
		logits = tf.nn.softmax(logits)
		return logits

if __name__ == "__main__":
	learning_rate = 0.0003
	batch_size = 64
	num_epochs = 10
	TextRNN()