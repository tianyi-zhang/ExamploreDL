import numpy as np
from keras import backend as K
from keras.engine import Input, Model
from keras.optimizers import Adam

from unet3d.metrics import dice_coefficient_loss, get_label_dice_coefficient_function, dice_coefficient

K.set_image_data_format("channels_first")

try:
    from keras.engine import merge
except ImportError:
    from keras.layers.merge import concatenate


def unet_model_3d(input_shape, pool_size=(2, 2, 2), n_labels=1, initial_learning_rate=0.00001, deconvolution=False,
                  depth=4, n_base_filters=32, include_label_wise_dice_coefficients=False, metrics=dice_coefficient,
                  batch_normalization=False, activation_name="sigmoid"):
    """
    Builds the 3D UNet Keras model.f
    :param metrics: List metrics to be calculated during model training (default is dice coefficient).
    :param include_label_wise_dice_coefficients: If True and n_labels is greater than 1, model will report the dice
    coefficient for each label as metric.
    :param n_base_filters: The number of filters that the first layer in the convolution network will have. Following
    layers will contain a multiple of this number. Lowering this number will likely reduce the amount of memory required
    to train the model.
    :param depth: indicates the depth of the U-shape for the model. The greater the depth, the more max pooling
    layers will be added to the model. Lowering the depth may reduce the amount of memory required for training.
    :param input_shape: Shape of the input data (n_chanels, x_size, y_size, z_size). The x, y, and z sizes must be
    divisible by the pool size to the power of the depth of the UNet, that is pool_size^depth.
    :param pool_size: Pool size for the max pooling operations.
    :param n_labels: Number of binary labels that the model is learning.
    :param initial_learning_rate: Initial learning rate for the model. This will be decayed during training.
    :param deconvolution: If set to True, will use transpose convolution(deconvolution) instead of up-sampling. This
    increases the amount memory required during training.
    :return: Untrained 3D UNet Model
    """
    inputs = Input(input_shape)
    current_layer = inputs
    levels = list()

    layer1 = tf.keras.layers.Conv3D(input_layer=current_layer, n_filters=32)
    layer1 = tf.keras.layers.BatchNormalization(layer1)
    tf.keras.activations.relu()
    layer2 = tf.keras.layers.Conv3D(input_layer=current_layer, n_filters=32)
    layer2 = tf.keras.layers.BatchNormalization(layer1)
    tf.keras.activations.relu()
    tf.keras.layers.MaxPooling3D(layer2, pool_size=(2, 2, 2))

    layer1 = tf.keras.layers.Conv3D(input_layer=current_layer, n_filters=64)
    layer1 = tf.keras.layers.BatchNormalization(layer1)
    tf.keras.activations.relu()
    layer2 = tf.keras.layers.Conv3D(input_layer=current_layer, n_filters=64)
    layer2 = tf.keras.layers.BatchNormalization(layer1)
    tf.keras.activations.relu()
    tf.keras.layers.MaxPooling3D(layer2, pool_size=(2, 2, 2))

    layer1 = tf.keras.layers.Conv3D(input_layer=current_layer, n_filters=128)
    layer1 = tf.keras.layers.BatchNormalization(layer1)
    tf.keras.activations.relu()
    layer2 = tf.keras.layers.Conv3D(input_layer=current_layer, n_filters=128)
    layer2 = tf.keras.layers.BatchNormalization(layer1)
    tf.keras.activations.relu()
    tf.keras.layers.MaxPooling3D(layer2, pool_size=(2, 2, 2))

    layer1 = tf.keras.layers.Conv3D(input_layer=current_layer, n_filters=256)
    layer1 = tf.keras.layers.BatchNormalization(layer1)
    tf.keras.activations.relu()
    layer2 = tf.keras.layers.Conv3D(input_layer=current_layer, n_filters=256)
    layer1 = tf.keras.layers.BatchNormalization(layer1)
    tf.keras.activations.relu()

    # add levels with up-convolution or up-sampling
    for layer_depth in range(2, -1, -1):
        tf.keras.layers.Deconvolution3D(filters=n_filters, kernel_size=(2, 2, 2),strides=(2, 2, 2))
        layer = tf.keras.layers.Conv3D(n_filters, (3, 3, 3), padding=padding, strides=(1, 1, 1))
        layer2 = tf.keras.layers.BatchNormalization(layer1)
        tf.keras.activations.relu()
        layer = tf.keras.layers.Conv3D(n_filters, (3, 3, 3), padding=padding, strides=(1, 1, 1))
        layer2 = tf.keras.layers.BatchNormalization(layer1)
        InstanceNormalization()
        tf.keras.activations.relu()
        tf.keras.layers.BatchNormalization()

    final_convolution = tf.keras.layers.Conv3D(current_layer,1, (1, 1, 1))
    act = tf.keras.activations.sigmoid()
    model = Model(inputs=inputs, outputs=act)

    tf.keras.optimizers.Adam(lr=initial_learning_rate)
    return model

if __name__ == '__main__':
    decay = 0.5
    epochs = 500
    lr=0.00001
    unet_model_3d()