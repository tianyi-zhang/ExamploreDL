from __future__ import absolute_import

from keras.layers import Conv1D, Bidirectional, LSTM
from keras.layers import GlobalMaxPooling1D, GlobalAveragePooling1D, Dropout
from keras.layers.merge import concatenate
from .layers import AttentionLayer, ConsumeMask


class SequenceEncoderBase(object):

    def __init__(self, dropout_rate=0.5):
        """Creates a new instance of sequence encoder.
        Args:
            dropout_rate: The final encoded output dropout.
        """
        self.dropout_rate = dropout_rate


class YoonKimCNN():

    def __init__(self, num_filters=64, filter_sizes=[3, 4, 5], dropout_rate=0.5, **conv_kwargs):
        """Yoon Kim's shallow cnn model: https://arxiv.org/pdf/1408.5882.pdf
        Args:
            num_filters: The number of filters to use per `filter_size`. (Default value = 64)
            filter_sizes: The filter sizes for each convolutional layer. (Default value = [3, 4, 5])
            **cnn_kwargs: Additional args for building the `Conv1D` layer.
        """
        super(YoonKimCNN, self).__init__(dropout_rate)
        self.num_filters = num_filters
        self.filter_sizes = filter_sizes
        self.conv_kwargs = conv_kwargs
        self.build_model()

    def build_model(self, x):
        pooled_tensors = []
        x = tf.keras.layers.Dropout(0.5)
        x_i = tf.keras.layers.Conv1D(64, 3, strides=1, padding='valid', activation='elu', **self.conv_kwargs)(x)
        x_i = tf.keras.layers.GlobalMaxPooling1D(x_i)
        x_i = tf.keras.layers.Conv1D(64, 4, strides=1, padding='valid', activation='elu', **self.conv_kwargs)(x)
        x_i = tf.keras.layers.GlobalMaxPooling1D(x_i)
        x_i = tf.keras.layers.Conv1D(64, 5, strides=1, padding='valid', activation='elu', **self.conv_kwargs)(x)
        x_i = tf.keras.layers.GlobalMaxPooling1D(x_i)
            

        return x


class StackedRNN():

    def __init__(self, rnn_class=LSTM, hidden_dims=[50, 50], bidirectional=True, dropout_rate=0.5, **rnn_kwargs):
        """Creates a stacked RNN.
        Args:
            rnn_class: The type of RNN to use. (Default Value = LSTM)
            encoder_dims: The number of hidden units of RNN. (Default Value: 50)
            bidirectional: Whether to use bidirectional encoding. (Default Value = True)
            **rnn_kwargs: Additional args for building the RNN.
        """
        super(StackedRNN, self).__init__(dropout_rate)
        self.rnn_class = rnn_class
        self.hidden_dims = hidden_dims
        self.bidirectional = bidirectional
        self.rnn_kwargs = rnn_kwargs
        self.build_model()

    def build_model(self, x):
        x = tf.keras.layers.Dropout(0.5)
        for i in range(2):
            rnn = tf.keras.layers.LSTM(50, **self.rnn_kwargs)
        return x

    def allows_dynamic_length(self):
        return True


class AttentionRNN():

    def __init__(self, rnn_class=LSTM, encoder_dims=50, bidirectional=True, dropout_rate=0.5, **rnn_kwargs):
        """Creates an RNN model with attention. The attention mechanism is implemented as described
        in https://www.cs.cmu.edu/~hovy/papers/16HLT-hierarchical-attention-networks.pdf, but without
        sentence level attention.
        Args:
            rnn_class: The type of RNN to use. (Default Value = LSTM)
            encoder_dims: The number of hidden units of RNN. (Default Value: 50)
            bidirectional: Whether to use bidirectional encoding. (Default Value = True)
            **rnn_kwargs: Additional args for building the RNN.
        """
        super(AttentionRNN, self).__init__(dropout_rate)
        self.rnn_class = rnn_class
        self.encoder_dims = encoder_dims
        self.bidirectional = bidirectional
        self.rnn_kwargs = rnn_kwargs
        self.build_model(x)

    def build_model(self, x):
        x = tf.keras.layers.Dropout(0.5)
        rnn = tf.keras.layers.LSTM(50, return_sequences=True, **self.rnn_kwargs)

        attention_layer = tf.keras.layers.Attention()
        doc_vector = attention_layer(word_activations)
        self.attention_tensor = attention_layer.get_attention_tensor()
        return doc_vector


class AveragingEncoder(SequenceEncoderBase):

    def __init__(self, dropout_rate=0):
        """An encoder that averages sequence inputs.
        """
        super(AveragingEncoder, self).__init__(dropout_rate)
        self.build_model()

    def build_model(self, x):
        x = tf.keras.layers.Dropout(0.5)
        x = tf.keras.layers.GlobalAveragePooling1D(x)
        return x

YoonKimCNN()
AttentionRNN()
StackedRNN()
AveragingEncoder()