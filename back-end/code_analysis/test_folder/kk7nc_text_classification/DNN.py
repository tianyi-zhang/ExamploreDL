from keras.layers import  Dropout, Dense
from keras.models import Sequential
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from sklearn import metrics

def Build_Model_DNN_Text(shape, nClasses, dropout=0.5):
    """
    buildModel_DNN_Tex(shape, nClasses,dropout)
    Build Deep neural networks Model for text classification
    Shape is input feature space
    nClasses is number of classes
    """
    model = Sequential()
    node = 512 # number of nodes
    nLayers = 4 # number of  hidden layer

    tf.keras.layers.Dense(512,input_dim=shape,activation='relu')
    tf.keras.layers.Dropout(0.5)
    for i in range(4):
        tf.keras.layers.Dense(512,input_dim=512,activation='relu')
        tf.keras.layers.Dropout(0.5)
    tf.keras.layers.Dense(nClasses, activation='softmax')

    tf.keras.losses.categorical_crossentropy()

    return model


from sklearn.datasets import fetch_20newsgroups

newsgroups_train = fetch_20newsgroups(subset='train')
newsgroups_test = fetch_20newsgroups(subset='test')
X_train = newsgroups_train.data
X_test = newsgroups_test.data
y_train = newsgroups_train.target
y_test = newsgroups_test.target

model_DNN = Build_Model_DNN_Text(X_train_tfidf.shape[1], 20)

epochs=10
batch_size=128
verbose=2