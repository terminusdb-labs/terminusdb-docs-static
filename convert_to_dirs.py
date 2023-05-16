#!/usr/bin/env python3
import glob
import os

def main():
    files = glob.glob('out/*.html')
    for file in files:
        if file == 'out/index.html':
            continue
        folder_name = file[4:-5]
        dest_folder = f'out/{folder_name}'
        os.mkdir(dest_folder)
        os.rename(file, f'{dest_folder}/index.html')


if __name__ == '__main__':
    main()
