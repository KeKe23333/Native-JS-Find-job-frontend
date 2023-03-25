export const  fetchRequest = (path, method, payload,success) => {
    const postMethod = {
        method: method,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
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