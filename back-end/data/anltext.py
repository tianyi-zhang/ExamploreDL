import warnings
warnings.simplefilter("ignore", UserWarning)
from bs4 import BeautifulSoup

def clean_html(source, f_out, url):
	soup = BeautifulSoup(source)
	f_out.write('===' * 20 + url + '\n' + 'begin' + '\n')
	table = soup.find('table', attrs={'class': 'files js-navigation-container js-active-navigation-container'})
	if table:
		a = table.find_all('a', attrs={'class': 'js-navigation-open'})
		a_commend  = table.find_all('a', attrs={'data-pjax': 'true'})
		for i,j in zip(a,a_commend):
			f_out.write(i.get('title'))
			f_out.write(j.get('title'))
			f_out.write('\n')
	else:
		print('not folders'+ url)
	art = soup.find('article')
	if art:
		p = art.find_all(['p','li','h1','h2','h3''h4','pre'])
		for j in p:
			f_out.write(j.get_text())
			f_out.write('\n')
	else:
		print('not readme'+ url)
	f_out.write('end' +'\n' + '==='*20+'\n')


