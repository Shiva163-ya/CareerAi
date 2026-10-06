#!/usr/bin/env python
import os
import sys
from pathlib import Path

# Add the careerai directory to the Python path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from careerai.app import app

if __name__ == "__main__":
    app.run()
