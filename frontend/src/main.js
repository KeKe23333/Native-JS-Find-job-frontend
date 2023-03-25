
import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

import {fetchRequest} from './request.js';

    //check if is already login 
location.hash = '';
function getToken(){
    return localStorage.getItem('token'); 
}
const isLogin = !!getToken();
if (isLogin) {
    window.location.hash = 'job-found';
}else{
    window.location.hash = 'login';
}

// get the diffent pages elements
const login = document.querySelector('.page.login');
const register = document.querySelector('.page.register');
const jobFound = document.querySelector('.page.job-found');

// add event listener to the window
function showLogin() {
    login.style.display = 'flex';
    register.style.display = 'none';
    jobFound.style.display = 'none';
}

function showRegister() {
    login.style.display = 'none';
    register.style.display = 'flex';
    jobFound.style.display = 'none';
}

function showJobFound() {
    login.style.display = 'none';
    register.style.display = 'none';
    jobFound.style.display = 'block';
    fetchJobList()
}
/*======================= register event =======================
1. checke the Email address is valid or not
2. check the password and confirm password is the same or not
*/
//1.
const registerEmail = document.querySelector('#registerEmail');
const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/

registerEmail.addEventListener('change', verifyEmail);

function verifyEmail() {
    const email = registerEmail.value;
    const span = registerEmail.nextElementSibling;
    if (!reg.test(email)) {
        span.style.display = 'flex';
        return false
    }
    span.style.display = 'none';
    return true
}

//2.
const registerComfirmPassword = document.querySelector('#registerComfirmPassword');
registerComfirmPassword.addEventListener('change', verifyPassword);
function verifyPassword(){
    const password = document.querySelector('#registerPassword').value;
    const confirmPassword = registerComfirmPassword.value;
    const span = registerComfirmPassword.nextElementSibling;
    if (password !== confirmPassword) {
        span.style.display = 'flex';
        return false
    }
    span.style.display = 'none';
    return true
}

// check the form and post the request to the server
const submitRegister = document.querySelector('#submitRegister');
submitRegister.addEventListener('click', (event) => {
    if(!verifyEmail() || !verifyPassword() ){
        event.preventDefault();
    }else{
        const payload = {
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            name: document.getElementById('registerName').value

        }    
        fetchRequest('auth/register', 'POST', payload, (data)=>{
            console.log('Success! the data is ', data);
            localStorage.setItem('token', data.token);
            location.hash = '#job-found';
            console.log('the user id is ', data.userId);
        });
    }
})

/*
======================= login event =======================
*/
const submitsignIn = document.getElementById('submitSingin');
submitsignIn.addEventListener('click', () => {
    const payload = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    }
    fetchRequest('auth/login', 'POST', payload,(data)=>{
        localStorage.setItem('token', data.token);
        location.hash = '#job-found';
        // console.log('the user id is ', data.userId);

    });
})



/*
======================= job stuff here =======================
*/
//button to log out
const logOut = document.querySelector('#logOut');
logOut.addEventListener('click', () => {
    localStorage.removeItem('token');
    location.hash = '#login';
})



function getUserInfo(jobId, createrId){

    fetchRequest(`user?userId=${createrId}`, 'GET', null, (data)=>{
        /* 
         data {
            email: "betty@email.com"
            id: 26994
            jobs: array[{job},{job}]
            name: "Betty"
            watcheeUserIds:array[ , ]
         }
        */
        console.log('the user Name is ', data.name);
        document.getElementById(`${jobId}-createrName`).innerText ='Poster: '+data.name;


    });
}


function getTheRightTime(time){
    if(new Date(time).toDateString() === new Date().toDateString()){
        console.log('the time is ', time.slice(11,16));
       return time.slice(11,16)
    }else{
        const yyyy = time.slice(0,4);
        const mm = time.slice(5,7);
        const dd = time.slice(8,10);
        console.log('the date is ', dd +'/' + mm+ '/' + yyyy);
        return dd +'/' + mm+ '/' + yyyy
    }
}

