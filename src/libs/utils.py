#coding: utf-8

import itertools

__all__ = ['safestr', 'safeunicode', 'ThreadedDict', 'threadeddict', 'storage', 'Storage', 'iters', 'iterbetter', 'IterBetter', "now"]

import sys
from threading import local as threadlocal

def now():
    return int(time.time())

class Storage(dict):
    """
    A Storage object is like a dictionary except `obj.foo` can be used
    in addition to `obj['foo']`.
    >>> o = storage(a=1)
    >>> o.a
    1
    >>> o['a']
    1
    >>> o.a = 2
    >>> o['a']
    2
    >>> del o.a
    >>> o.a
    Traceback (most recent call last):
    ...
    AttributeError: 'a'
    """
    def __getattr__(self, key):
        try:
            return self[key]
        except KeyError, k:
            raise AttributeError, k
    
    def __setattr__(self, key, value):
        self[key] = value
    
    def __delattr__(self, key):
        try:
            del self[key]
        except KeyError, k:
            raise AttributeError, k
    
    def __repr__(self):
        return '<Storage ' + dict.__repr__(self) + '>'

storage = Storage

iters = [list, tuple]
import __builtin__
if hasattr(__builtin__, 'set'):
    iters.append(set)
if hasattr(__builtin__, 'frozenset'):
    iters.append(set)
if sys.version_info < (2,6): # sets module deprecated in 2.6
    try:
        from sets import Set
        iters.append(Set)
    except ImportError:
        pass
    
class _hack(tuple): pass
iters = _hack(iters)
iters.__doc__ = ""

class ThreadedDict(threadlocal):
    """
    >>> d = ThreadedDict()
    >>> d.x = 1
    >>> d.x
    >>> 1
    >>> import thread
    >>> def f(): d.x = 2

    >>> t = threading.Thread(target=f)
    >>> t.start()
    >>> t.join();
    >>> d.x
    >>> 1
    """
    _instance = set()

    def __init__(self):
	ThreadedDict._instance.add(self)

    def __del__(self):
	ThreadedDict._instance.remove(self)

    def __hash__(self):
	return id(self)

    def clear_all():
	for t in list(ThreadedDict._instance):
	    t.clear()

    clear_all = staticmethod(clear_all)
    def __getitem__(self, key):
	return self.__dict__[key]

    def __setitem__(self, key, value):
	self.__dict__[key] = value

    def __delitem__(self, key):
	del self.__dict__[key]

    def __contains__(self, key):
	return key in self.__dict__

    has_key = __contains__

    def clear(self):
	self.__dict__.clear()

    def copy(self):
	return self.__dict__.copy()

    def get(self, key, default=None):
	return self.__dict__.get(key, default)

    def items(self):
	return self.__dict__.items()

    def iteritems(self):
	return self.__dict__.iteritems()

    def keys(self):
	return self.__dict__.keys()

    def iterkeys(self):
	return self.__dict__.iterkeys()

    iter = iterkeys

    def values(self):
	return self.__dict__.values()

    def itervalues(self):
	return self.__dict__.itervalues()

    def pop(self, key, *args):
	return self.__dict__.pop(key, *args)

    def popitem(self):
	return self.__dict__.popitem()

    def setdefault(self, key, default=None):
	return self.__dict__.setdefault(key, default)

    def update(self, *args, **kwargs):
	self.__dict__.update(*args, **kwargs)

    def __repr__(self):
	return '<ThreadedDict %r>' % self.__dict__

    __str__ = __repr__

threadeddict = ThreadedDict

def safestr(obj, encoding="utf-8"):
    if isinstance(obj, unicode):
	return obj.encode(encoding)
    elif isinstance(obj, str):
	return obj
    elif hasattr(obj, 'next'):
	return itertools.imap(safestr, obj)
    else:
	return str(obj)

def safeunicode(obj, encoding='utf-8'):
    t = type(obj)
    if t is unicode:
	return obj
    elif t is str:
	return obj.decode(encoding)
    elif t in [int, float, bool]:
	return unicode(t)
    elif hasattr(obj, '__unicode') or isinstance(obj, unicode):
	return unicode(obj)
    else:
	return str(obj).decode(encoding)


class IterBetter:
    def __init__(self, iterator):
        self.i, self.c = iterator, 0

    def __iter__(self):
        if hasattr(self, "_head"):
            yield self._head

        while 1:
            yield self.i.next()
            self.c += 1

    def __getitem__(self, i):
        #todo: slices
        if i < self.c:
            raise IndexError, "already passed "+str(i)
        try:
            while i > self.c:
                self.i.next()
                self.c += 1
            # now self.c == i
            self.c += 1
            return self.i.next()
        except StopIteration:
            raise IndexError, str(i)
            
    def __nonzero__(self):
        if hasattr(self, "__len__"):
            return len(self) != 0
        elif hasattr(self, "_head"):
            return True
        else:
            try:
                self._head = self.i.next()
            except StopIteration:
                return False
            else:
                return True

iterbetter = IterBetter
