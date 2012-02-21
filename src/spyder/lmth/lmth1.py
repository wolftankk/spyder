# -*- coding: utf-8 -*- 
# Created by Luc Gong
# Screw these copy and pasters
# Last edited 2012-2-15 22:21:17
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

import lmth

def set_encoding(code_str):
    lmth.code_str = code_str
    lmth.url_cache = {}

class Urls(object):

    def __init__(self, urls):
        self.urls = urls

    def __iter__(self):
        return self.urls.__iter__()

    def __len__(self):
        return len(self.urls)

    def __str__(self):
        return '\n'.join(str(u) for u in self)

    def __repr__(self):
        return self.__str__()

    def __getitem__(self, idx):
        if isinstance(idx, slice):
            indices = idx.indices(len(self))
            return Urls([Url(self[i].url, self[i].code_str) for i in xrange(*indices)])
        return self.urls[idx]

    @classmethod
    def from_indice(cls, prefix, begin, end, width=1, code_str='utf-8'):
        urls = []
        format_str = '%s%0' + str(width) + 'd'
        for idx in range(begin, end+1):
            urls.append(format_str %(prefix, idx))
        return Urls([Url(u, code_str) for u in urls])
    
    @classmethod
    def from_postfixes(cls, prefix, postfixes, code_str='utf-8'):
        urls = (prefix+str(pf) for pf in postfixes)
        return Urls([Url(u, code_str) for u in urls])

class Path(object):

    def __init__(self, file_path):
        self.file_path = file_path

    def __str__(self):
        return self.file_path

    def __repr__(self):
        return self.file_path

    def elem(self, path):
        lmth.is_local = True
        root = lmth.__root_elem__(self.file_path)
        result = lmth.get_elem_elem(root, path)
        lmth.is_local = False
        return Elem(result)

    def elems(self, path):
        lmth.is_local = True
        root = lmth.__root_elem__(self.file_path)
        results = [Elem(e) for e in lmth.get_elem_elems(root, path)]
        lmth.is_local = False
        return Elems(results)

    def attr(self, path):
        lmth.is_local = True
        root = lmth.__root_elem__(self.file_path)
        elem = lmth.get_elem_elem(root, path)
        lmth.is_local = False
        return Attr(lmth.get_elem_attrs(elem, path))

    def attrs(self, path):
        lmth.is_local = True
        root = lmth.__root_elem__(self.file_path)
        elems = lmth.get_elem_elems(root, path)
        lmth.is_local = False
        return Attrs([Attr(a) for a in lmth.get_elems_attrs(elems, path)])


class Url(object):

    def __init__(self, url, code_str = 'utf-8'):
        self.url = url
        self.code_str = code_str

    def __str__(self):
        return self.url

    def __repr__(self):
        return self.url

    def elem(self, path):
        root = lmth.__root_elem__(self.url, self.code_str)
        result = lmth.get_elem_elem(root, path)
        return Elem(result)

    def elems(self, path):
        root = lmth.__root_elem__(self.url, self.code_str)
        results = [Elem(e) for e in lmth.get_elem_elems(root, path)]
        return Elems(results)

    def attr(self, path):
        root = lmth.__root_elem__(self.url, self.code_str)
        elem = lmth.get_elem_elem(root, path)
        return Attr(lmth.get_elem_attrs(elem, path))

    def attrs(self, path):
        root = lmth.__root_elem__(self.url, self.code_str)
        elems = lmth.get_elem_elems(root, path)
        return Attrs([Attr(a) for a in lmth.get_elems_attrs(elems, path)])

class Elem(object):

    def __init__(self, ele):
        self.ele = ele
        # TODO: change to lazy form later
        self.text = ele.text

    def __str__(self):
        return str(self.ele)

    def __repr__(self):
        return self.__str__()

    def elem(self, path):
        result = lmth.get_elem_elem(self.ele, path)
        return Elem(result)

    def elems(self, path):
        results = [Elem(e) for e in lmth.get_elem_elems(self.ele, path)]
        return Elems(results)

    def attr(self, path):
        elem = self.ele
        path = path.strip()
        if path[0] == '[' and path[-1] == ']':
            elem = lmth.get_elem_elem(self.ele, path)
        attr = lmth.get_elem_attrs(elem, path)
        return Attr(attr)

    def attrs(self, path):
        path = path.strip()
        if path[0] == '[' and path[-1] == ']':
            results = [self.elem]
        else:
            results = lmth.get_elem_elems(self.ele, path)
        return Attrs([Attr(a) for a in lmth.get_elems_attrs(results, path)])

class Elems(object):

    def __init__(self, eles):
        self.eles = eles
        # TODO: change to lazy form later
        self.texts = [e.ele.text for e in eles]

    def __str__(self):
        return '[%s]' %(', '.join(str(e) for e in self.eles))

    def __repr__(self):
        return '[%s]' %(', '.join(e.__repr__() for e in self.eles))

    def __iter__(self):
        return self.eles.__iter__()

    def __getitem__(self, idx):
        if isinstance(idx, slice):
            indices = idx.indices(len(self))
            return Elems([self.eles[i] for i in xrange(*indices)])
        return self.eles[idx]

    def __len__(self):
        return len(self.eles)

    def elems(self, path):
        els = [e.ele for e in self.eles]
        results = lmth.get_elems_elems(els, path)
        return Elems([Elem(r) for r in results])

    def attr(self, path):
        path = path.strip()
        if path[0] == '[' and path[-1] == ']':
            els = [e.ele for e in self.eles]
        else:
            els = [lmth.get_elem_elem(e.ele, path) for e in self.eles]
            els = [e for e in els if e]
        return Attrs([Attr(a) for a in lmth.get_elems_attrs(els, path)])

    def attrs(self, path):
        path = path.strip()
        els = [e.ele for e in self.eles]
        if not (path[0] == '[' and path[-1] == ']'):
            els = lmth.get_elems_elems(els, path)
        return Attrs([Attr(a) for a in lmth.get_elems_attrs(els, path)])

class Attr(object):

    def __init__(self, attrs):
        self.attrs = {}
        for key in sorted(attrs.iterkeys()):
            self.attrs[key if key!='#' else 'text'] = attrs[key]

    def __str__(self):
        return '{' + ', '.join(k + ':' + self[k].__str__() for k in sorted(self.attrs.iterkeys())) + '}'

    def __repr__(self):
        return '{' + ','.join(k + ':' + self[k].__repr__() for k in sorted(self.attrs.iterkeys())) + '}'

    def __len__(self):
        return len(self.attrs)

    def __iter__(self):
        return iter(self.attrs)

    def __getitem__(self, attr_name):
        return self.attrs[attr_name]

    def __getattr__(self, attr_name):
        return self.attrs[attr_name]

class Attrs(object):

    def __init__(self, attrs_list):
        self.attrs_list = attrs_list

    def __str__(self):
        return '[' + ', '.join(str(a) for a in self) + ']'

    def __repr__(self):
        return '[' + ', '.join(repr(a) for a in self) + ']'

    def __len__(self):
        return len(self.attrs_list)

    def __iter__(self):
        return iter(self.attrs_list)

    def __getitem__(self, idx):
        if isinstance(idx, slice):
            indices = idx.indices(len(self))
            return Attrs([self.attrs_list[i] for i in xrange(*indices)])
        return self.attrs_list[idx]
