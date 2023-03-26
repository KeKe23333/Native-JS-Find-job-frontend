/* 
Write by Ke Ww/z5158146. 
*/
import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

import {fetchRequest} from './request.js';

//check if is already login 
window.location.hash = '';
function getToken(){
    return localStorage.getItem('token'); 
}
const isLogin = !!getToken();
// if (isLogin) {
//     window.location.hash = 'job-found';
// }else{
//     window.location.hash = 'login';
// }

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
            isLogin ? location.hash='job-found': showLogin();;
            break;
        }
    }
}


// load the page based on the hash value
window.onhashchange = function() {
    onHashChange();
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
            localStorage.setItem('userId', data.userId);
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
        localStorage.setItem('userId', data.userId);
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
    localStorage.removeItem('userId');
    location.hash = '#login';
})

/*
input a jobID and the createrId, get the user name and display it on the page
*/
function updatePosterName(jobId, createrId){

    fetchRequest(`user?userId=${createrId}`, 'GET', null, (data)=>{

        console.log('the user Name is ', data.name);
        document.getElementById(`${jobId}-createrName`).innerText ='Poster: '+data.name;


    });
}

//function to show the date/time
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


//show the job list by using DOM
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

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('d-flex', 'justify-content-between', 'align-items-center');


    //====================icon and titile=======================

    //Icon Container
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('btn-group');

    //like incon 
    const likeIcon = document.createElement('i');
    likeIcon.classList.add('bi');

    const likesArray = [];
    for( let i = 0; i < data.likes.length; i++){
        likesArray.push(data.likes[i].userId);
    }

    console.log('the likes array is ', likesArray);
    console.log('the user id is ', localStorage.getItem('userId'));
    likesArray.includes(Number(localStorage.getItem('userId'))) ? likeIcon.classList.add('bi-suit-heart-fill') : likeIcon.classList.add('bi-suit-heart');


    //delete icon
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('bi', 'bi-trash');
    
    //update icon   ==============================================这里问题，绑定了modal，后面接submitbutton（updatejobBtn）， 但是id不一样 好像是因为我loading完了才绑定事件，麻烦老师了我去吃个饭回来继续==============

    const updateJobModal = new bootstrap.Modal(document.querySelector('#update-modal'));
    const updateIcon = document.createElement('i');
    updateIcon.classList.add('bi', 'bi-pencil-square');
    updateIcon.setAttribute('data-bs-toggle', 'modal');
    updateIcon.setAttribute('data-bs-target', '#update-modal');

    const updatejobImage = document.querySelector('#update-formFile')
    const updatejobBtn = document.querySelector('#update-job');
    updatejobImage.onchange = function(event){
        const file = event.target.files[0];
        fileToDataUrl(file).then((imgBase64)=>{;
            updatejobImage.setAttribute('imgsrc', imgBase64)
            
        })
        
    }
    console.log('正确的id ', data.id );
    updatejobBtn.onclick = function(){

        console.log('错误的id '+ data.id);
        if (!updatejobImage.getAttribute('imgsrc')){
            alert('please choose a image!')
            return;
        }
        const imgBase64 = updatejobImage.getAttribute('imgsrc');
        const jobTitle = document.querySelector('.update-job .input-title').value;
        const jobDescription = document.querySelector('.update-job .input-description').value;
        const jobStartTime = new Date().toDateString();
        const jobData = {
            id: data.id,
            title: jobTitle,
            image: imgBase64,
            description: jobDescription,
            start: jobStartTime
        }
        fetchRequest('job', 'POST', jobData, (data)=>{
            updateJobModal.hide();
            window.location.hash = '';
            alert('Job change success!')
            
        });
    }
    

    //=====================Icon EVENT =======================
    //likeIcon EVENT

    likeIcon.onclick = function(){
        const jobId = data.id;
        if(likeIcon.classList.contains('bi-suit-heart')){
            const payload = {
                id : data.id,
                turnon: true
            }
            console.log('i click ', data.id);
            fetchRequest(`job/like`, 'PUT', payload, (data)=>{
                likeIcon.classList.remove('bi-suit-heart');
                likeIcon.classList.add('bi-suit-heart-fill');
                var newNum = document.getElementById(`${jobId}-numOfLikes`).innerText.slice(7,8);
                numOfLikes.innerText = 'Likes: ' + (Number(newNum)+1)
            });
            
        }else{
            const payload = {
                id : data.id,
                turnon: false
            }
            fetchRequest(`job/like`, 'PUT', payload, (data)=>{
                likeIcon.classList.remove('bi-suit-heart-fill');
                likeIcon.classList.add('bi-suit-heart');
                var newNum = document.getElementById(`${jobId}-numOfLikes`).innerText.slice(7,8);
                numOfLikes.innerText = 'Likes: ' + (Number(newNum)-1)
            });
        }


    }

    //updateIcon EVENT

    updateIcon.onclick = function(){

    }

    //deleteIcon EVENT
    deleteIcon.onclick = function(){
        const payload = {
            id : data.id
        }
        fetchRequest(`job`, 'DELETE', payload, (data)=>{
            alert('the job has been deleted!');
            window.location.hash=''
    });

    }

    //Job title
    const jobTitle = document.createElement('h4');
    jobTitle.innerText = data.title;
    titleContainer.appendChild(jobTitle);


    iconContainer.appendChild(likeIcon);
    iconContainer.appendChild(updateIcon);
    iconContainer.appendChild(deleteIcon);
    titleContainer.appendChild(iconContainer);
    

    //====================job Infro=======================
    //creater Name
    const jobCreaterName= document.createElement('p'); 
    jobCreaterName.classList.add('fst-italic')
    jobCreaterName.innerText = '--';
    jobCreaterName.setAttribute('data-bs-toggle', 'modal');
    jobCreaterName.setAttribute('data-bs-target', '#job-creater-modal');
    jobCreaterName.id = data.id +'-createrName';


    // Name click event
    jobCreaterName.onclick = function(){
        const  createrId = data.creatorId
        console.log('the creater id is ', createrId);

        fetchRequest(`user?userId=${createrId}`, 'GET', null, (data)=>{           
            const contentContainer = document.querySelector('#job-creater-modal .content-container');
            const userName = data.name;
            contentContainer.innerText= 'User Name: ' + data.name + '\n' + 'User Email: ' + data.email + '\n' +'Jobs He Has: ' + '\n'
            console.log('the user data ', data);
            data.jobs.forEach((data)=>{
                
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

                const titleContainer = document.createElement('div');
                titleContainer.classList.add('d-flex', 'justify-content-between', 'align-items-center');
                //Job title
                const jobTitle = document.createElement('h4');
                jobTitle.innerText = data.title;
                titleContainer.appendChild(jobTitle);

                const jobCreaterName= document.createElement('p'); 
                jobCreaterName.classList.add('fst-italic')
                jobCreaterName.innerText = `${userName}`;

                    //job post time
                const jobPostTime = document.createElement('p');
                jobPostTime.classList.add('fw-light')
                jobPostTime.innerText = 'Post Time: ' + getTheRightTime(data.createdAt);

                // job start time
                const jobStartTime = document.createElement('p');
                jobStartTime.classList.add('fw-light')
                jobStartTime.innerText = 'Start Time: ' + data.start.slice(0,10);

                    //job description
                const jobDescription = document.createElement('p');
                jobDescription.classList.add('description')
                jobDescription.innerText = data.description;

                jobBody.appendChild(titleContainer);
                jobBody.appendChild(jobCreaterName);
                jobBody.appendChild(jobPostTime)
                jobBody.appendChild(jobStartTime);
                jobBody.appendChild(jobDescription);
                cardContainer.appendChild(img);
                cardContainer.appendChild(jobBody);
                contentContainer.appendChild(cardContainer);   

            })
            
    
        });
    }






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
    numOfLikes.id = `${data.id}-numOfLikes`
    numOfLikes.innerText = 'Likes: ' + data.likes.length;

    //likes name list
    const likesList = document.createElement('p');
    likesList.classList.add('fw-light')
    if (data.likes.length === 0){
        likesList.innerText = 'No one like this job';
    }else{
        const nameArray = [];
        for( let i = 0; i < data.likes.length; i++){
            nameArray.push(data.likes[i].userName);
        }
        likesList.innerText = nameArray.join(', ') + ' like this job!';
    }

    //job description
    const jobDescription = document.createElement('p');
    jobDescription.classList.add('description')
    jobDescription.innerText = data.description;
    //comments Conatiner
    const commentsContainer = document.createElement('div');
    commentsContainer.classList.add('comments-container','btn-group');
    
        //add comment icon
    const addCommentIcon = document.createElement('i');
    addCommentIcon.classList.add('bi', 'bi-plus-square-dotted');
    addCommentIcon.setAttribute('data-bs-toggle', 'modal');
    addCommentIcon.setAttribute('data-bs-target', '#comment-add-modal');
    addCommentIcon.setAttribute('belongsto', data.id);
        // add comment submit click event
    const addCommentJobModal = new bootstrap.Modal(document.querySelector('#comment-add-modal'));

    const submitCommentBtn = document.querySelector('#submit-comment');    


    submitCommentBtn.onclick = function(){
        const commentValue = document.querySelector('.add-comment-model textarea');
        console.log('the id im adding is ',addCommentIcon.getAttribute('belongsto') );
        if(commentValue.value==''){
            alert('Please enter a comment');
            return;
        }

        const payload = {
            id: data.id,
            comment: commentValue.value
        }
        fetchRequest('job/comment', 'POST', payload, (data)=>{
            addCommentJobModal.hide();
            window.location.hash = '';
            alert('comment added successfully');
        })
    }


        //comments number
    const commentsNum = document.createElement('p');
    commentsNum.classList.add('fw-light')
    commentsNum.innerText = 'Comments: ' + data.comments.length;

        // Comments list

    const commentsList = document.createElement('ul');
    commentsList.classList.add('list-group', 'list-group-flush');

    for (let i = 0; i < data.comments.length; i++){
        const comment = document.createElement('li');
        comment.classList.add('list-group-item');
        comment.innerText = data.comments[i].userName + ':    ' + data.comments[i].comment;
        commentsList.appendChild(comment);

    }


    jobBody.appendChild(titleContainer);
    jobBody.appendChild(jobCreaterName);
    jobBody.appendChild(jobPostTime)
    jobBody.appendChild(jobStartTime);
    jobBody.appendChild(numOfLikes);
    jobBody.appendChild(likesList);
    jobBody.appendChild(jobDescription);
    commentsContainer.appendChild(commentsNum);
    commentsContainer.appendChild(addCommentIcon);
    jobBody.appendChild(commentsContainer);
    jobBody.appendChild(commentsList)
    cardContainer.appendChild(img);
    cardContainer.appendChild(jobBody);
    jobListContainer.appendChild(cardContainer);    
    // update job

    // console.log('the creater id is ', data.creatorId);

    // console.log('the user name is ', userInfo);
    updatePosterName(data.id, data.creatorId);

}



