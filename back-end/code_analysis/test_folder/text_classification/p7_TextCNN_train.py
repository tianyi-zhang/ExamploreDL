import tensorflow as tf
import numpy as np

class TextCNN:
	def __init__(self, filter_sizes,num_filters,num_classes, learning_rate, batch_size, decay_steps, decay_rate, sequence_length, vocab_size, embed_size, initializer=tf.random_normal_initializer(stddev=0.1), multi_label_flag=False, clip_gradients=5.0, decay_rate_big=0.50):
		self.num_classes = num_classes
		self.batch_size = batch_size
		self.sequence_length=sequence_length
		self.vocab_size=vocab_size
		self.embed_size=embed_size
		self.learning_rate = tf.Variable(learning_rate, trainable=False, name="learning_rate")
		self.learning_rate_decay_half_op = tf.assign(self.learning_rate, self.learning_rate * decay_rate_big)
		self.filter_sizes=filter_sizes # it is a list of int. e.g. [3,4,5]
		self.num_filters=num_filters
		self.initializer=initializer
		self.num_filters_total=self.num_filters * len(filter_sizes) #how many filters totally.
		self.multi_label_flag=multi_label_flag
		self.clip_gradients = clip_gradients
		self.is_training_flag = tf.placeholder(tf.bool, name="is_training_flag")
		self.instantiate_weights()
		self.logits = self.inference() #[None, self.label_size]. main computation graph is here.
		self.possibility=tf.nn.sigmoid(self.logits)
		self.loss_val = self.loss_multilabel()
		self.predictions = tf.argmax(self.logits, 1, name="predictions")  # shape:[None,]
		print("self.predictions:", self.predictions)
		correct_prediction = tf.equal(tf.cast(self.predictions,tf.int32), self.input_y) 
		self.accuracy =tf.reduce_mean(tf.cast(correct_prediction, tf.float32), name="Accuracy")

	def loss_multilabel(self,l2_lambda=0.0001): #0.0001#this loss function is for multi-label classification
		#input: `logits` and `labels` must have the same shape `[batch_size, num_classes]`
		#output: A 1-D `Tensor` of length `batch_size` of the same type as `logits` with the softmax cross entropy loss.
		#input_y:shape=(?, 1999); logits:shape=(?, 1999)
		# let `x = logits`, `z = labels`.  The logistic loss is:z * -log(sigmoid(x)) + (1 - z) * -log(1 - sigmoid(x))
		losses = tf.nn.sigmoid_cross_entropy_with_logits(labels=self.input_y_multilabel, logits=self.logits);#losses=tf.nn.softmax_cross_entropy_with_logits(labels=self.input__y,logits=self.logits)
		#losses=-self.input_y_multilabel*tf.log(self.logits)-(1-self.input_y_multilabel)*tf.log(1-self.logits)
		print("sigmoid_cross_entropy_with_logits.losses:",losses) #shape=(?, 1999).
		losses=tf.reduce_sum(losses,axis=1) #shape=(?,). loss for all data in the batch
		loss=tf.reduce_mean(losses)		 #shape=().   average loss in the batch
		l2_losses = tf.add_n([tf.nn.l2_loss(v) for v in tf.trainable_variables() if 'bias' not in v.name]) * l2_lambda
		loss=loss+l2_losses
		return loss

	def inference(self):
		h=self.cnn_single_layer()
		logits = tf.matmul(h,self.W_projection) + self.b_projection  
		return logits

	def cnn_single_layer(self):
		for i in range(3):
			filter = tf.get_variable("filter-%s" % filter_size,[filter_size, self.embed_size, 1, self.num_filters],initializer=self.initializer)
			conv = tf.nn.conv2d(self.sentence_embeddings_expanded, filter, strides=[1, 1, 1, 1],padding="SAME",name="conv")  # shape:[batch_size,sequence_length - filter_size + 1,1,num_filters]
			conv = tf.contrib.layers.batch_norm(conv, is_training=self.is_training_flag, scope='cnn1')
			print(i, "conv1:", conv)
			b = tf.get_variable("b-%s" % filter_size, [self.num_filters])  # ADD 2017-06-09
			h = tf.nn.relu(tf.nn.bias_add(conv, b),"relu")  # shape:[batch_size,sequence_length,1,num_filters]. tf.nn.bias_add:adds `bias` to `value`

			# 2) CNN->BN->relu
			h = tf.reshape(h, [-1, self.sequence_length, self.num_filters,1])  # shape:[batch_size,sequence_length,num_filters,1]
			# Layer2:CONV-RELU
			filter2 = tf.get_variable("filter2-%s" % filter_size,[filter_size, self.num_filters, 1, self.num_filters],initializer=self.initializer)
			conv2 = tf.nn.conv2d(h, filter2, strides=[1, 1, 1, 1], padding="SAME",name="conv2")  # shape:[batch_size,sequence_length-filter_size*2+2,1,num_filters]
			conv2 = tf.contrib.layers.batch_norm(conv2, is_training=self.is_training_flag, scope='cnn2')
			print(i, "conv2:", conv2)
			b2 = tf.get_variable("b2-%s" % filter_size, [self.num_filters])  # ADD 2017-06-09
			out = tf.nn.bias_add(conv2, b2)
			h = tf.nn.relu(out,"relu2")  # shape:[batch_size,sequence_length,1,num_filters]. tf.nn.bias_add:adds `bias` to `value`

			# 3. Max-pooling
			pooling = tf.nn.max_pool(h, ksize=[1,self.sequence_length, 1, 1],strides=[1, 1, 1, 1], padding='VALID', name="pool")
			pooling_max = tf.squeeze(pooling)
			# pooling_avg=tf.squeeze(tf.reduce_mean(h,axis=1)) #[batch_size,num_filters]
			print(i, "pooling:", pooling_max)
			# pooling=tf.concat([pooling_max,pooling_avg],axis=1) #[batch_size,num_filters*2]
			pooled_outputs.append(pooling_max)
		self.h_drop = tf.nn.dropout(self.h_pool_flat, keep_prob=0.8)  # [None,num_filters_total]
		return h

if __name__ == "__main__":
	learning_rate = 0.0003
	batch_size = 64
	num_epochs = 10
	TextCNN()