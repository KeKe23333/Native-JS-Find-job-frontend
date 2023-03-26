
export const  fetchRequest = (path, method, payload,success) => {
    
    const postMethod = {
        method: method,
        headers: {
            'Content-type': 'application/json'
        }
    }
    if (method === 'GET'){
        postMethod.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    }else if(path === 'auth/login' || path === 'auth/register'){
        postMethod.body = JSON.stringify(payload)
    }
    
    else{
        postMethod.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
        postMethod.body = JSON.stringify(payload)
    }
    fetch('http://localhost:5005/' + path, postMethod)
    .then((Response) => {
        Response.json()
        .then((data) => {
            if (data.error){
                alert(data.error)
            }else{
                success(data)
            }
        })
    })
}