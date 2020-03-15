import csv
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.tokenize import RegexpTokenizer
import re

def tasks_jud(text):
	# CV
	image_classification = {'image': 1.5, 'classification': 3, 'MNIST': 1.5, 'CIFAR-10': 1.5, 'CIFAR-100': 1.5,
	                        'ImageNet': 1.5, 'birds': 1.65, 'Flowers': 1.65, 'cars': 1.65, 'pets': 1.65, 'voc': 1.5,
	                        'CoPhIR': 1.75, 'TinyImages': 1.75, 'CUB-200': 1.65, 'cnn': 1.5, 'vgg': 1.5,
	                        'inception': 1.5, 'AlexNet': 1.65, 'ZFNet': 1.65, 'GoogleNet': 1.65, 'ResNet': 1.65,
	                        'DenseNet': 1.65, 'LeNet':1.65}

	object_localization = {'image': 1.5, 'object': 3, 'localization': 20, 'bound': 1.5, 'box': 1.5, 'ImageNet': 1.5,
	                       'Camvid': 1.65, 'coco': 1.75, 'openimages': 1.75, 'CoPhIR': 1.75, 'TinyImages': 1.75,
	                       'cnn': 1.2, 'vgg': 1.2, 'inception': 1.2, 'RCNN': 1.65, 'R-CNN': 1.65, 'Fast RCNN': 1.65,
	                       'Faster RCNN': 1.65, 'YOLO': 1.65, 'SSD': 1.65, 'SPP': 1.65}

	object_detection = {'image': 1.5, 'object': 3, 'detection': 20, 'box': 1.5, 'SVHN': 2.0, 'ImageNet': 1.5,
	                    'coco': 1.75, 'openimages': 1.75, 'CoPhIR': 1.75, 'TinyImages': 1.75, 'cnn': 1.2, 'vgg': 1.2,
	                    'inception': 1.2}

	object_recognition = {'image': 1.5, 'object': 3, 'recognition': 20, 'box': 1.5, 'SVHN': 2.0, 'ImageNet': 1.5,
	                      'coco': 1.75, 'openimages': 1.75, 'CoPhIR': 1.75, 'TinyImages': 1.75, 'cnn': 1.2, 'vgg': 1.2,
	                      'inception': 1.2}

	semantic_segmentation = {'image': 1.5, 'semantic': 10, 'segmentation': 5, 'patches': 1.5, 'box': 1.5,
	                         'ImageNet': 1.5, 'SAE': 1.5, 'CNN': 1.5, 'SegNet': 1.65, 'FCN': 1.65, 'RefineNet': 1.65}

	object_tracking = {'image': 1.5, 'object': 3, 'tracking': 20, 'patches': 1.5, 'tracker': 1.65, 'box': 1.2,
	                   'ImageNet': 1.5, 'SAE': 1.5, 'CNN': 1.5, 'DLT': 1.65, 'FCNT': 1.65, 'MD Net': 1.65, 'RNN': 1.25,
	                   'DBN': 1.5}

	instance_segmentation = {'image': 1.5, 'instance': 7, 'segmentation': 3, 'patches': 1.5, 'bound': 1.5,
	                         'box': 1.5, 'RoIPool': 1.65, 'Roialign': 1.65, 'ImageNet': 1.5, 'CNN': 1.5,
	                         'Mask RCNN': 1.65, 'Faster RCNN': 1.65}

	# NLP
	text_classification = {'text': 15, 'classification': 5, 'CNN': 1.5, 'RNN': 1.5, 'FastText': 1.65, 'BERT': 1.65,
	                       'ELMo': 1.65, 'GPT': 1.65, 'ULMFiT': 1.65, 'GCNN': 1.65, 'LSTM': 1.65}

	machine_translation = {'translation': 25, 'NMT': 2.5, 'CNN': 1.5, 'RNN': 1.5, 'SMT': 1.65,
	                       'BERT': 1.65, 'XLM': 1.65, 'TLM': 1.65, 'ULMFiT': 1.65, 'seq2seq': 2.0, 'LSTM': 1.65,
	                       'byteNet': 1.65, 'convs2s': 1.65}

	sentiment_analysis = {'sentiment': 25, 'analysis': 1.5, 'IMDB': 1.75, 'Amazon review': 1.75, 'DCNN': 1.5,
	                      'SVM': 1.5, 'ATAE-LSTM': 2.0, 'TC-LSTM': 2.0, 'TD-LSTM': 2.0, 'BERT': 1.65, 'ELMo': 1.65,
	                      'GPT': 1.65, 'LSTM': 1.65, 'Bi-LSTM': 1.65}

	ner = {'ner': 2.5, 'Recognition': 20, 'Entity ': 25, 'CRF': 2.0, 'HMM': 2.0, 'MEMM': 2.0, 'CVT': 2.0,
	       'BERT': 1.65, 'ID-CNN': 1.65, 'LSTM': 1.65, 'Bi-LSTM': 1.65}

	# Audio
	speech_recognition = {'audio': 25, 'audi': 25, 'voice': 25, 'recognition': 1.75, 'HMM': 1.65, 'GMM': 1.75,
	                      'CD': 1.5, 'DNN': 1.5, 'HTK': 1.75, 'Kaldi': 1.75, 'Sphinx': 1.75, 'CTC': 1.65,
	                      'End-to-End': 1.65, 'LSTM': 1.5, 'FSMN': 1.75, 'RNN': 1.5, 'GRU': 1.65, 'DFCNN': 1.75,
	                      'DFSMN': 1.75, 'CBHG': 1.75, 'seq2seq': 1.65, 'aishell': 1.75, 'primewords': 1.75,
	                      'thchs-30': 1.75, 'st-cmd': 1.75}

	cv_dit = {'image_classification': [image_classification], 'object_localization': [object_localization],
	          'object_detection': [object_detection],
	          'object_recognition': [object_recognition], 'semantic_segmentation': [semantic_segmentation],
	          'object_tracking': [object_tracking], 'instance_segmentation': [instance_segmentation]}
	nlp_dit = {'text_classification': [text_classification], 'machine_translation': [machine_translation],
	           'sentiment_analysis': [sentiment_analysis], 'ner': [ner]}
	audio_dit = {'speech_recognition':[speech_recognition]}

	def grade_cv(text, cv_dit):
		ic_grade = 0.0
		cv_dit['image_classification'].append(ic_grade)
		ol_grade = 0.0
		cv_dit['object_localization'].append(ol_grade)
		od_grade = 0.0
		cv_dit['object_detection'].append(od_grade)
		or_grade = 0.0
		cv_dit['object_recognition'].append(or_grade)
		ss_grade = 0.0
		cv_dit['semantic_segmentation'].append(ss_grade)
		ot_grade = 0.0
		cv_dit['object_tracking'].append(ot_grade)
		is_grade = 0.0
		cv_dit['instance_segmentation'].append(is_grade)

		for cv in cv_dit.keys():
			task_dic = cv_dit[cv][0]
			sum = 0.0
			for key in task_dic.keys():
				sum += task_dic[key]
				if text.lower() in key.lower():
					cv_dit[cv][1] += task_dic[key]
			cv_dit[cv][1] /= sum
		return  cv_dit

	def grade_nlp(text, nlp_dit):
		tc_grade = 0.0
		nlp_dit['text_classification'].append(tc_grade)
		mt_grade = 0.0
		nlp_dit['machine_translation'].append(mt_grade)
		sa_grade = 0.0
		nlp_dit['sentiment_analysis'].append(sa_grade)
		ner_grade = 0.0
		nlp_dit['ner'].append(ner_grade)

		for nlp in nlp_dit.keys():
			task_dic = nlp_dit[nlp][0]
			sum = 0.0
			for key in task_dic.keys():
				sum += task_dic[key]
				if text.lower() in key.lower():
					nlp_dit[nlp][1] += task_dic[key]
			nlp_dit[nlp][1] /= sum

		return  nlp_dit

	def grade_audi(text, audio_dit):

		sr_grade = 0.0
		sum = 0.0
		audio_dit['speech_recognition'].append(sr_grade)
		for key in speech_recognition.keys():
			sum += speech_recognition[key]
			if text.lower() in key.lower():
				audio_dit['speech_recognition'][1] += speech_recognition[key]
		audio_dit['speech_recognition'][1] /= sum
		return  audio_dit

	cv_grade = grade_cv(text, cv_dit)
	nlp_grade = grade_nlp(text, nlp_dit)
	aud_grade = grade_audi(text, audio_dit)

	return cv_grade, nlp_grade, aud_grade

