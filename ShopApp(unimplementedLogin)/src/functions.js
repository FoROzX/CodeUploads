const serverURL = 'http://localhost:8080';

export async function getAllProducts(){
    const URI = `${serverURL}/products`;

    const result = await fetch(URI, {
        method: "GET"
    });

    const json = await result.json();

    return json.products;
}
export async function getProduct(wildcard){
    const URI = `${serverURL}/products/${wildcard}`;

    const result = await fetch(URI, {
        method: "GET"
    });

    const json = await result.json();

    return json.products;
}

export async function login(username, password){
    const URI = `${serverURL}/login`;

    const body = {
        username: username,
        password: password
    };

    const result = await fetch(URI, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const json = await result.json();

    if(!json.successful){
        console.error(json.error);
    }
    else{
        setCookie("sessionID", json.sessionID);
    }

}
export async function logout(username){
    const URI = `${serverURL}/login`;

    const body = {
        username: username,
        sessionID: getCookie('sessionID')
    };

    const result = await fetch(URI, {
        method: "DELETE",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const json = await result.json();

    if(!json.successful){
        console.error(json.error);
    }
    else{
        deleteCookie("sessionID");
    }
}

export async function addUser(username, password){
    const URI = `${serverURL}/users`;

    const body = {
        username: username,
        password: password
    };

    const result = await fetch(URI, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const json = await result.json();

    if(!json.successful){
        console.error(json.error);
    }
    else{
        await login(username, password);
    }
}
export async function deleteUser(username){
    const URI = `${serverURL}/users`;

    const body = {
        username: username,
        sessionID: getCookie('sessionID')
    };

    const result = await fetch(URI, {
        method: "DELETE",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const json = await result.json();

    if(!json.successful){
        console.error(json.error);
    }
}
export async function updateUser(username, column, value){
    const URI = `${serverURL}/users`;

    const body = {
        username: username,
        column: column,
        value: value,
        sessionID: getCookie('sessionID')
    };

    const result = await fetch(URI, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const json = await result.json();

    if(!json.successful){
        console.error(json.error);
    }
}

export function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cookieName) === 0) {
            return c.substring(cookieName.length, c.length);
        }
    }

    return false;
}
export function setCookie(name, value, exDays) {
    if(exDays !== undefined) {
        const d = new Date();

        d.setTime(d.getTime() + (exDays*24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
    
        document.cookie = name + "=" + value + ";" + expires + ";path=/";

        return;
    }

    document.cookie = name + "=" + value + ";path=/";

    return;
}
export function deleteCookie(name){
    setCookie(name, "", -1);
}