import browser
import io
import os

def set_files_from_obj():
    try:
        browser.self._brFiles = browser.self._brFilesObj.to_dict()
    except AttributeError:
        pass
set_files_from_obj()
browser.self._brSetFilesFromObj = set_files_from_obj

class PythonpadTextIOWrapper(io.IOBase):
    def __init__(self, filename, target_file, mode, newline=None):
        self.stream = io.StringIO(newline=newline)
        self.stream.write(target_file['body'])
        self.filename = filename
        self.target_file = target_file
        self.mode = mode
        if 'a' not in mode:
            self.stream.seek(0)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close()

    def __str__(self):
        return '<PythonpadTextIOWrapper name=\'%s\' mode=\'%s\' encoding=\'UTF-8\'>' % (self.filename, self.mode)

    def __repr__(self):
        return self.__str__()

    def __del__(self):
        return self.stream.__del__()

    def __iter__(self):
        return self.stream.__iter__()

    def __next__(self):
        return self.stream.__next__()

    def __dict__(self):
        return self.stream.__dict__()

    def __eq__(self, other):
        return self.stream.__eq__(other.stream)

    def __format__(self, format_spec):
        return self.stream.__format__(format_spec)

    def __ge__(self, other):
        return self.stream.__ge__(other.stream)

    def __gt__(self, other):
        return self.stream.__gt__(other.stream)

    def __le__(self, other):
        return self.stream.__le__(other.stream)

    def __lt__(self, other):
        return self.stream.__lt__(other.stream)

    def __ne__(self, other):
        return self.stream.__ne__(other.stream)

    def __sizeof__(self):
        return self.stream.__sizeof__()

    def detach(self):
        raise NotImplementedError('not available in Pythonpad')

    def readable(self):
        return 'r' in self.mode or '+' in self.mode

    def read(self, size=-1):
        if 'r' not in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not readable')
        return self.stream.read(size)

    def readline(self, size=-1):
        if 'r' not in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not readable')
        return self.stream.readline(size)

    def readlines(self, hint=-1):
        if 'r' not in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not readable')
        return self.stream.readlines(hint)

    def writable(self):
        return 'r' not in self.mode or '+' in self.mode

    def write(self, s):
        if 'r' in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not writable')
        return self.stream.write(s)

    def writelines(self, lines):
        if 'r' in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not writable')
        return self.stream.writelines(s)

    def fileno(self):
        raise OSError('no file descriptor is available in simulated in-memory file system')

    def tell(self):
        return self.stream.tell()

    def seekable(self):
        return True

    def seek(self, offset):
        return self.stream.seek(offset)

    def isatty(self):
        return False

    def truncate(self, size=None):
        return self.stream.truncate(size=size)

    def flush(self):
        if 'r' in self.mode or '+' in self.mode:
            return
        cursor = self.stream.tell()
        self.stream.seek(0) # Seek to the beginning of the stream.
        self.target_file['body'] = self.stream.read()
        files_updated(self.filename, )
        self.stream.seek(cursor)

    def close(self):
        if 'r' not in self.mode or '+' in self.mode:
            self.stream.seek(0) # Seek to the beginning of the stream.
            self.target_file['body'] = self.stream.read()
            files_updated(self.filename)
        self.stream.close()

    @property
    def name(self):
        return self.filename
    
    @property
    def closed(self):
        return self.stream.closed

class PythonpadBytesIOWrapper(io.BufferedIOBase):
    def __init__(self, filename, target_file, mode):
        global base64
        import base64
        self.stream = io.BytesIO()
        self.stream.write(base64.b64decode(target_file['body']))
        self.filename = filename
        self.target_file = target_file
        self.mode = mode
        if 'a' not in mode:
            self.stream.seek(0)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close()

    def __str__(self):
        return '<PythonpadBytesIOWrapper name=\'%s\' mode=\'%s\'>' % (self.filename, self.mode)

    def __repr__(self):
        return self.__str__()

    def __del__(self):
        return self.stream.__del__()

    def __dict__(self):
        return self.stream.__dict__()

    def __dir__(self):
        return self.stream.__dir__()

    def __eq__(self, other):
        return self.stream.__eq__(other.stream)

    def __format__(self, format_spec):
        return self.stream.__format__(format_spec)

    def __ge__(self, other):
        return self.stream.__ge__(other.stream)

    def __gt__(self, other):
        return self.stream.__gt__(other.stream)

    def __iter__(self):
        return self.stream.__iter__()

    def __le__(self, other):
        return self.stream.__le__(other.stream)

    def __lt__(self, other):
        return self.stream.__lt__(other.stream)

    def __ne__(self, other):
        return self.stream.__ne__(other.stream)

    def __next__(self):
        return self.stream.__next__()

    def __sizeof__(self):
        return self.stream.__sizeof__()

    def detach(self):
        raise NotImplementedError('not available in Pythonpad')

    def readable(self):
        return 'r' in self.mode or '+' in self.mode

    def read(self, *args, **kwargs):
        if 'r' not in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not readable')
        return self.stream.read(*args, **kwargs)

    def readline(self, *args, **kwargs):
        if 'r' not in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not readable')
        return self.stream.readline(*args, **kwargs)

    def readlines(self, *args, **kwargs):
        if 'r' not in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not readable')
        return self.stream.readlines(*args, **kwargs)

    def read1(self, *args, **kwargs):
        if 'r' not in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not readable')
        return self.stream.read1(*args, **kwargs)

    def readinto(self, *args, **kwargs):
        if 'r' not in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not readable')
        return self.stream.readinto(*args, **kwargs)

    def readinto1(self, *args, **kwargs):
        if 'r' not in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not readable')
        return self.stream.readinto1(*args, **kwargs)

    def writable(self):
        return 'r' not in self.mode or '+' in self.mode

    def write(self, s):
        if 'r' in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not writable')
        return self.stream.write(s)

    def writelines(self, lines):
        if 'r' in self.mode and '+' not in self.mode:
            raise io.UnsupportedOperation('not writable')
        return self.stream.writelines(s)

    def fileno(self):
        raise OSError('no file descriptor is available in simulated in-memory file system')

    def tell(self):
        return self.stream.tell()

    def peek(self, *args, **kwargs):
        return self.stream.peek(*args, **kwargs)

    def raw(self, *args, **kwargs):
        return self.stream.raw(*args, **kwargs)

    def seekable(self):
        return True

    def seek(self, offset):
        return self.stream.seek(offset)

    def isatty(self):
        return False

    def truncate(self, size=None):
        return self.stream.truncate(size=size)

    def flush(self):
        if 'r' in self.mode or '+' in self.mode:
            return
        cursor = self.stream.tell()
        self.stream.seek(0) # Seek to the beginning of the stream.
        self.target_file['body'] = base64.b64encode(self.stream.read()).decode('utf-8')
        files_updated(self.filename)
        self.stream.seek(cursor)

    def close(self):
        if 'r' not in self.mode or '+' in self.mode:
            self.stream.seek(0) # Seek to the beginning of the stream.
            self.target_file['body'] = base64.b64encode(self.stream.read()).decode('utf-8')
            files_updated(self.filename)
        self.stream.close()

    @property
    def name(self):
        return self.filename

    @property
    def closed(self):
        return self.stream.closed()

