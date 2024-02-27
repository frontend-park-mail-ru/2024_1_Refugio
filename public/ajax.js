function ajax(method, url, body = null, callback) {
    const request = new Request(url, {
        method: method,
        body: body,
        headers: {
            'Content-type': 'application/json; charset=utf8'
        }
    });
    fetch(request)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
        })
        .then((data) => {
            callback(data);
        })
}