getTheRightTime('2011-10-05T14:48:00.000Z')
const jobListContainer = document.querySelector('#job-list-container');
function createAjobCard(data){
    const colContainer = document.createElement('div');
    colContainer.classList.add('col');

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card', 'shadow-sm');

    const img = document.createElement('img');
    img.src = data.image;
    img.style.width = '100%';
    img.style.height = '225px';

    const jobBody = document.createElement('div');
    jobBody.classList.add('card-body');
    //Job title
    const jobTitle = document.createElement('h2');
    jobTitle.innerText = data.title;

    const jobCreaterName= document.createElement('p'); 
    //creater Name
    jobCreaterName.classList.add('fst-italic')
    jobCreaterName.innerText = '--';
    jobCreaterName.id = data.id +'-createrName';

    //job post time
    const jobPostTime = document.createElement('p');
    jobPostTime.classList.add('fw-light')
    jobPostTime.innerText = 'Post Time: ' + getTheRightTime(data.createdAt);

    // job start time
    const jobStartTime = document.createElement('p');
    jobStartTime.classList.add('fw-light')
    jobStartTime.innerText = 'Start Time: ' + data.start.slice(0,10);

    //number of Likes
    const numOfLikes = document.createElement('p');
    numOfLikes.classList.add('fw-light')
    numOfLikes.innerText = 'Likes: ' + data.likes.length;

    const likesList = document.createElement('p');
    likesList.classList.add('fw-light')
    if (data.likes.length === 0){
        likesList.innerText = 'No one likes this job';
    }else{
        likesList.innerText = data.likes + ' people like this job';
    }

    //job description
    const jobDescription = document.createElement('p');
    jobDescription.innerText = data.description;

    //comments
    const comments = document.createElement('p');
    comments.classList.add('fw-light')
    comments.innerText = 'Comments: ' + data.comments.length;



    jobBody.appendChild(jobTitle);
    jobBody.appendChild(jobCreaterName);
    jobBody.appendChild(jobPostTime)
    jobBody.appendChild(jobStartTime);
    jobBody.appendChild(numOfLikes);
    jobBody.appendChild(likesList);
    jobBody.appendChild(jobDescription);
    jobBody.appendChild(comments);
    cardContainer.appendChild(img);
    cardContainer.appendChild(jobBody);
    jobListContainer.appendChild(cardContainer);    
    // update job

    // console.log('the creater id is ', data.creatorId);
    getUserInfo(data.id, data.creatorId);

    // console.log('the user name is ', userInfo);


}



function fetchJobList(){
    fetchRequest('job/feed?start=0', 'GET', null, (data)=>{
        console.log('this user have those watchs with job', data);
        jobListContainer.textContent =''
        data.forEach(data => {

            console.log('the user whatched job list is ', data);
            createAjobCard(data);
                // console.log('the job list is ', data);
                /*
                data format is :
                        "id": 528491,
                        "creatorId": 61021,
                        "title": "COO for cupcake factory",
                        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
                        "start": "2011-10-05T14:48:00.000Z",
                        "description": "Dedicated technical wizard with a passion and interest in human relationships",
                        "createdAt": "2011-10-05T14:48:00.000Z",
                        "likes": [
                        {
                            "userId": 61021,
                            "userEmail": "betty@email.com",
                            "userName": "Betty"
                        }
                        ],
                        "comments": [
                        {
                            "userId": 61021,
                            "userEmail": "betty@email.com",
                            "userName": "Betty",
                            "comment": "This is a great opportunity, my email is hello@unsw.edu.au"
                */

            });

    });

}



























// show the page based on the hash value in the url

function onHashChange() {
    const hash = window.location.hash;
    const curPage = hash.replace('#', '');

    switch(curPage) {
        case 'login':{
            showLogin();
            break;
        }
        case 'register':{
            showRegister();
            break;
        }
        case 'job-found':{
            showJobFound();
            break;       
        }     
        default:{
            isLogin ? showJobFound() : showJobFound();
            break;
        }
    }
}

// load the page based on the hash value
window.onhashchange = function() {
    onHashChange();
}  