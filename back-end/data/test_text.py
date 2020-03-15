from text_class import process
if __name__ == "__main__":
	count = 0
	with open('cleaned.txt','r') as f:
		lines = f.readlines()
		for line in lines:
			if '============================================================https:' in line:
				count += 1
				print(count)
				project = []
				url = line.split('============================================================')[1]
				url = url.replace('\n', '')
				project.append(url.replace('_', ' ').split('/')[-1])
				print(url)
			elif 'begin\n' in line:
				continue
			elif 'end\n' in line:
				process(url,project,'output.csv')
			project.append(line)
		f.close()