def files_updated(path):
    if path in browser.self._brFiles:
        browser.self._brFilesUpdated(path, browser.self._brFiles[path]['type'], browser.self._brFiles[path]['body'])
    else:
        browser.self._brFilesUpdated(path, None, None)

def normalize_path(path):
    normalized_path = os.path.normpath(path)
    if normalized_path.startswith('/'):
        raise NotImplementedError('absolute path is not supported in Pythonpad')
    elif normalized_path.startswith('../'):
        raise NotImplementedError('accessing out of the project is not supported in Pythonpad')
    return normalized_path

def exists(path):
    normalized_path = normalize_path(path)
    return (normalized_path in browser.self._brFiles) or ((normalized_path + '/') in browser.self._brFiles)

def is_dir(path):
    dir_path = normalize_path(path) + '/'
    return dir_path in browser.self._brFiles

def get_file(path):
    return browser.self._brFiles[normalize_path(path)]

def create_file(path, file_type=None, body=None):
    normalized_path = normalize_path(path)
    if '/' in normalized_path:
        tokens = normalized_path.split('/')
        parent_path = '/'.join(tokens[:-1])
        if (parent_path + '/') not in browser.self._brFiles:
            # No parent directory.
            raise FileNotFoundError('No such file or directory: \'%s\'' % path)
    file = {
        'type': 'text' if file_type is None else file_type,
        'body': '' if body is None else body,
    }
    browser.self._brFiles[normalized_path] = file
    files_updated(normalized_path)
    return file

def open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None):
    count = 0
    for m in 'rwxa':
        if m in mode:
            count += 1
    if count != 1:
        raise ValueError('must have exactly one of create/read/write/append mode')
    
    if is_dir(file):
        raise IsADirectoryError('Is a directory: \'%s\'' % file)

    if 'b' in mode:
        if 'r' in mode:
            if not exists(file):
                raise FileNotFoundError('No such file or directory: \'%s\'' % file)
            target_file = get_file(file)
        elif 'w' in mode:
            target_file = create_file(file, file_type='base64')
        elif 'x' in mode:
            if exists(file):
                raise FileExistsError('File exists: \'%s\'' % file)
            target_file = create_file(file, file_type='base64')
        elif 'a' in mode:
            if exists(file):
                target_file = get_file(file)
            else:
                target_file = create_file(file, file_type='base64')
        if target_file['type'] != 'base64':
            raise NotImplementedError('opening text file in bytes mode is not implemented in Pythonpad')
        return PythonpadBytesIOWrapper(file, target_file, mode)
    else:
        if 'r' in mode:
            if not exists(file):
                raise FileNotFoundError('No such file or directory: \'%s\'' % file)
            target_file = get_file(file)
        elif 'w' in mode:
            target_file = create_file(file)
        elif 'x' in mode:
            if exists(file):
                raise FileExistsError('File exists: \'%s\'' % file)
            target_file = create_file(file)
        elif 'a' in mode:
            if exists(file):
                target_file = get_file(file)
            else:
                target_file = create_file(file)
        if target_file['type'] != 'text':
            raise NotImplementedError('opening byte file in text mode is not implemented in Pythonpad')
        return PythonpadTextIOWrapper(file, target_file, mode, newline=newline)

browser.self._brOpenFile = open
browser.self._brIsFileExist = exists
browser.self._brGetFileDict = get_file
