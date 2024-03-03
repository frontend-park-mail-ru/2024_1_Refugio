export default async function ajax(method, url, body = null, contentType) {
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
    return fetch(request);
}


