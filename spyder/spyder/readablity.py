#coding: utf-8

'''
格式化页面
'''

import re

__all__ = [
    'readability'
]

regexps = {
    "replaceBrs" : re.compile("(<br[^>]*>[ \n\r\t]*){2,}", re.I),

}

def specialFilter(self, content):
    if len(self.articleRule.filters) > 0:
	for filter in self.articleRule.filters:
	    element = getElementData(content, filter, True)
	    if element is not None:
		element.getparent().remove(element);

def tags(self, node, *tag_names):
    for tag_name in tag_names:
	for e in node.find(tag_name):
	    yield e

def removeScript(self, content):
    if self.filterscript:
	content = content.remove("script");

def drop_anchor(self, element):
    for k in element.attrib:
	del element.attrib[k]
    try:
	element.drop_tag()
    except:
	pass

def clean_comments(self, content):
    def clean_comment(i, element):
	if (isinstance(element, lxml.html.HtmlComment)):
	    element.getparent().remove(element)

    content.children().each(clean_comment)

def clean_attributes(self, content):
    if content.tag == "font":
	content.tag = "span"

    if content.tag == "center":
	content.tag = "div"

    for att in ["color", "width", "height", "background", "style", "class", "id", "face"]:
	if content.get(att) is not None:
	    del content.attrib[att]

def readability(self, content):
    origin_content = content
    self.specialFilter(content)
    self.clean_comments(content)
    self.removeScript(content)
    try:
	for e in self.tags(content, "hr", "font", "p", "span", "div", "ul", "li", "from", "iframe", "center"):
	    self.clean_attributes(e)

    except:
	pass

    for e in self.tags(content, "a"):
	self.drop_anchor(e)

    return content
