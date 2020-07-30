import numpy as np
from getdata import load
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Convolution2D, MaxPooling2D
from keras.optimizers import SGD
from keras.callbacks import ModelCheckpoint
from sklearn.metrics import matthews_corrcoef
from sklearn.metrics import hamming_loss
from keras import backend as K
K.set_image_dim_ordering('th')

x_train, x_test, y_train, y_test = load()

x_train = x_train.astype('float32')
x_test  = x_test.astype('float32')

x_train /= 255
x_test /= 255


model = Sequential()
tf.keras.layers.Convolution2D(32, kernel_size=(3, 3),padding='same',input_shape=(3 , 100, 100))
tf.keras.layers.ReLU()
tf.keras.layers.Convolution2D(64, (3, 3))
tf.keras.layers.ReLU()
tf.keras.layers.MaxPooling2D(pool_size=(2, 2))
tf.keras.layers.Dropout(0.25)

tf.keras.layers.Convolution2D(64,(3, 3), padding='same')
tf.keras.layers.ReLU()
tf.keras.layers.Convolution2D(64, 3, 3)
tf.keras.layers.ReLU()
tf.keras.layers.MaxPooling2D(pool_size=(2, 2))
tf.keras.layers.Dropout(0.25)

tf.keras.layers.Flatten()
tf.keras.layers.Dense(512)
tf.keras.layers.ReLU()
tf.keras.layers.Dropout(0.5)
tf.keras.layers.Dense(5)
tf.keras.layers.Sigmoid()

lr=0.01 
decay=1e-6
momentum=0.9
# let's train the model using SGD + momentum (how original).
sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='binary_crossentropy', optimizer=sgd, metrics=['accuracy'])

# model.load_weights("weights.16-0.86800.hdf5")

out = model.predict_proba(x_test)

acc = []
accuracies = []

print("-"*40)
print("Matthews Correlation Coefficient")
print("Class wise accuracies")
print(accuracies)

print("other statistics\n")
print("Fully correct output")
print(total_correctly_predicted)
print(total_correctly_predicted/400.)