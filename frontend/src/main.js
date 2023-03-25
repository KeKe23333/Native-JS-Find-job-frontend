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
    jobFound.style.display = 'flex';
}
/*add event to the register button in register page
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


// add event to the Sign in button in login page
const submitsignIn = document.getElementById('submitSingin');
submitsignIn.addEventListener('click', () => {
    const payload = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    }
    fetchRequest('auth/login', 'POST', payload,(data)=>{
        localStorage.setItem('token', data.token);
        location.hash = '#job-found';
    });
})

//button to log out
const logOut = document.querySelector('#logOut');
logOut.addEventListener('click', () => {
    localStorage.removeItem('token');
    location.hash = '#login';
})

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
window.onhashchange = function(taget, event) {
    onHashChange();
}  