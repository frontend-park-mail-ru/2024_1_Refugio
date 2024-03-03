export const ajax = (method, url, body = null, contentType, callback) => {
    let request;
    if (method !== 'HEAD' && method !== 'GET') {
        request = new Request(url, {
            method: method,
            body: body,
            headers: {'Content-type': contentType},
            credentials: 'include',
        });
    }
    else {
        request = new Request(url, {
            method: method,
            headers: {'Content-type': contentType},
            credentials: 'include',
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


