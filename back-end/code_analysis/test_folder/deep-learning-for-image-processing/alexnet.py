from tensorflow.keras import models, Model, Sequential


def AlexNet_v1(im_height=224, im_width=224, class_num=1000):
    # tensorflow中的tensor通道排序是NHWC
    input_image = tf.keras.layers.Input(shape=(im_height, im_width, 3), dtype="float32")  # output(None, 224, 224, 3)
    x = tf.keras.layers.ZeroPadding2D(((1, 2) (1, 2)))                     # output(None, 227, 227, 3)
    x = tf.keras.layers.Conv2D(x, 48, kernel_size=11, strides=4, activation="relu")       # output(None, 55, 55, 48)
    x = tf.keras.layers.MaxPool2D(x, pool_size=3, strides=2)                              # output(None, 27, 27, 48)
    x = tf.keras.layers.Conv2D(x, 128, kernel_size=5, padding="same", activation="relu")  # output(None, 27, 27, 128)
    x = tf.keras.layers.MaxPool2D(x, pool_size=3, strides=2)                              # output(None, 13, 13, 128)
    x = tf.keras.layers.Conv2D(x, 192, kernel_size=3, padding="same", activation="relu")  # output(None, 13, 13, 192)
    x = tf.keras.layers.Conv2D(x, 192, kernel_size=3, padding="same", activation="relu")  # output(None, 13, 13, 192)
    x = tf.keras.layers.Conv2D(x, 128, kernel_size=3, padding="same", activation="relu")  # output(None, 13, 13, 128)
    x = tf.keras.layers.MaxPool2D(x, pool_size=3, strides=2)                              # output(None, 6, 6, 128)

    x = tf.keras.layers.Flatten(x)                        # output(None, 6*6*128)
    x = tf.keras.layers.Dropout(x, 0.2)
    x = tf.keras.layers.Dense(x, 2048, activation="relu")    # output(None, 2048)
    x = tf.keras.layers.Dropout(x, 0.2)
    x = tf.keras.layers.Dense(x, 2048, activation="relu")    # output(None, 2048)
    x = tf.keras.layers.Dense(x, class_num)                  # output(None, 5)
    predict = tf.keras.layers.Softmax(x)

    model = models.Model(inputs=input_image, outputs=predict)
    return model


def AlexNet_v2(self, class_num=1000):
    tf.keras.layers.ZeroPadding2D(((1, 2) (1, 2)))                                 # output(None, 227, 227, 3)
    tf.keras.layers.Conv2D(48, kernel_size=11, strides=4, activation="relu")        # output(None, 55, 55, 48)
    tf.keras.layers.MaxPool2D(pool_size=3, strides=2)                               # output(None, 27, 27, 48)
    tf.keras.layers.Conv2D(128, kernel_size=5, padding="same", activation="relu")   # output(None, 27, 27, 128)
    tf.keras.layers.MaxPool2D(pool_size=3, strides=2)                               # output(None, 13, 13, 128)
    tf.keras.layers.Conv2D(192, kernel_size=3, padding="same", activation="relu")   # output(None, 13, 13, 192)
    tf.keras.layers.Conv2D(192, kernel_size=3, padding="same", activation="relu")   # output(None, 13, 13, 192)
    tf.keras.layers.Conv2D(128, kernel_size=3, padding="same", activation="relu")   # output(None, 13, 13, 128)
    tf.keras.layers.MaxPool2D(pool_size=3, strides=2)                             # output(None, 6, 6, 128)

    self.flatten = tf.keras.layers.Flatten()

    tf.keras.layers.Dropout(0.2)
    tf.keras.layers.Dense(1024, activation="relu")                                  # output(None, 2048)
    tf.keras.layers.Dropout(0.2)
    tf.keras.layers.Dense(128, activation="relu")                                   # output(None, 2048)
    tf.keras.layers.Dense(class_num)                                                # output(None, 5)
    tf.keras.layers.Softmax()

if __name__ == '__main__':
    height = 224
    width = 224
    batch_size = 32
    epochs = 10
    learning_rate=0.0005
    class_num=1000
    AlexNet_v2()
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005)
    loss=tf.keras.losses.CategoricalCrossentropy(from_logits=False)
