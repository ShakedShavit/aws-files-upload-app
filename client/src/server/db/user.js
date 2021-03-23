import Axios from 'axios';

const url = 'http://localhost:5000/';

export const loginUserInDB = async (username, password) => {
    try {
        const res = await Axios.post(url + 'login', {
            username,
            password
        });

        return { user: res.data.user, token: res.data.token };
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error(err.response.data);
        }
        throw new Error(err.message);
    }
};

export const signupUserInDB = async (username, password) => {
    try {
        const res = await Axios.post(url + 'signup', {
            username,
            password
        });

        return { user: res.data.user, token: res.data.token };
    } catch (err) {
        if (err.response.status === 409) {
            throw new Error(err.response.data.message);
        }
        throw new Error('Sign up failed. Please try again!');
    }
};

export const uploadFileToDB = async (fd, token) => {
    try {
        const res = await Axios.post(url + 'upload-file', fd, {
            headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
            },
        });

        return res.data;
    } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 422) {
            throw new Error(err.response.data.message);
        }
        throw new Error('File upload failed');
    }
};

export const getAllFilesFromDB = async (token) => {
    try {
        const res = await Axios.get(url + 'get-all-files', {
            headers: {
            'Authorization': `Bearer ${token}`
            },
        });

        return res.data;
    } catch (err) {
        if (err.response?.status === 404) {
            throw new Error(err.response.data.message);
        }
        throw new Error('File upload failed');
    }
};

export const deleteFileFromDB = async (key, id, token) => {
    try {
        const res = await Axios.delete(url + 'delete-file/', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                key,
                id
            }
        });

        return res.data;
    } catch (err) {
        throw new Error('Cannot delete file');
    }
};

// export const getFilesFromDB = async (key, fileName, token) => {
//     try {
//         const res = await Axios.get(url + 'get-file/', {
//             params: {
//                 key,
//                 token,
//                 name: fileName
//             }
//         });

//         return res.data;
//     } catch (err) {
//         throw new Error('Cannot get file');
//     }
// };