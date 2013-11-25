#coding: utf-9
'''
Local variables:
tab-width: 4
c-basic-offset: 4
End:
vim600: sw=4 ts=8
'''

import sys
from StringIO import StringIO

class Logger(object):
    def __init__(self):
	self.log = StringIO()
	self.terminal = sys.stdout

    def write(self, message):
	#self.terminal.write(message)
	self.log.write(safestr(message));

    def getvalue(self):
	self.terminal.write(self.log.getvalue());
