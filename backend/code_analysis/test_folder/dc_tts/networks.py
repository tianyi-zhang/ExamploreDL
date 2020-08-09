# -*- coding: utf-8 -*-
#/usr/bin/python2
'''
By kyubyong park. kbpark.linguist@gmail.com. 
https://www.github.com/kyubyong/dc_tts
'''

from __future__ import print_function

from hyperparams import Hyperparams as hp
from modules import *
import tensorflow as tf

def TextEnc(L, training=True):

    tensor = tf.nn.embedding_lookup(L)
    tensor = tf.layers.conv1d(tensor,filters,1, dilation_rate=1,dropout_rate=hp.dropout_rate,activation_fn=tf.nn.relu)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)
    tensor = tf.layers.conv1d(tensor,filters,1, dilation_rate=1,dropout_rate=hp.dropout_rate)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)

    for _ in range(10):
        tensor = tf.layers.conv1d(tensor,filters,3)
        tensor = tf.contrib.layers.layer_norm(tensor)
        tensor = tf.contrib.layers.layer_norm(tensor)
        H1 = tf.nn.sigmoid(H1, "gate")
        tensor = tf.layers.dropout(tensor, rate=dropout_rate, training=training)

    for _ in range(2):
        tensor = tf.layers.conv1d(tensor,filters,1)
        tensor = tf.contrib.layers.layer_norm(tensor)
        tensor = tf.contrib.layers.layer_norm(tensor)
        H1 = tf.nn.sigmoid(H1, "gate")
        tensor = tf.layers.dropout(tensor, rate=dropout_rate, training=training)
    return K, V

def AudioEnc(S, training=True):

    tensor = tf.layers.conv1d(tensor,filters,1, dilation_rate=1,dropout_rate=hp.dropout_rate,activation_fn=tf.nn.relu)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)
    tensor = tf.layers.conv1d(tensor,filters,1, dilation_rate=1,dropout_rate=hp.dropout_rate,activation_fn=tf.nn.relu)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)

    tensor = tf.layers.conv1d(tensor,filters,1, dilation_rate=1,dropout_rate=hp.dropout_rate)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)

    for _ in range(10):
        tensor = tf.layers.conv1d(tensor,filters,3)
        tensor = tf.contrib.layers.layer_norm(tensor)
        tensor = tf.contrib.layers.layer_norm(tensor)
        H1 = tf.nn.sigmoid(H1, "gate")
        tensor = tf.layers.dropout(tensor, rate=dropout_rate, training=training)

    return tensor

def Attention(Q, K, V, mononotic_attention=False, prev_max_attentions=None):
    '''
    Args:
      Q: Queries. (B, T/r, d)
      K: Keys. (B, N, d)
      V: Values. (B, N, d)
      mononotic_attention: A boolean. At training, it is False.
      prev_max_attentions: (B,). At training, it is set to None.

    Returns:
      R: [Context Vectors; Q]. (B, T/r, 2d)
      alignments: (B, N, T/r)
      max_attentions: (B, T/r)
    '''
    tf.keras.layers.Attention()

def AudioDec(R, training=True):
    '''
    Args:
      R: [Context Vectors; Q]. (B, T/r, 2d)

    Returns:
      Y: Melspectrogram predictions. (B, T/r, n_mels)
    '''

    i = 1
    tensor = tf.layers.conv1d(tensor,filters,1, dilation_rate=1,dropout_rate=hp.dropout_rate)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)

    for _ in range(6):
        tensor = tf.layers.conv1d(tensor,filters,3)
        tensor = tf.contrib.layers.layer_norm(tensor)
        tensor = tf.contrib.layers.layer_norm(tensor)
        H1 = tf.nn.sigmoid(H1, "gate")
        tensor = tf.layers.dropout(tensor, rate=dropout_rate, training=training)

    for _ in range(3):
        tensor = tf.layers.conv1d(tensor,filters,1)
        H1 = tf.contrib.layers.layer_norm(tensor)
        H2 = tf.contrib.layers.layer_norm(tensor)
        H1 = tf.nn.sigmoid(H1, "gate")
        H2 = tf.nn.relu(H2)
        tensor = tf.layers.dropout(tensor, rate=dropout_rate, training=training)
    # mel_hats
    tensor = tf.layers.conv1d(tensor,filters,1)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)
    Y = tf.nn.sigmoid(logits) # mel_hats

def SSRN(Y, training=True):
    '''
    Args:
      Y: Melspectrogram Predictions. (B, T/r, n_mels)

    Returns:
      Z: Spectrogram Predictions. (B, T, 1+n_fft/2)
    '''

    i = 1 # number of layers

    # -> (B, T/r, c)
    tensor = tf.layers.conv1d(tensor,filters,1)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)

    for j in range(2):
        tensor = tf.layers.conv1d(tensor,filters,3)
        tensor = tf.contrib.layers.layer_norm(tensor)
        tensor = tf.contrib.layers.layer_norm(tensor)
        H1 = tf.nn.sigmoid(H1, "gate")
        tensor = tf.layers.dropout(tensor, rate=dropout_rate, training=training)

    for _ in range(2):
        # -> (B, T/2, c) -> (B, T, c)
        tensor = tf.layers.conv2d_transpose(tensor)
        tensor = tf.contrib.layers.layer_norm(tensor)
        tensor = tf.layers.dropout(tensor)

    for j in range(4):
        tensor = tf.layers.conv1d(tensor,filters,3)
        tensor = tf.contrib.layers.layer_norm(tensor)
        tensor = tf.contrib.layers.layer_norm(tensor)
        H1 = tf.nn.sigmoid(H1, "gate")
        tensor = tf.layers.dropout(tensor, rate=dropout_rate, training=training)
    # -> (B, T, 2*c)
    tensor = tf.layers.conv1d(tensor,filters,1)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)

    for _ in range(2):
        tensor = tf.layers.conv1d(tensor,filters,3)
        tensor = tf.contrib.layers.layer_norm(tensor)
        tensor = tf.contrib.layers.layer_norm(tensor)
        H1 = tf.nn.sigmoid(H1, "gate")
        tensor = tf.layers.dropout(tensor, rate=dropout_rate, training=training)
    # -> (B, T, 1+n_fft/2)
    tensor = tf.layers.conv1d(tensor,filters,1)
    tensor = tf.contrib.layers.layer_norm(tensor)
    tensor = tf.layers.dropout(tensor)

    for _ in range(2):
        tensor = tf.layers.conv1d(tensor,filters,1,activation_fn=tf.nn.relu)
        tensor = tf.contrib.layers.layer_norm(tensor)
        tensor = tf.layers.dropout(tensor)

    tensor = tf.layers.conv1d(tensor,filters,1)
    tensor = tf.contrib.layers.layer_norm(tensor)
    logits = tf.layers.dropout(tensor)

    Z = tf.nn.sigmoid(logits)
    return logits, Z

if __name__ == '__main__':    
    dropout_rate = 0.05    
    lr = 0.001    
    batch_size = 32    
    TextEnc()    
    AudioEnc()    
    Attention()    
    AudioDec()    
    SSRN()
