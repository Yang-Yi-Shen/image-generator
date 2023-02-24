//submit page vars
const image = document.getElementById('image')
const url = document.getElementById('url');
const submitter = document.getElementById('submitter');

//homepage vars
const randomImage = document.getElementById('homepage-image');
const newImageForm = document.getElementById('new-image-form');
const newImageBtn = document.getElementById('new-image-btn');

url.addEventListener('input', () => {
    image.setAttribute('src', url.value);
    if (url.value == '') {
        image.hidden = true;
    } else {
        image.hidden = false;
    }
})