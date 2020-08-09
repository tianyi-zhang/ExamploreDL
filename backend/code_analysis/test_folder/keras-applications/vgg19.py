"""VGG16 model for Keras.
# Reference
- [Very Deep Convolutional Networks for Large-Scale Image Recognition](
    https://arxiv.org/abs/1409.1556) (ICLR 2015)
"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os

from . import get_submodules_from_kwargs
from . import imagenet_utils
from .imagenet_utils import decode_predictions
from .imagenet_utils import _obtain_input_shape

preprocess_input = imagenet_utils.preprocess_input

def VGG19(include_top=True,
          weights='imagenet',
          input_tensor=None,
          input_shape=None,
          pooling=None,
          classes=1000,
          **kwargs):
    """Instantiates the VGG16 architecture.
    Optionally loads weights pre-trained on ImageNet.
    Note that the data format convention used by the model is
    the one specified in your Keras config at `~/.keras/keras.json`.
    # Arguments
        include_top: whether to include the 3 fully-connected
            tf.keras.layers at the top of the network.
        weights: one of `None` (random initialization),
              'imagenet' (pre-training on ImageNet),
              or the path to the weights file to be loaded.
        input_tensor: optional Keras tensor
            (i.e. output of `tf.keras.layers.Input()`)
            to use as image input for the model.
        input_shape: optional shape tuple, only to be specified
            if `include_top` is False (otherwise the input shape
            has to be `(224, 224, 3)`
            (with `channels_last` data format)
            or `(3, 224, 224)` (with `channels_first` data format).
            It should have exactly 3 input channels,
            and width and height should be no smaller than 32.
            E.g. `(200, 200, 3)` would be one valid value.
        pooling: Optional pooling mode for feature extraction
            when `include_top` is `False`.
            - `None` means that the output of the model will be
                the 4D tensor output of the
                last convolutional block.
            - `avg` means that global average pooling
                will be applied to the output of the
                last convolutional block, and thus
                the output of the model will be a 2D tensor.
            - `max` means that global max pooling will
                be applied.
        classes: optional number of classes to classify images
            into, only to be specified if `include_top` is True, and
            if no `weights` argument is specified.
    # Returns
        A Keras model instance.
    # Raises
        ValueError: in case of invalid argument for `weights`,
            or invalid input shape.
    """
    
    # Block 1
    x = tf.keras.layers.Conv2D(img_input, 64, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block1_conv1')
    x = tf.keras.layers.Conv2D(x, 64, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block1_conv2')
    x = tf.keras.layers.MaxPooling2D(x, (2, 2), strides=(2, 2), name='block1_pool')

    # Block 2
    x = tf.keras.layers.Conv2D(x, 128, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block2_conv1')
    x = tf.keras.layers.Conv2D(x, 128, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block2_conv2')
    x = tf.keras.layers.MaxPooling2D(x, (2, 2), strides=(2, 2), name='block2_pool')

    # Block 3
    x = tf.keras.layers.Conv2D(x, 256, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block3_conv1')
    x = tf.keras.layers.Conv2D(x, 256, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block3_conv2')
    x = tf.keras.layers.Conv2D(x, 256, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block3_conv3')
    x = tf.keras.layers.Conv2D(x, 256, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block3_conv4')
    x = tf.keras.layers.MaxPooling2D(x, (2, 2), strides=(2, 2), name='block3_pool')

    # Block 4
    x = tf.keras.layers.Conv2D(x, 512, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block4_conv1')
    x = tf.keras.layers.Conv2D(x, 512, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block4_conv2')
    x = tf.keras.layers.Conv2D(x, 512, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block4_conv3')
    x = tf.keras.layers.Conv2D(x, 512, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block4_conv4')
    x = tf.keras.layers.MaxPooling2D(x, (2, 2), strides=(2, 2), name='block4_pool')

    # Block 5
    x = tf.keras.layers.Conv2D(x, 512, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block5_conv1')
    x = tf.keras.layers.Conv2D(x, 512, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block5_conv2')
    x = tf.keras.layers.Conv2D(x, 512, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block5_conv3')
    x = tf.keras.layers.Conv2D(x, 512, (3, 3),
                      activation='relu',
                      padding='same',
                      name='block5_conv4')
    x = tf.keras.layers.MaxPooling2D(x, (2, 2), strides=(2, 2), name='block5_pool')


        # Classification block
    x = tf.keras.layers.Flatten(x, name='flatten')
    x = tf.keras.layers.Dense(x, 4096, activation='relu', name='fc1')
    x = tf.keras.layers.Dense(x, 4096, activation='relu', name='fc2')
    x = tf.keras.layers.Dense(x, classes, activation='softmax', name='predictions')

    # Ensure that the model takes into account
    # any potential predecessors of `input_tensor`.
    
    # Create model.
    model = models.Model(inputs, x, name='vgg16')
if __name__ == '__main__':
  VGG19()