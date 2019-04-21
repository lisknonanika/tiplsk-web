const define = (name, value) => {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: false,
        writable: false,
        configurable: false
    });
}

// App Setting
define('listenPort', 3002);
define('apiUrl', 'http://localhost:3001/api/');
