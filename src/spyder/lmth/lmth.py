# -*- coding: utf-8 -*- 
# Created by Luc Gong
# Screw these copy and pasters
# Last edited 2012-2-15 22:20:54
"""
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE, DAMMIT.
"""

import os
import os.path as path
import urllib2
import codecs
import re
from BeautifulSoup import BeautifulSoup as Soup

class Hattr(object):

    def __init__(self, name, alias):
        self.name = name
        self.alias = alias

    def __str__(self):
        return 'name:' + self.name + ', alias:' + self.alias

    def __repr__(self):
        return self.__str__()

    @classmethod
    def from_path(cls, path):
        alias_l = path.find('(')
        alias_r = path.find(')')
        if alias_l == -1 and alias_r == -1:
            # consider alias as name when no alias
            return Hattr(path, 'text' if path=='#' else path)
        elif alias_l != -1 and alias_r != -1:
            return Hattr(path[:alias_l], path[alias_l+1:alias_r])
        else:
            raise Exception('Invalid Hattr value : ' + path)

class Hpart(object):

    def __init__(self, name, props, attrs):
        self.name = name
        self.props = props
        self.attrs = attrs

    @classmethod
    def from_path(cls, part):
        part = part.strip()
        idx = part.find('[')
        if idx == -1:
            return Hpart(part, {}, [])
        else:
            name = part[:idx]
            # [a=b] -> a=b
            propstr = part[idx+1:-1]
            props = (s.strip() for s in propstr.split(','))
            prop_dict = {}
            attr_list = []
            for prop in props:
                if prop.startswith('@'):
                    attr_list.append(Hattr.from_path(prop[1:]))
                else:
                    # add existed attr here
                    values = [v.strip() for v in prop.split('=')]
                    exp = values[1]
                    if exp.startswith('{') and exp.endswith('}'):
                        prop_dict[values[0]] = re.compile(values[1][1:-1])
                    else:
                        prop_dict[values[0]] = values[1]
            return Hpart(name, prop_dict, attr_list)

    def __str__(self):
        return 'name:%s, props:%s, attrs:%s' %(self.name, self.props, self.attrs)
    
    def __repr__(self):
        return self.__str__()

class Hpath(object):
    def __init__(self, hparts):
        self.hparts = hparts

    @classmethod
    def from_path(cls, path):
        hparts = []
        parts = path.split('/')
        for part in parts:
            hparts.append(Hpart.from_path(part))
        return Hpath(hparts)

    def __len__(self):
        return len(self.hparts)

    def __iter__(self):
        return self.hparts.__iter__()

    def __getitem__(self, idx):
        return self.hparts[idx]

    def __str__(self):
        return '\n'.join(str(hpart) for hpart in self.hparts)
    
    def __repr__(self):
        return self.__str__()

url_cache = {}
cache_size = 32

def __need_refresh_cache__(url, refresh):
    return refresh or not url_cache.has_key(url)

def __need_shrink_cache__(url):
    return not url_cache.has_key(url) and len(url_cache) > cache_size;

def __shrink_cache__():
    pop_time = len(url_cache)/2
    while pop_time:
        url_cache.popitem()
        pop_time-=1

is_local = False

def __root_elem__(url, code_str = 'utf-8' ,refresh = False):
    if __need_refresh_cache__((url, code_str), refresh):
        if __need_shrink_cache__((url, code_str)):
            __shrink_cache__()
        if is_local:
            with codecs.open(url, 'r', 'utf-8') as fr:
                html = fr.read()
        else:
            html = urllib2.urlopen(url).read()
        url_cache[(url, code_str)] = Soup(html, fromEncoding = code_str)
    return url_cache[(url, code_str)]

def get_elem_elem(elem, path):
    if not elem:
        return None
    hpath = Hpath.from_path(path)
    for hpart in hpath:
        elem = elem.find(hpart.name, hpart.props)
        if not elem:
            return None
    return elem

def get_elems_elems(elems, path):
    hpath = Hpath.from_path(path)
    for hpart in hpath:
        tmp = []
        # pop <=> reverse
        elems.reverse()
        while elems:
            elem = elems.pop()
            tmp.extend(elem.findAll(hpart.name, hpart.props))
        if not tmp:
            return []
        else:
            elems = tmp
    return elems

def get_elem_elems(elem, path):
    elems = [elem]
    return get_elems_elems(elems, path)

def get_elem_attrs(elem, path):
    if not elem:
        return {}
    hpath = Hpath.from_path(path)
    if not hpath[-1].attrs:
        return {}
    results = {}
    for attr in hpath[-1].attrs:
        attr_name = attr.name
        if attr_name == '#':
            results[attr.alias] = elem.text
        else:
            results[attr.alias] = elem.get(attr_name)
    return results

def get_elems_attrs(elems, path):
    if not elems:
        return []
    hpath = Hpath.from_path(path)
    if not hpath[-1].attrs:
        return []
    results = []
    for elem in elems:
        attr_dict = {}
        for attr in hpath[-1].attrs:
            attr_name = attr.name
            if attr_name == '#':
                attr_dict[attr.alias] = elem.text
            else:
                attr_dict[attr.alias] = elem.get(attr_name)
        results.append(attr_dict)
    return results
