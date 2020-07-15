#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 17-9-21 下午6:39
# @Author  : MaybeShewill-CV
# @Site    : https://github.com/MaybeShewill-CV/CRNN_Tensorflow
# @File    : crnn_net.py
# @IDE: PyCharm Community Edition
"""
Implement the crnn model mentioned in An End-to-End Trainable Neural Network for Image-based Sequence
Recognition and Its Application to Scene Text Recognition paper
"""
import numpy as np
import tensorflow as tf
from tensorflow.contrib import rnn

from crnn_model import cnn_basenet
from config import global_config

CFG = global_config.cfg


class ShadowNet(cnn_basenet.CNNBaseModel):
    """
        Implement the crnn model for squence recognition
    """
    def __init__(self, phase, hidden_nums, layers_nums, num_classes):
        """

        :param phase: 'Train' or 'Test'
        :param hidden_nums: Number of hidden units in each LSTM cell (block)
        :param layers_nums: Number of LSTM cells (blocks)
        :param num_classes: Number of classes (different symbols) to detect
        """
        self._hidden_nums = 256
        self._layers_nums = 2
        self._num_classes = 37
        self.inference(inputdata, name, reuse=False)
        self.compute_loss(inputdata, labels, name, reuse)

    def _conv_stage(self, inputdata, out_dims, name):
        """ Standard VGG convolutional stage: 2d conv, relu, and maxpool

        :param inputdata: 4D tensor batch x width x height x channels
        :param out_dims: number of output channels / filters
        :return: the maxpooled output of the stage
        """

        conv = tf.nn.conv2d(inputdata, 3, 1, name='conv', padding='SAME')
        bn = tf.nn.batch_normalization(conv)
        relu = tf.nn.relu(bn)
        max_pool = tf.nn.max_pool(relu, ksize=2, strides=2)
        return max_pool

    def _feature_sequence_extraction(self, inputdata, name):
        """ Implements section 2.1 of the paper: "Feature Sequence Extraction"

        :param inputdata: eg. batch*32*100*3 NHWC format
        :param name:
        :return:
        """
        conv1 = self._conv_stage()
        conv2 = self._conv_stage()
        conv3 = tf.nn.conv2d(conv2, 3, 1, name='conv', padding='SAME')
        bn3 = tf.nn.batch_normalization(conv3 )
        relu3 = tf.nn.relu(bn3)
        conv4 = tf.nn.conv2d(relu3, 3, 1, name='conv', padding='SAME')
        bn4 = tf.nn.batch_normalization(conv4)
        relu4 = tf.nn.relu(bn4)
        max_pool4 = tf.nn.max_pool(relu4, ksize=[2, 1], strides=[2, 1], padding='VALID', name='max_pool4')
        conv5 = tf.nn.conv2d(max_pool4, 3, 1, name='conv', padding='SAME')
        bn5 = tf.nn.batch_normalization(conv5)
        relu5 = tf.nn.relu(bn5)
        conv6 = tf.nn.conv2d(relu5, 3, 1, name='conv', padding='SAME')
        bn6 = tf.nn.batch_normalization(conv6)
        relu6 = tf.nn.relu(bn6)
        max_pool6 = tf.nn.max_pool(relu6, ksize=[2, 1], strides=[2, 1], padding='VALID', name='max_pool6')
        conv7 = tf.nn.conv2d(max_pool6, 2, [2, 1], name='conv', padding='SAME')
        bn7 = tf.nn.batch_normalization(conv7)
        relu7 = tf.nn.relu(bn7)

        return relu7

    def _sequence_label(self, inputdata, name):
        """ Implements the sequence label part of the network

        :param inputdata:
        :param name:
        :return:
        """
        
            # construct stack lstm rcnn layer
            # forward lstm cell
        for i in range(2):
        	fw_cell_list = tf.nn.rnn_cell.LSTMCell(nh, forget_bias=1.0)
        	# Backward direction cells
        	bw_cell_list = tf.nn.rnn_cell.LSTMCell(nh, forget_bias=1.0)

        stack_lstm_layer= tf.contrib.rnn.stack_bidirectional_dynamic_rnn(fw_cell_list, bw_cell_list, inputdata,dtype=tf.float32)
        stack_lstm_layer = tf.nn.dropout(stack_lstm_layer,keep_prob=0.5)
        pred = tf.nn.softmax(logits)

        return rnn_out, raw_pred

    def inference(self, inputdata, name, reuse=False):
        """
        Main routine to construct the network
        :param inputdata:
        :param name:
        :param reuse:
        :return:
        """

            # first apply the cnn feature extraction stage
        cnn_out = self._feature_sequence_extraction(inputdata=inputdata, name='feature_extraction_module')

        # third apply the sequence label stage
        net_out, raw_pred = self._sequence_label(inputdata=sequence, name='sequence_rnn_module')

        return net_out

    def compute_loss(self, inputdata, labels, name, reuse):
        """

        :param inputdata:
        :param labels:
        :return:
        """

        inference_ret = self.inference(
            inputdata=inputdata, name=name, reuse=reuse
        )
        ctc = tf.nn.ctc_loss(labels=labels, inputs=inference_ret)
        loss = tf.reduce_mean(ctc, name='ctc_loss')

        return inference_ret, loss

if __name__ == "__main__":
	EPOCHS = 2000000
	MOMENTUM = 0.9
	LEARNING_RATE = 0.01
	LR_DECAY_RATE = 0.1
	BATCH_SIZE = 32
	ShadowNet()
