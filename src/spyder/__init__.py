#coding: utf-8
import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

# major , minor, sub
VERSION = (2, 0, 0)

from web.models import Seed as Seed_Model
from web.models import Seed_log
from spyder.document import Grab

