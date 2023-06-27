const dropZone = document.querySelector('.drop-zone');
const browsBtn = document.querySelector('.browsBtn');
const fileInput = document.querySelector('#fileInput');


const bgProgress = document.querySelector('.bg-progress');
const percentDiv = document.querySelector('#percent');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');


const sharingContainer = document.querySelector('.sharing-container');
const fileURL = document.querySelector('#fileURL');
const copyBtn = document.querySelector('#copyBtn');


const toast = document.querySelector('.toast');


// const url = 'http://localhost:3000';
// const uploadUrl = 'http://localhost:3000/api/files';

const url = 'https://skayshare.onrender.com/';
const uploadUrl = url + 'api/files';
const maxAllowedFileSize = 200 * 1024 * 1024; // 200 MB

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();

    if (!dropZone.classList.contains('dragged')) {
        dropZone.classList.add('dragged');
    }
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragged');
    const files = e.dataTransfer.files;

    if (files.length) {
        fileInput.files = files;
        uploadFile();
    }
});


fileInput.addEventListener('change', ()=>{
    uploadFile();
})

browsBtn.addEventListener('click', () => {
    fileInput.click();
});

copyBtn.addEventListener('click', ()=>{
    fileURL.select();
    document.execCommand('copy');
    sharingContainer.style.display = 'none';
    showToast('Link Copied!');
    
    sharingContainer.style.display = 'none';
    bgProgress.style.width = `${0}%`;
    percentDiv.innerText = 0;
    progressBar.style.transform = `scaleX(${0})`;
    fileInput.value = '';
})


const uploadFile = ()=>{

    if(fileInput.files.length > 1){
        showToast('Only upload 1 file at a Time!');
        fileInput.value = '';
        return;
    }

    const file = fileInput.files[0];

    if(file.size > maxAllowedFileSize){
        showToast('Can\'t upload more than 200MB File size!');
        fileInput.value = '';
        return;
    }

    
    progressContainer.style.display = 'block';

    const formData = new FormData();
    formData.append('myfile', file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if(xhr.readyState === XMLHttpRequest.DONE){
            showLink(JSON.parse(xhr.response));
        }
    }


    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = () =>{
        fileInput.value = '';
        showToast(`Error in upload: ${xhr.statusText}`)
    }

    xhr.open('POST', uploadUrl);
    xhr.send(formData);
}

const updateProgress = (e) =>{
    const percent = Math.round((e.loaded / e.total) * 100);
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`;
}


const showLink = ({file: url}) =>{  
    progressContainer.style.display = 'none';
    sharingContainer.style.display = 'block';
    fileURL.value = url;
}

const showToast = (msg) =>{
    toast.innerText = msg;
    toast.style.transform = `translate(-50%, 0)`;
    fileInput.value = '';

    toastTimer = setTimeout(()=>{
        toast.style.transform = `translate(-50%, 60px)`;
    }, 2000);
};