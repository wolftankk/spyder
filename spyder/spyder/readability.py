#coding: utf-8

'''
格式化页面
'''
import re
import lxml

__all__ = [
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

    def __init__(self, content):
	self.content = content;
	#origin_content = content
	#self.specialFilter(content)
	#self.clean_comments(content)
	#self.removeScript(content)
	#try:
	#    for e in self.tags(content, "hr", "font", "p", "span", "div", "ul", "li", "from", "iframe", "center"):
	#	self.clean_attributes(e)

	#except:
	#    pass

	#for e in self.tags(content, "a"):
	#    self.drop_anchor(e)


    @staticmethod
    def tags(node, *tag_names):
	for tag_name in tag_names:
	    for e in node.find(tag_name):
		yield e

    def removeScript(self):
	self.content = self.content.remove("script");

    def removeStyle(self):
	self.content = self.content.remove("style");

    def removeLink(self):
	self.content = self.content.remove("link");

    def drop_anchor(self, element):
	for k in element.attrib:
	    del element.attrib[k]
	try:
	    element.drop_tag()
	except:
	    pass

    def clean_comments(self):
	def clean_comment(i, element):
	    if (isinstance(element, lxml.html.HtmlComment)):
		element.getparent().remove(element)

	self.content.children().each(clean_comment)

    def clean_attributes(self):
	if self.content.tag == "font":
	    self.content.tag = "span"

	if self.content.tag == "center":
	    self.content.tag = "div"

	for att in ["color", "width", "height", "background", "style", "class", "id", "face"]:
	    if self.content.get(att) is not None:
		del self.content.attrib[att]

'''
def specialFilter( content):
    if len(self.articleRule.filters) > 0:
	for filter in self.articleRule.filters:
	    element = getElementData(content, filter, True)
	    if element is not None:
		element.getparent().remove(element);
'''




