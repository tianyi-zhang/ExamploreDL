from keras.preprocessing import sequence
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation
from keras.layers import Embedding
from keras.layers import LSTM
from keras.layers import Conv1D, MaxPooling1D
from keras.datasets import imdb
from sklearn.datasets import fetch_20newsgroups
import numpy as np
from sklearn import metrics
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences

def Build_Model_RCNN_Text(word_index, embeddings_index, nclasses, MAX_SEQUENCE_LENGTH=500, EMBEDDING_DIM=100):

    kernel_size = 2
    filters = 256
    pool_size = 2
    gru_node = 256
    tf.nn.embedding_lookup(len(word_index) + 1,
                                EMBEDDING_DIM,
                                weights=[embedding_matrix],
                                input_length=MAX_SEQUENCE_LENGTH,
                                trainable=True)
    tf.keras.layers.Dropout(0.25)
    tf.keras.layers.Conv1D(256, 2, activation='relu')
    tf.keras.layers.MaxPooling1D(pool_size=2)
    tf.keras.layers.Conv1D(256, 2, activation='relu')
    tf.keras.layers.MaxPooling1D(pool_size=2)
    tf.keras.layers.Conv1D(256, 2, activation='relu')
    tf.keras.layers.MaxPooling1D(pool_size=2)
    tf.keras.layers.Conv1D(256, 2, activation='relu')
    tf.keras.layers.MaxPooling1D(pool_size=2)
    tf.keras.layers.LSTM(256, return_sequences=True, recurrent_dropout=0.2)
    tf.keras.layers.LSTM(256, return_sequences=True, recurrent_dropout=0.2)
    tf.keras.layers.LSTM(256, return_sequences=True, recurrent_dropout=0.2)
    tf.keras.layers.LSTM(256, recurrent_dropout=0.2)
    tf.keras.layers.Dense(1024,activation='relu')
    tf.keras.layers.Dense(nclasses)
    tf.nn.softmax()
    tf.keras.losses.categorical_crossentropy()

    return model

newsgroups_train = fetch_20newsgroups(subset='train')
newsgroups_test = fetch_20newsgroups(subset='test')
X_train = newsgroups_train.data
X_test = newsgroups_test.data
y_train = newsgroups_train.target
y_test = newsgroups_test.target

model_RCNN = Build_Model_RCNN_Text(word_index,embeddings_index, 20)


epochs=15
batch_size=128