import tensorflow as tf
import tflib as lib
import tflib.ops.linear
import tflib.ops.conv1d

def ResBlock(name, inputs, dim):
    output = inputs
    output = tf.nn.relu(output)
    output = tf.layers.conv1d(dim, dim, 5, output)
    output = tf.nn.relu(output)
    output = tf.layers.conv1d(dim, dim, 5, output)
    return output

def Generator(n_samples, seq_len, layer_dim, output_dim, prev_outputs=None):
    output = tf.nn.batch_normalization()
    output = tf.layers.dense(128, output)
    output = ResBlock('Generator.1', output, layer_dim)
    output = ResBlock('Generator.2', output, layer_dim)
    output = ResBlock('Generator.3', output, layer_dim)
    output = ResBlock('Generator.4', output, layer_dim)
    output = ResBlock('Generator.5', output, layer_dim)
    output = tf.layers.conv1d(layer_dim, output_dim, 1, output)
    output = tf.nn.softmax(output, output_dim)
    return output

def Discriminator(inputs, seq_len, layer_dim, input_dim):
    output = tf.layers.conv1d(input_dim, layer_dim, 1, output)
    output = ResBlock('Discriminator.1', output, layer_dim)
    output = ResBlock('Discriminator.2', output, layer_dim)
    output = ResBlock('Discriminator.3', output, layer_dim)
    output = ResBlock('Discriminator.4', output, layer_dim)
    output = ResBlock('Discriminator.5', output, layer_dim)
    output = tf.layers.dense(1, output)
    return output

if __name__ == "__main__":
    batch_size = 64
    Generator()
    Discriminator()
