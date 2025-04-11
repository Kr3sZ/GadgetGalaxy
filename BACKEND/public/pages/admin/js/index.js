"use strict";
function post(url, pBody) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pBody)
        }).then((res) => {
            if (!res.ok) {
                reject(`error: invalid status: ${res.status}`);
            }
            return res.json();
        }).then((data) => {
            resolve(data);
        }).catch((e) => {
            reject(e);
        });
    });
}
function get(url) {
    return new Promise((resolve, reject) => {
        fetch(url).then((res) => {
            if (!res.ok) {
                reject(`error: invalid status: ${res.status}`);
            }
            return res.json();
        }).then((data) => {
            resolve(data);
        }).catch((e) => {
            reject(e);
        });
    });
}
