from analyzer import traverse_dic
import json
if __name__ == "__main__":

	dic = '/Users/mac/Desktop/R/backen/code_analysis/test_folder'
	output_dic = {"Path": dic, "Tasks": ['cv'], "Dataset": [], "Models": {}}
	traveres_ob = traverse_dic(dic)
	model_dic = traveres_ob.traverse_files()
	print(model_dic)
	json_object = json.dumps(model_dic, indent=4)

	with open("/Users/mac/Desktop/R/backen/code_analysis/test_folder/model.json", "w") as outfile:
		outfile.write(json_object)
		outfile.close()