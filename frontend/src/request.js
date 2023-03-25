
export const  fetchRequest = (path, method, payload,success) => {
    
    const postMethod = {
        method: method,
        headers: {
            'Content-type': 'application/json'
        }
    }
    if (method === 'GET'){
        const token = localStorage.getItem('token')
        // console.log('the token is ', token);
        postMethod.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    }else{
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