def process(url, project, output):
	stop_words = set(stopwords.words('english'))
	stop_words.add('I')
	stop_words.add('You')
	stop_words.add('An')
	stop_words.add('ask')

	task_dic = {'image_classification': [0.0], 'object_localization': [0.0], 'object_detection': [0.0],
	            'object_recognition': [0.0], 'semantic_segmentation': [0.0],
	            'object_tracking': [0.0], 'instance_segmentation': [0.0], 'text_classification': [0.0],
	            'machine_translation': [0.0], 'sentiment_analysis': [0.0], 'ner': [0.0], 'speech_recognition': [0.0]}

	datasets = {'image': 0, 'text': 0, 'audio': 0, 'vedio': 0, 'FFHQ': 0, 'OpenImages': 0, 'tencent': 0,
	            'Youtube': 0, 'MNIST': 0, 'Fashion-MNIST': 0,
	            'GQA': 0, 'BDD100K': 0, 'HighD': 0, 'HD1K Benchmark Suite': 0, 'Comma 2k19': 0, 'VQA': 0,
	            'ApolloScape': 0, 'nuScenes': 0, 'MURA': 0, 'Synscapes': 0, 'fastMRI': 0, 'Mapillary Vistas': 0,
	            'Places2': 0, 'COCO': 0, 'ImageNet': 0, 'CIFAR-10': 0, 'CIFAR-100': 0, 'tinyImageNet': 0,
	            'CoPhIR': 0, 'SQuAD': 0, 'MultiNLI': 0, 'CoQA': 0, 'Spider': 0, 'HotpotQA': 0, 'Quora': 0,
	            'Yelp': 0,
	            'Facebook bAbI': 0, 'MS MARCO': 0, 'Yahoo': 0, 'Sogou': 0, 'DBPedia': 0,
	            'IMDB': 0, 'DeepMind Q&A': 0, 'Mozilla Common Voice': 0, 'NSynth': 0,
	            'Google Audioset': 0, 'LibriSpeech': 0}

	models = {'CNN': 0, 'vgg': 0, 'inception': 0, 'AlexNet': 0, 'ZFNet': 0, 'GoogLeNet': 0, 'ResNet': 0, 'DenseNet': 0,
	          'ENet': 0, 'BN-NiN': 0, 'NIN':0, 'SegNet': 0, 'FCN': 0, 'rcnn':0, 'RefineNet': 0, 'Fast RCNN': 0, 'fast-rcnn':0,
	          'Faster RCNN': 0, 'faster-rcnn':0, 'MTCNN':0, 'GAN':0, 'DAE':0, 'VAE':0, 'DRN':0, 'residual':0, 'NTM':0,
	          'YOLO': 0, 'SSD': 0, 'SPP': 0, 'RNN': 0, 'FastText': 0, 'BERT': 0, 'ELMo': 0, 'GPT': 0, 'ULMFiT': 0,
	          'GCNN': 0, 'LSTM': 0, 'DCNN': 0, 'SVM': 0, 'ATAE-LSTM': 0, 'TC-LSTM': 0, 'RBF':0, 'FFNN':0, 'HN':0, 'BM':0,
	          'HMM': 0, 'GMM': 0, 'DNN': 0, 'HTK': 0, 'Kaldi': 0, 'Sphinx': 0, 'CTC': 0, 'End-to-End': 0,
	          'FSMN': 0, 'GRU': 0, 'DFCNN': 0, 'DFSMN': 0, 'CBHG': 0, 'seq2seq': 0, 'aishell': 0, 'primewords': 0,
	          'thchs-30': 0, 'st-cmd': 0, 'Bi-LSTM': 0, 'BiLSTM':0, 'RBM':0, 'LeNet':0}

	possible_model = ''

	for line in project:
		line = re.sub(',.?!-=+', '', line.lower())
		word_tokens = word_tokenize(line)

		filtered_sentence = [w for w in word_tokens if not w in stop_words]

		for text in filtered_sentence:

			# tasks
			cv_grade, nlp_grade, aud_grade = tasks_jud(text)
			for key in cv_grade.keys():
				task_dic[key][0] += cv_grade[key][1]
				task_dic[key].append('image')
			for key in nlp_grade.keys():
				task_dic[key][0] += nlp_grade[key][1]
				task_dic[key].append('text')
			for key in aud_grade.keys():
				task_dic[key][0] += aud_grade[key][1]
				task_dic[key].append('audio')
			# datasets
			for dataset in datasets:
				for single_word in dataset.split(' '):
					if text.lower() == single_word.lower():
						datasets[dataset] += 1
			# models
			if text.isupper():
				print(text)
				possible_model = possible_model+' '+text+','
			for key in models.keys():
				if text.lower() == key.lower():
					models[key] += 1

	# classify task
	baseline = 0.0
	target_task = 'none'
	dataset_pre = 'none'
	for key in task_dic.keys():
		if task_dic[key][0] > baseline:
			baseline = task_dic[key][0]
			target_task = key
			dataset_pre = task_dic[key][1]

	# classify datasets
	target_data_li = [dataset_pre]
	for key in datasets:
		if datasets[key] > 0 and key != dataset_pre:
			target_data_li.append(key)

	target_data = ', '.join(target_data_li)

	# classify models
	baseline_3 = []
	target_model_li = []
	for key in models:
		if models[key] > 0:
			baseline_3.append(models[key])
			target_model_li.append(key)

	target_model = ', '.join(target_model_li)

	with open(output, 'a') as f:
		csv_write = csv.writer(f)
		data_row = [url, target_task, target_data, target_model+','+possible_model]
		csv_write.writerow(data_row)
		f.close()
	return None

