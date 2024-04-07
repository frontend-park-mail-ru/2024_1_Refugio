/**
 * sends request
 * @param {string} method http method ('GET','POST', etc.)
 * @param {string} url url for our request
 * @param {string} body body for our request
 * @param {string} contentType contentType header
 * @returns {Promise} response for request
 */
export default async function ajax(method, url, body = null, contentType, csrf) {
    let request;
    if (method !== 'HEAD' && method !== 'GET') {
        request = new Request(url, {
            method: method,
            body: body,
            headers: {
                'Content-type': contentType,
                'X-CSRF-Token': csrf,
            },
            credentials: 'include',
        });
    }
    else {
        request = new Request(url, {
            method: method,
            headers: {
                'Content-type': contentType,
                'X-CSRF-Token': csrf,
            },
            credentials: 'include',
        });
    }
    return fetch(request);
}


