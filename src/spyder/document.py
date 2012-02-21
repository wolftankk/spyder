#coding=utf-8

from lmth.lmth1 import Url
from pyquery import PyQuery as pq
d = pq("<html></html>")

if __name__ == "__main__":
	#news list
	url = "http://www.265g.com/chanye/industry/"
	list = Url(url, "gbk").elems("div[class=cont_list]")[-1].elems("li")
	for k in list:
		#print k
		date = k.elem("em")
		url = k.elem("a")	

		#last content
		print(d(str(date)).text()), url.attr("a[@href]"), d(str(url)).text()

	#new page test
	#url = "http://www.265g.com/chanye/industry/184336.html"
	#page = Url(url, "gbk").elems("div[class=box02 mar_t0 mar_b5]")[-1]
	#title = page.elem("h3")
	#print title

	#article = page.elems("div[class=contF]")
	#print article

	#pag2 = page.elems("div[class=pag2]")
	#print pag2
