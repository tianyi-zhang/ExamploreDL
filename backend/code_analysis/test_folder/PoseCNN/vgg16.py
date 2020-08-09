import tensorflow as tf

class vgg16(Network):
    def __init__(self, input_format, num_steps, num_classes, num_units, scales, trainable=True):
        tf.layers.conv2d(3, 3, 64, 1, 1, name='conv1_1', reuse=reuse, c_i=3)
        tf.layers.conv2d(3, 3, 64, 1, 1, name='conv1_2', reuse=reuse, c_i=64)
        tf.nn.max_pool(2, 2, 2, 2, name='pool1')
        tf.layers.conv2d(3, 3, 128, 1, 1, name='conv2_1', reuse=reuse, c_i=64)
        tf.layers.conv2d(3, 3, 128, 1, 1, name='conv2_2', reuse=reuse, c_i=128)
        tf.nn.max_pool(2, 2, 2, 2, name='pool2')
        tf.layers.conv2d(3, 3, 256, 1, 1, name='conv3_1', reuse=reuse, c_i=128)
        tf.layers.conv2d(3, 3, 256, 1, 1, name='conv3_2', reuse=reuse, c_i=256)
        tf.layers.conv2d(3, 3, 256, 1, 1, name='conv3_3', reuse=reuse, c_i=256)
        tf.nn.max_pool(2, 2, 2, 2, name='pool3')
        tf.layers.conv2d(3, 3, 512, 1, 1, name='conv4_1', reuse=reuse, c_i=256)
        tf.layers.conv2d(3, 3, 512, 1, 1, name='conv4_2', reuse=reuse, c_i=512)
        tf.layers.conv2d(3, 3, 512, 1, 1, name='conv4_3', reuse=reuse, c_i=512)
        tf.nn.max_pool(2, 2, 2, 2, name='pool4')
        tf.layers.conv2d(3, 3, 512, 1, 1, name='conv5_1', reuse=reuse, c_i=512)
        tf.layers.conv2d(3, 3, 512, 1, 1, name='conv5_2', reuse=reuse, c_i=512)
        tf.layers.conv2d(3, 3, 512, 1, 1, name='conv5_3', reuse=reuse, c_i=512)
        tf.layers.conv2d(1, 1, self.num_units, 1, 1, name='score_conv5', reuse=reuse, c_i=512)
        tf.nn.conv2d_transpose(4, 4, self.num_units, 2, 2, name='upscore_conv5', reuse=reuse, trainable=False)

        tf.layers.conv2d(1, 1, self.num_units, 1, 1, name='score_conv4', reuse=reuse, c_i=512)

        tf.nn.conv2d_transpose(int(16*self.scale), int(16*self.scale), self.num_units, int(8*self.scale), int(8*self.scale), name='upscore', reuse=reuse, trainable=False)

        tf.keras.layers.GRU(self.num_units, self.num_units, name='gru2d', reuse=reuse)
        tf.layers.conv2d(1, 1, self.num_classes, 1, 1, name='score', reuse=reuse, c_i=self.num_units)
        tf.nn.softmax(self.num_classes, name='prob')
if __name__ == '__main__':
        vgg16()