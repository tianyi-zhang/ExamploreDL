import inspect
import tensorflow as tf


class LstmModel:
    """
    Lstm训练的模型
    0.96.01: 配置中增加input_dim字段 如果input_dim为1，则执行独热编码输入下的LstmModel；否则执行非独热编码输入下的LstmModel
    """
    def __init__(self, input_data, output_data, config, learning_rate, is_training=False, is_valid=False):

        cell = tf.contrib.rnn.BasicLSTMCell(config.rnn_hidden_size, state_is_tuple=True)
        cell = tf.contrib.rnn.MultiRNNCell([cell] * config.num_layers, state_is_tuple=True)

        
        # 3.获取LSTM计算的输出
        outputs, last_state = tf.nn.dynamic_rnn(cell, inputs_sum, initial_state=initial_state)
        output = tf.reshape(outputs, [-1, config.rnn_hidden_size])
# 5.1.训练状态，将logits与期望输出值作比较 得到误差函数 并设计优化器使误差函数最小化
        labels = tf.one_hot(tf.reshape(output_data, [-1]), depth=config.note_dict_size + 1)
        loss = tf.nn.softmax_cross_entropy_with_logits(labels=labels, logits=logits)
        total_loss = tf.reduce_mean(loss)
        train_op = tf.train.AdamOptimizer(learning_rate).minimize(total_loss)

if __name__ == "__name__":
    LstmModel()