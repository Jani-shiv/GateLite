#!/usr/bin/env python3
"""
Runner script for the 3D building generator.
Usage: python run_generator.py [--output OUTPUT_DIR] [--format FORMAT] [--sample]
"""

import sys
import os

# Add the generator to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from building_generator import main

if __name__ == "__main__":
    main()