//fetch the job list
function fetchJobList(start){
    if (start === undefined){
        start = 0;
        jobListContainer.textContent ='' // clear the job list
    }
    fetchRequest(`job/feed?start=${Number(start)}`, 'GET', null, (data)=>{
        console.log('this user have those watchs with job', data);
        data.forEach(data => {

            console.log('the user whatched job list is ', data);
            createAjobCard(data);
            });
    });

}






// check my onw profile
const myProfile = document.querySelector('#my-profile');
myProfile.onclick = function(){
    const  createrId = localStorage.getItem('userId')
    console.log('the creater id is ', createrId);

    fetchRequest(`user?userId=${createrId}`, 'GET', null, (data)=>{           
        const contentContainer = document.querySelector('#user-profie-modal .content-container');
        const userName = data.name;
        contentContainer.innerText= 'My Name: ' + data.name + '\n' + 'User Email: ' + data.email + '\n' +'my jobs:' + '\n'
        console.log('the user data ', data);
        data.jobs.forEach((data)=>{
            
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

            const titleContainer = document.createElement('div');
            titleContainer.classList.add('d-flex', 'justify-content-between', 'align-items-center');
            //Job title
            const jobTitle = document.createElement('h4');
            jobTitle.innerText = data.title;
            titleContainer.appendChild(jobTitle);

            const jobCreaterName= document.createElement('p'); 
            jobCreaterName.classList.add('fst-italic')
            jobCreaterName.innerText = `${userName}`;

                //job post time
            const jobPostTime = document.createElement('p');
            jobPostTime.classList.add('fw-light')
            jobPostTime.innerText = 'Post Time: ' + getTheRightTime(data.createdAt);

            // job start time
            const jobStartTime = document.createElement('p');
            jobStartTime.classList.add('fw-light')
            jobStartTime.innerText = 'Start Time: ' + data.start.slice(0,10);

                //job description
            const jobDescription = document.createElement('p');
            jobDescription.classList.add('description')
            jobDescription.innerText = data.description;

            jobBody.appendChild(titleContainer);
            jobBody.appendChild(jobCreaterName);
            jobBody.appendChild(jobPostTime)
            jobBody.appendChild(jobStartTime);
            jobBody.appendChild(jobDescription);
            cardContainer.appendChild(img);
            cardContainer.appendChild(jobBody);
            contentContainer.appendChild(cardContainer);   

        })
        

    });

}


