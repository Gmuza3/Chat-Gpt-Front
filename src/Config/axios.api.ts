import axios from "axios"

const api =axios.create({
    baseURL:"http://localhost:3080/",
    withCredentials:true,
    timeout:15 * 1000,
    timeoutErrorMessage:"Check Connection !"
})

api.interceptors.request.use(
    (req) => {
        req.headers['Accept'] = "application/json";
        req.headers["Content-type"] = 'application/json';
        req.headers['Authorization'] =  `Bearer ${localStorage.getItem("token")}`;
        return req
    }, 
    (error) =>{
        return  Promise.reject(error)
    }
)

api.interceptors.response.use(
    (res) =>{
        return res
    },
    (error) =>{
        return Promise.reject(error)
    }
)

export default api