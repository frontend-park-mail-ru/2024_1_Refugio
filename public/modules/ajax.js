const ajaxWithBody = (method, url, body = null, contentType, callback) => {
    if (method !== 'HEAD' && method !== 'GET') {
        const request = new Request(url, {
            method: method,
            body: body,
            headers: {'Content-type': contentType}
        });
    }
    else {
        const request = new Request(url, {
            method: method,
            headers: headers
        });
    }
    fetch(request)
        .then((response) => {
            if (response.ok) {
                return response.status, response.json()
            }
        })
        .then((status, data) => {
            callback(status, data);
        })
}


