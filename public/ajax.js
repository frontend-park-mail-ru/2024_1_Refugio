const ajaxWithBody = (method, url, body = null, headers, callback) => {
    if (body) {
        const request = new Request(url, {
            method: method,
            body: body,
            headers: headers
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


