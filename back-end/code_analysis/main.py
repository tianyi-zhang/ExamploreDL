from analyzer import traverse_dic
import json
import csv
if __name__ == "__main__":
	with open("/Users/mac/Desktop/R/backen/code_analysis/test_folder/data.json", "r") as exist_file:
		exist_json = json.load(exist_file)
		num_id = len(list(exist_json.keys())) + 1
		exist_file.close()

	with open('/Users/mac/Desktop/R/backen/code_analysis/projects.csv', newline='') as f:
		reader = csv.reader(f)
		data = list(reader)
		paras = data[num_id]
		print(num_id, paras)
		f.close()

	with open("/Users/mac/Desktop/R/backen/code_analysis/test_folder/data.json", "w") as outfile:
		paras_id = paras[0]
		paras_Project_Name = paras[1]
		paras_url = paras[2]
		paras_file_name = paras[3]
		paras_type = paras[6]
		dic = '/Users/mac/Desktop/R/backen/code_analysis/test_folder/' + paras_Project_Name
		paras = [paras_id, paras_Project_Name, paras_url, paras_file_name, paras_type]
		traveres_ob = traverse_dic(dic, paras, exist_json)
		model_dic = traveres_ob.traverse_files()
		print(model_dic[paras_id])

		json_object = json.dumps(model_dic, indent=4)
		outfile.write(json_object)
		outfile.write("\n")
		outfile.close()