//upload a new job

const uploadJob = document.querySelector('#submit-job');
const uploadJobModal = new bootstrap.Modal(document.querySelector('#upload-job-modal'));


const jobImage = document.querySelector('#formFile')

jobImage.onchange = function(event){
    const file = event.target.files[0];
    fileToDataUrl(file).then((imgBase64)=>{
        console.log('the img is ', imgBase64);
        jobImage.setAttribute('imgsrc', imgBase64)
        
    })
    
}

uploadJob.onclick = function(){
    if (!jobImage.getAttribute('imgsrc')){
        alert('please upload a image!')
        return;
    }
    const imgBase64 = jobImage.getAttribute('imgsrc');
    const jobTitle = document.querySelector('.upload-job .input-title').value;
    const jobDescription = document.querySelector('.upload-job .input-description').value;
    const jobStartTime = new Date().toDateString();
    const jobData = {
        title: jobTitle,
        image: imgBase64,
        description: jobDescription,
        start: jobStartTime
    }
    fetchRequest('job', 'POST', jobData, (data)=>{
        uploadJobModal.hide();
        window.location.hash = '';
        alert('Job created success!')
        
    });
}


// infinite-scroll

function scrollRefresh(){
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight; 
    
    if (scrollTop + clientHeight + 1 >= scrollHeight && !!localStorage.getItem('token')) {
        // console.log('you are at the bottom of the page');
        console.log('the job list container child count is ', jobListContainer.childElementCount);
        fetchJobList(jobListContainer.childElementCount)
    }
}


window.onload = function (){
    window.onscroll = scrollRefresh;
}