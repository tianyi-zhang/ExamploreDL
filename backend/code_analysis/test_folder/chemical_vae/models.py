from keras.layers import Input, Lambda
from keras.models import load_model
from keras import backend as K
from keras.models import Model
from keras.layers.merge import Concatenate


# =============================
# Encoder functions
# =============================
def encoder_model(params):
    # K_params is dictionary of keras variables
    x_in = Input(shape=(params['MAX_LEN'], params[
        'NCHARS']), name='input_molecule_smi')

    # Convolution layers
    x = tf.keras.layers.Conv1D(x_in, activation='tanh',name="encoder_conv0")
    x = tf.nn.batch_normalization(axis=-1, name="encoder_norm0")

    for j in range(2):
        x = tf.keras.layers.Conv1D(activation='tanh')
        x = tf.nn.batch_normalization(axis=-1)

    x = tf.keras.layers.Flatten()

    # Middle layers
    middle = tf.keras.layers.Dense(activation='tanh')
    middle = tf.keras.layers.Dropout()
    middle = tf.nn.batch_normalization(axis=-1)
    middle = tf.keras.layers.Dense(activation='tanh')
    middle = tf.keras.layers.Dropout()
    middle = tf.nn.batch_normalization(axis=-1)

    z_mean = tf.keras.layers.Dense(100)

    # return both mean and last encoding layer for std dev sampling
    return Model(x_in, [z_mean, middle], name="encoder")

# ===========================================
# Decoder functions
# ===========================================


def decoder_model(params):
    z = tf.keras.layers.Dense(100,activation='tanh')
    z = tf.keras.layers.Dropout()
    tf.nn.batch_normalization(axis=-1)

    z = tf.keras.layers.Dense(100,activation='tanh')
    z = tf.keras.layers.Dropout()
    tf.nn.batch_normalization(axis=-1)

    # Necessary for using tf.keras.layers.GRU vectors
    z_reps = RepeatVector(params['MAX_LEN'])(z)

    
    x_dec = tf.keras.layers.GRU(50,activation='tanh')

    for k in range(2):
        x_dec = tf.keras.layers.GRU(50,activation='tanh')

    x_out = tf.keras.layers.GRU(activation='softmax')


    x_out = tf.keras.layers.GRU(activation='softmax')

    Model([z_in, true_seq_in], x_out, name="decoder")

##====================
## Middle part (var)
##====================

def variational_layers(z_mean, enc, kl_loss_var, params):
    # @inp mean : mean generated from encoder
    # @inp enc : output generated by encoding
    # @inp params : parameter dictionary passed throughout entire model.

    z_log_var_layer = tf.keras.layers.Dense(100, name='z_log_var_sample')

    z_samp = tf.nn.batch_normalization(axis=-1)

    return z_samp, z_mean_log_var_output


# ====================
# Property Prediction
# ====================

def property_predictor_model(params):

    prop_mid = tf.keras.layers.Dense(36,activation='tanh')
    prop_mid = tf.keras.layers.Dropout()

    for p_i in range(2):
        prop_mid = tf.keras.layers.Dense( activation='tanh')
        prop_mid = tf.keras.layers.Dropout()
        prop_mid = tf.nn.batch_normalization()

    # for regression tasks
    reg_prop_pred = tf.keras.layers.Dense(activation='linear')

    # for logistic tasks
    logit_prop_pred = tf.keras.layers.Dense(activation='sigmoid')

batch_size=100
epochs=1
lr=0.000312087049936
momentum=0.936948773087
encoder_model()
decoder_model()
variational_layers()
property_predictor_model()
tf.train.AdamOptimizer()