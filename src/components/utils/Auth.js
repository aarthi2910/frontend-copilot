
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
    return localStorage.getItem('userrole')
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    localStorage.removeItem('role');
};