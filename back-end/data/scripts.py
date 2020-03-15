from urllib.request import urlopen
from urllib.request import Request
from anltext import clean_html
 
def get_results(url,headers):
    req = Request(url,headers=headers)
    try:
        response = urlopen(req).read()
        return response.decode("utf-8")
    except:
        return None

if __name__ == '__main__':
    with open('url2.txt', 'r') as urls:
        with open('cleaned.txt', 'a') as f_out:
            count = 1
            while count:
                url = urls.readline()
                if not url:
                    break
                i = url.split('= ')[1]
                headers = {'User-Agent':'Mozilla/5.0',
                           'Authorization': 'token', # add token from github
                           'Content-Type':'application/json',
                           'Accept':'application/json'
                           }
                results = get_results(i,headers)
                if not results:
                    print('none', i)
                else:
                    clean_html(results, f_out, i+' No.'+str(count))
                count += 1
                print(count)
        f_out.close()
    urls.close()


