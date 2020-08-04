from Bio.Align.Applications import MafftCommandline
import json
import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__,template_folder='template',static_folder='static')


@app.route('/')
def index():
	return render_template('sankey.html')


@app.route('/_alignment/', methods=['GET','POST'])
def _alignment():
	idList = request.get_data().decode("utf-8") 
	idList = idList.strip('"')
	idList = idList.split(",")

	typedic = {'Convolution': "C",
			'Deconvolution': "Y",
			'Max Pooling': "M",
			'Average Pooling': "A",
			'LSTM': "L",
			'GRU': "G",
			'BiRNN': "B",
			'RNN': "N",
			'Input': "I",
			'Dense': "D",
			'CRF': "C",
			'Embedding': "Q",
			'Flatten': "F",
			'Dropout': "P",
			'Attention': "T",
			'Normalization': "Z",
			'Argmax': "O",					
			'ReLu': "R",
			'Sigmoid': "S",
			'Softmax': "X",
			"Linear": "K",
			"tanh": 'J',
			'Cross Entropy': "E",
			'Reduce Mean': "V",
			'L2': "W",
			'CTC': "H",
			'MSE': "U"
			}
	with open("./static/data.json", "r") as datajson:
		alldata = json.loads(datajson.read())
		with open("net.txt", "w") as outfile:
			for key in alldata:
				if key in idList:
					outfile.write(">"+key+'\n')
					for layer in alldata[key]['layers']:
						outfile.write(""+typedic[alldata[key]['layers'][layer]['type']])
						for argname in alldata[key]['layers'][layer]["args"]:
							if 'activation' in argname:
								tar = alldata[key]['layers'][layer]["args"][argname]
								if isinstance(tar, str):
									if 'relu' in tar:
										outfile.write('R')
									elif 'softmax' in tar:
										outfile.write('X')
									elif 'sigmoid' in tar:
										outfile.write('S')
									elif 'linear' in tar:
										outfile.write('K')
									elif 'tanh' in tar:
										outfile.write('J')
					outfile.write('\n')
				else:
					continue
			outfile.close()
		datajson.close()
	os.system('mafft --localpair --text net.txt > out.txt')
	with open('out.txt', 'r') as alifile:
		data = {}
		for line in alifile:
			if '>' in line:
				dataKey = line.split(">")[1]
				data[dataKey] = 'I'				
			else:
				data[dataKey] = data[dataKey]+line.split('\n')[0]
		response = app.response_class(
			response=json.dumps(data),
			status=200,
			mimetype='application/json'
		)
		return response

if __name__ == "__main__":
	app.run(debug=True)
