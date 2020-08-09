from keras.layers import Dropout, Dense,Input,Embedding,Flatten, AveragePooling2D, Conv2D,Reshape
from keras.models import Sequential,Model
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from sklearn import metrics
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from sklearn.datasets import fetch_20newsgroups
from keras.layers.merge import Concatenate

def Build_Model_CNN_Text(word_index, embeddings_index, nclasses, MAX_SEQUENCE_LENGTH=500, EMBEDDING_DIM=100, dropout=0.5):

    """
        def buildModel_CNN(word_index, embeddings_index, nclasses, MAX_SEQUENCE_LENGTH=500, EMBEDDING_DIM=50, dropout=0.5):
        word_index in word index ,
        embeddings_index is embeddings index, look at data_helper.py
        nClasses is number of classes,
        MAX_SEQUENCE_LENGTH is maximum lenght of text sequences,
        EMBEDDING_DIM is an int value for dimention of word embedding look at data_helper.py
    """

    embedding_layer = tf.nn.embedding_lookup(len(word_index) + 1,
                                EMBEDDING_DIM,
                                weights=[embedding_matrix],
                                input_length=MAX_SEQUENCE_LENGTH,
                                trainable=True)

    # applying a more complex convolutional approach
    convs = []
    filter_sizes = []
    layer = 5
    print("Filter  ",layer)

    node = 128
    sequence_input = Input(shape=(MAX_SEQUENCE_LENGTH,), dtype='int32')
    embedded_sequences = embedding_layer(sequence_input)
    emb = Reshape((500,10, 10), input_shape=(500,100))(embedded_sequences)

    for fsz in range(5):
        l_conv = tf.keras.layers.Conv2D(128, padding="same", kernel_size=fsz, activation='relu')
        l_pool = tf.keras.layers.AveragePooling2D(pool_size=(5,1), padding="same")
        #l_pool = Dropout(0.25)(l_pool)
        convs.append(l_pool)

    l_merge = tf.keras.layers.Concatenate(axis=1)
    l_cov1 = tf.keras.layers.Conv2D(128, (5,5), padding="same", activation='relu')
    l_cov1 = tf.keras.layers.AveragePooling2D(pool_size=(5,2), padding="same")
    l_cov2 = tf.keras.layers.Conv2D(128, (5,5), padding="same", activation='relu')
    l_pool2 = tf.keras.layers.AveragePooling2D(pool_size=(5,2), padding="same")
    l_cov2 = tf.keras.layers.Dropout(0.5)
    l_flat = tf.keras.layers.Flatten()
    l_dense = tf.keras.layers.Dense(128, activation='relu')
    l_dense = tf.keras.layers.Dropout(0.5)

    preds = tf.keras.layers.Dense(nclasses, activation='softmax')
    model = Model(sequence_input, preds)

    tf.keras.losses.categorical_crossentropy()

    return model



from sklearn.datasets import fetch_20newsgroups
from RMDL import text_feature_extraction as txt

newsgroups_train = fetch_20newsgroups(subset='train')
newsgroups_test = fetch_20newsgroups(subset='test')
X_train = newsgroups_train.data
X_test = newsgroups_test.data
y_train = newsgroups_train.target
y_test = newsgroups_test.target

model_CNN = Build_Model_CNN_Text(word_index,embeddings_index, 20)


epochs=1000
batch_size=128
verbose=2
