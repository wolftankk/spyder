#coding: utf-8

import itertools

__all__ = ['safestr', 'safeunicode']

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
