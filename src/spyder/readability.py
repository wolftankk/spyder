#coding: utf-8

'''
格式化页面

现在文章图片 这里直接获得
'''
import re
import lxml
from spyder.pyquery import PyQuery as pq
from urlparse import urljoin
from libs.utils import safestr, safeunicode

__all__ = [
    'Readability'
]

class Readability:
    regexps = {
	'unlikelyCandidates': re.compile("combx|comment|community|disqus|extra|foot|header|menu|"
	    "remark|rss|shoutbox|sidebar|sponsor|ad-break|agegate|"
	    "pagination|pager|popup|tweet|twitter",re.I),
	'okMaybeItsACandidate': re.compile("and|article|body|column|main|shadow", re.I),
	'positive': re.compile("article|body|content|entry|hentry|main|page|pagination|post|text|"
	    "blog|story",re.I),
	'negative': re.compile("combx|comment|com|contact|foot|footer|footnote|masthead|media|"
	    "meta|outbrain|promo|related|scroll|shoutbox|sidebar|sponsor|"
	    "shopping|tags|tool|widget", re.I),
	'extraneous': re.compile("print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|"
	    "sign|single",re.I),
	'divToPElements': re.compile("<(a|blockquote|dl|div|img|ol|p|pre|table|ul)",re.I),
	'replaceBrs': re.compile("(<br[^>]*>[ \n\r\t]*){2,}",re.I),
	'replaceFonts': re.compile("<(/?)font[^>]*>",re.I),
	'trim': re.compile("^\s+|\s+$",re.I),
	'normalize': re.compile("\s{2,}",re.I),
	'killBreaks': re.compile("(<br\s*/?>(\s|&nbsp;?)*)+",re.I),
	'videos': re.compile("http://(www\.)?(youtube|vimeo)\.com",re.I),
	'skipFootnoteLink': re.compile("^\s*(\[?[a-z0-9]{1,2}\]?|^|edit|citation needed)\s*$",re.I),
	'nextLink': re.compile("(next|weiter|continue|>([^\|]|$)|»([^\|]|$))",re.I),
	'prevLink': re.compile("(prev|earl|old|new|<|«)",re.I),
	"spp_reg" : re.compile(u"""[　]*""", re.I|re.M|re.S)
    }

    images = []

    '''
    image 保留字段
    '''
    image_attr = ["src", "alt", "width", "height"]

    def __init__(self, content, baseurl, filters):
	self.content = content;

	self.baseurl = baseurl

	self.filters = filters
	
	self.replaceBrs();
	self.replaceFonts();
	self.replace_spp();

	self.specialFilter();

	self.getHtml();

	self.clean_comments()
	self.removeScript();
	self.removeStyle();
	self.removeLink();

	#移除所有 a 标记
	for e in self.tags(self.html, "a"):
	    self.drop_anchor(e)
    
	try:
	    for e in self.tags(self.html, "hr", "font", "p", "span", "div", "ul", "li", "from", "iframe", "center"):
		self.clean_attributes(e)
		self.removeEmptyEl(e)
	except:
	    pass

	for e in self.tags(self.html, "img"):
	    self.processingImage(e)

    def getContent(self):
	content = self.html.html();

	content = content.replace("<body>", "");
	content = content.replace("</body>", "");

	return content

    def replaceBrs(self):
	try:
	    self.content = self.regexps["replaceBrs"].sub("<p></p>", self.content)
	    self.content = self.regexps["killBreaks"].sub("<br />", self.content)
	except:
	    pass

    def replace_spp(self):
	try:
	    self.content = self.content.strip()
	    self.content = self.regexps["spp_reg"].sub("", self.content)
	    self.content = self.regexps["trim"].sub("", self.content)
	    self.content = self.regexps["normalize"].sub("", self.content)
	except:
	    pass

    def replaceFonts(self):
	try:
	    self.content = self.regexps["replaceFonts"].sub("<\g<1>span>", self.content)
	except:
	    pass


    def getHtml(self):
	#自动加上html标记
	if self.content.find("<html>") == -1:
	    content = "<html><body>" + self.content + "</body></html>"
	    self.html = pq(content)


    @staticmethod
    def tags(node, *tag_names):
	for tag_name in tag_names:
	    for e in node.find(tag_name):
		yield e

    def removeScript(self):
	self.html.remove("script");

    def removeStyle(self):
	self.html.remove("style");

    def removeLink(self):
	self.html.remove("link");

    def removeEmptyEl(self, element):
        innerText = element.text
        if innerText is None:
        	element.getparent().remove(element)

    def clean_comments(self):
	def clean_comment(i, element):
	    if (isinstance(element, lxml.html.HtmlComment)):
		element.getparent().remove(element)

	self.html.children().each(clean_comment)

    def drop_anchor(self, element):
	for k in element.attrib:
	    del element.attrib[k]
	try:
	    element.drop_tag()
	except:
	    element.tag = "span"
	    pass


    def clean_attributes(self, element):
	if element.tag == "font":
	    element.tag = "span"

	if element.tag == "center":
	    element.tag = "div"

	for att in ["color", "width", "height", "background", "style", "class", "id", "face"]:
	    if element.get(att) is not None:
		del element.attrib[att]


    def getImages(self):
	return self.images;

    def specialFilter(self):
        if len(self.filters) > 0:
            for filter in self.filters:
                rule = filter;
                rule = rule.replace('(*)', '(.+)?')
                if isinstance(self.content, unicode):
                        rule = safeunicode(rule)
                else:
                        rule = safestr(rule)
                self.content = re.compile(rule, re.I).sub("", self.content);

    def processingImage(self, image):
	#首先处理图片层
	parent = image.getparent()

	if parent is not None and parent.tag is "a":
	    parentAttrs = parent.attrib
	    for k in parentAttrs:
		del parentAttrs[k]
	    parent.drop_tag()

	imgAttrs = image.attrib
	need_deleted_attrs = list(set(imgAttrs) - set(self.image_attr))
	if need_deleted_attrs:
	    for k in need_deleted_attrs:
		del imgAttrs[k]

	image_src = image.get("src");
	'''
	这里的图片url也要修正
	'''
	image_src = urljoin(self.baseurl, image_src)
	image.set("src", image_src)
	self.images.append(image_src)

'''
def specialFilter( content):
    if len(self.articleRule.filters) > 0:
	for filter in self.articleRule.filters:
	    element = getElementData(content, filter, True)
	    if element is not None:
		element.getparent().remove(element);
'''




