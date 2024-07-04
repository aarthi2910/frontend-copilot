
export const setToken = (token) => {
    localStorage.setItem('token', token)
}

export const setUsername = (username) => {
    localStorage.setItem('username', username);
};

export const setUseremail = (useremail) => {
    localStorage.setItem('useremail', useremail);
};

export const setRole = (role) => {
    localStorage.setItem('role', role);
}

export const setStatus = (status) => {
    localStorage.setItem('status', status);
}

export const fetchToken = () => {
    return localStorage.getItem('token')
}

export const fecthUsername = () => {
    return localStorage.getItem('username')
}

export const fecthUseremail = () => {
    return localStorage.getItem('useremail')
}

export const fecthRole = () => {
    return localStorage.getItem('role')
}

export const fecthStatus = () => {
    return localStorage.getItem('status')
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    localStorage.removeItem('role');
    localStorage.removeItem('status');
};

export async function fetchUsers() {
    const response = await fetch('http://localhost:8000/users'); 
    console.log(response);
    if (!response) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    return data.detail;
}

