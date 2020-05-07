import React, { Component } from 'react';

export class Remote {
    static post(url, form, callback, error) {
        let data;
        let token = Remote.getCookieValue('X-CSRF-TOKEN');
        let reqValToken = Remote.getCookieValue('RequestVerificationToken');
        data = JSON.stringify(Remote.serializeToJson(form));

        fetch(url, {
            credentials: 'same-origin', method: 'post', body: JSON.stringify(data), headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-CSRF-TOKEN': token, 'RequestVerificationToken': reqValToken
            }
        })
            .then((response) => {
                if (Remote.checkSessionExpired(response))
                    return response.json();
                else
                    return { error: true, statusText: response.statusText, originalMessage: response }
            })
            .catch((reason: any) => { Remote.onError(reason, error); })
            .then((result) => {
                if (!result.error)
                    callback(result);
                else {
                    Remote.onError(result, error);
                }
            });

    }

    static async postAsync(url, form) {
        let data;
        let token = Remote.getCookieValue('X-CSRF-TOKEN');
        data = JSON.stringify(Remote.serializeToJson(form));
        return await fetch(url, {
            credentials: 'same-origin', method: 'post', body: JSON.stringify(data), headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-CSRF-TOKEN': token
            }
        })
    }


    static async postDataAsync(url, data) {
        let token = Remote.getCookieValue('X-CSRF-TOKEN');
        let p = fetch(url, {
            credentials: 'same-origin', method: 'post', body: JSON.stringify(data), headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-CSRF-TOKEN': token
            }
        });
        p.then((response) => {
            Remote.checkSessionExpired(response)
        })
        return p;
    }

    static postDataText(url, data, callback, error) {
        let token = Remote.getCookieValue('X-CSRF-TOKEN');
        fetch(url, {
            credentials: 'same-origin', method: 'post', body: JSON.stringify(data), headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-CSRF-TOKEN': token
            }
        })
            .then((response) => {
                if (Remote.checkSessionExpired(response))
                    return response.text();
                else
                    return { error: true, statusText: response.statusText, originalMessage: response }
            })
            .catch((reason) => { Remote.onError(reason, error); })
            .then((result) => {
                if (!result.error)
                    callback(result);
                else {
                    Remote.onError(result, error);
                }
            });
    }

    static get(url, callback, error) {
        var dt = new Date().getTime();
        var url = url.indexOf("?") > 0 ? url + "&dt=" + dt : url + "?dt=" + dt;
        fetch(url, { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } })
            .then((response) => {
                if (Remote.checkSessionExpired(response))
                    return response.json();
                else
                    throw response;
            })
            .catch((reason) => { Remote.onError(reason, error); })
            .then((result) => {
                if (result && !result.error && !result.message)
                    callback(result);
                else {
                    Remote.onError(result, error);
                }
            });
    }

    static async getAsync(url) {
        var dt = new Date().getTime();
        var url = url.indexOf("?") > 0 ? url + "&dt=" + dt : url + "?dt=" + dt;
        let res = await fetch(url, { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } });
        if (!res.ok) {
            if (res.status && res.status === 200 && res.url.toLowerCase().indexOf("/login/") == -1 && res.url.toLowerCase().indexOf("/login") >= 0) {
                window.location.reload(true);
            }
        }
        return res;
    }

    static getText(url, callback, error) {

        fetch(url, { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } })
            .then((response) => {
                if (Remote.checkSessionExpired(response))
                    return response.text();
                else
                    return { error: true, statusText: response.statusText, originalMessage: response }
            })
            .catch((reason) => { Remote.onError(reason, error); })
            .then((result) => {
                if (!result.error)
                    callback(result);
                else {
                    Remote.onError(result, error);
                }
            });
    }

    static async getTextAsync(url) {
        let res = await fetch(url, { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } })
        if (!res.ok) {
            if (res.status && res.status === 200 && res.url.toLowerCase().indexOf("/login/") == -1 && res.url.toLowerCase().indexOf("/login") >= 0) {
                window.location.reload(true);
            }
        }
        return res;
    }

    static serializeToJson(serializer) {

        var data = serializer.serialize().split("&");
        var obj = {};
        for (var key in data) {
            if (obj[data[key].split("=")[0]]) {
                if (typeof (obj[data[key].split("=")[0]]) == "string") {
                    let val = obj[data[key].split("=")[0]];
                    obj[data[key].split("=")[0]] = [];
                    obj[data[key].split("=")[0]].push(val);
                }
                obj[data[key].split("=")[0]].push(decodeURIComponent(data[key].split("=")[1]));
            }
            else {
                obj[data[key].split("=")[0]] = decodeURIComponent(data[key].split("=")[1]);
            }
        }
        return obj;
    }

    static onError(data, callback) {
        let message = "";
        if (data && data.responseJSON && data.responseJSON.Message) {
            message += data.responseJSON.Message + "<br/>";
        }
        else if (data) {
            for (let i in data.responseJSON) {
                if (data.responseJSON[i] != undefined && data.responseJSON[i].errors != undefined && data.responseJSON[i].errors.length > 0) {
                    message += data.responseJSON[i].errors[0].errorMessage + "<br/>";
                }
            }
        }

        if (data && data.message && message === "") {
            message = data.message;
        }

        if (message == "" && data)
            message = data.statusText;

        callback(message);
    }
}
