/*
⠠⠠⠠⠠⠠⠀⠄⠠⠀⠄⠠⠠⠐⠠⢐⢀⠢⢐⢐⢐⠰⡐⡢⡊⡢⡱⢨⠢⡣⡊⡆⢇⢎⢆⢇⢇⢇⢧⢣⢇⢧⡣⡇⣇⢇⢇⢇⢇⢇⢇⢇⢇⢇⢇⢇⢇⢇⢇⢧⢣⢳⢱⢱⢱⢱⢱⢱⢱⢱⢱⢱⢱⢱⢱⢱⢱⡱⡱⡱⡕⡵⡱⣕⢕⢧⢳⢕⢧⢳⢵
⡀⢂⠐⡀⠂⡁⠈⠄⢁⠈⠄⠂⠡⠈⠄⡂⠌⡐⡐⡐⢅⠪⡰⠨⠢⢪⢘⠌⡆⡕⢜⢜⢜⢜⢜⢜⢜⢎⡎⡧⡣⡣⡣⡣⡣⡣⡣⡣⡣⡣⡣⡣⢣⠣⡣⡣⡣⡣⡣⡣⡣⡣⡣⡣⡣⢣⠣⡣⢣⢣⢣⢣⢣⢣⢳⢱⢱⢹⢸⢪⡪⣣⢳⡹⡜⡵⣹⢪⡳⡕
⠀⠄⠠⠐⠀⠄⢁⠐⢀⠂⠄⠡⢈⠨⠐⡀⠅⡐⡐⠌⠢⠑⢌⢊⠅⢕⠰⡑⡌⡪⡨⡢⢣⢣⢣⢳⢱⢱⢱⢱⢑⢕⢱⢡⠣⡣⢣⠣⡣⢣⠪⡸⡘⢜⢔⠱⡨⢊⠜⡘⠜⡌⡪⡂⢇⢕⢑⠜⡌⢆⢣⢃⢇⢇⢇⢇⢗⢕⢕⢇⢧⢳⡱⣕⢝⢮⡪⣇⢗⣝
⠐⠈⠠⠈⠠⢈⠠⠐⠀⢂⠈⠄⠖⢆⠂⢐⠐⢐⠠⠡⠡⠡⠡⡂⢕⠡⡑⡌⡢⡑⡌⢜⢌⢎⢎⢎⢎⢎⢎⢎⢪⢊⢎⢢⠣⣃⢣⠱⡘⢔⢑⢕⠸⡐⡢⢑⠌⡢⡡⣑⢑⠌⡂⡊⡢⢑⢌⠪⡨⡊⢆⢣⢱⢡⠣⡣⡣⡣⡣⡳⡱⡕⣕⢕⢧⢳⡱⡕⡧⡳
⠀⠌⠠⠁⠌⠀⠄⡈⢐⠀⠂⡙⠄⠘⡄⢂⠈⠄⠂⠡⠈⠌⡂⢌⠢⡑⢌⠢⡊⢔⠜⢌⢆⢇⢇⢇⣇⣧⣗⣷⣳⢯⢿⢽⢯⣖⡷⡵⣌⡪⡐⢔⠡⡂⡪⡴⣺⡹⣝⡽⡕⡮⣔⠐⠌⡂⡢⡑⠔⢅⠣⡑⡌⢆⢣⠱⡘⡌⡎⢎⢎⢎⢎⢞⢜⢎⢮⡪⡳⡹
⠡⠈⠄⠡⠈⠄⠡⢀⠂⠄⡱⡁⠌⠠⢱⠀⡂⠌⠠⠁⠅⢂⢂⠂⢅⠢⠡⡑⢌⠢⣱⣡⣃⣇⣗⡯⣗⡷⣳⣳⢯⣻⢽⢯⢟⡾⡽⡯⡯⡿⢶⢥⢎⡴⡽⣝⢝⣝⢵⣪⠚⢽⢜⢮⡐⠰⡐⢌⢊⠢⣑⢬⣪⠌⢆⠣⡑⢕⢸⢘⢌⢎⢎⢎⢎⢮⢪⠮⡝⡮
⠠⠡⢁⠅⠡⠡⡁⡂⡂⠥⠃⡆⡈⡊⢸⢀⠂⢌⠨⠈⠌⠄⡂⠅⡂⡊⠌⢔⢁⡯⣺⢺⣪⡳⣝⢽⢕⢯⡫⡳⣝⢼⢕⢗⡳⡝⡮⡳⡝⡮⡳⣝⢮⢮⢻⡺⡁⠄⡑⣗⢧⠂⠩⠳⣝⢦⣨⣐⣐⡵⣮⢗⢋⢪⢘⢌⠪⡊⡎⡜⡌⢎⠆⡇⢇⢇⢇⢏⢎⢞
⠨⡨⢂⢌⢌⠢⡂⡢⢂⢱⠁⡂⡐⠨⠀⡇⠌⡐⠨⠨⠨⢐⠠⡁⡂⡊⢌⠢⡂⣟⡼⣕⡧⡷⣵⣳⢽⢵⢯⢯⢯⢯⣻⢽⢽⣫⣟⢽⢯⣻⢽⣻⣺⢾⣳⡛⠁⡐⢀⠸⣝⢮⠠⠡⢊⠳⡓⠗⢗⢋⠆⣊⠢⡑⢔⢅⢣⢱⢘⢔⢱⠡⡣⢱⢑⢅⢣⢑⢕⠱
⡱⢨⠢⡑⢔⠡⡂⡪⡐⢌⢆⠂⡐⣈⡰⡡⢑⠨⡨⠨⡨⢐⠔⡰⠨⡂⢕⠨⡐⡰⣸⣳⣫⣻⡺⡮⡯⡯⡯⡯⡯⡯⡞⠙⠉⡈⣘⠝⠽⣺⢽⢮⢯⡯⡷⡷⡔⢀⠂⡐⣳⠽⡌⢌⠢⡑⠌⡌⡢⠢⡱⢐⢅⢕⢑⠌⡆⢕⠌⢆⠕⡑⡌⢆⠕⢌⢢⠱⡰⡑
⠱⡡⡱⡘⢔⢑⢌⠢⡊⡢⠪⣻⢺⡪⠰⡨⠢⡑⢌⠌⢆⢕⢑⢌⠕⡌⡢⡱⠈⠈⡈⢈⠺⡮⡯⡯⢯⠯⡯⣯⣺⡃⠀⠄⣱⣾⣿⣶⣶⡽⡽⣝⣗⢿⣽⣻⡽⡔⠨⢐⠨⡫⣏⣖⢵⢼⢼⡔⢌⠪⡰⡑⢔⢑⠌⡌⠢⡑⢌⠢⣑⢑⢌⢆⢣⢣⢱⢱⢱⢱
⠪⡪⢢⢑⠕⡌⢆⠣⡊⡢⡃⢮⣳⢘⢌⠢⡑⢌⠢⡑⢕⠰⡑⡌⡪⠢⡑⣿⡾⣾⡇⣄⣆⣽⣨⡐⡀⡂⠂⠌⡘⠢⢐⠀⡘⢿⢾⢿⢾⣫⢯⢷⢽⢽⣺⢾⣽⣻⢌⠢⡑⢌⠢⡩⡩⡩⡃⡣⡑⡕⡌⢎⢜⠰⡑⡌⡪⡐⡅⡕⡢⢣⠱⡸⡰⡱⡱⡱⡱⡱
⢑⢜⠰⡡⡱⡘⢔⢅⠣⡒⠜⣜⢾⢐⢢⠱⡘⢔⢑⢅⢣⢑⠕⢌⡊⢎⠜⢜⢻⢋⠠⠄⢍⠍⡝⡉⠄⢂⠡⠁⠄⠅⠂⠅⠌⡐⠠⢂⢁⠪⡩⡫⢯⣻⣺⡽⣞⡾⡧⡣⡊⢆⢣⢊⠆⡎⢜⢌⢎⢢⢃⢇⢎⢪⠸⡐⡕⢜⢌⢆⢇⢣⠣⡣⡪⡪⡪⡸⡸⡸
⡨⠢⡣⢱⢐⢅⢇⠢⡣⡊⡪⡪⡯⡢⡑⡱⡘⡌⢆⠕⡌⢆⢣⠱⡨⠢⡣⡑⢭⣗⣅⠨⢀⠪⡀⡐⠈⠄⢂⠡⠡⠨⡨⠄⡃⠊⢍⢕⢒⢌⢆⢇⢣⣗⡯⣯⡯⡿⣽⣢⢧⢧⡵⡼⡼⣼⣸⣰⣑⢅⢇⢕⢜⢜⢜⠜⡜⢜⢌⢆⢇⢕⢕⠕⡕⡜⡜⡜⡜⡜
⡪⢱⢘⢔⢱⠰⡡⠣⡢⡱⡨⡺⡽⡐⢕⠌⡆⢎⠢⡣⣪⡪⣖⢷⣝⢯⣻⡺⣝⣞⢮⣟⢶⢔⢈⠐⠥⠬⠄⡒⠨⢁⢐⠐⠠⢑⢐⢅⣇⢵⣺⣺⢽⣺⢽⣳⢿⢽⣻⣞⡯⣟⢾⢽⢽⣺⢞⡾⣺⢽⢮⡪⡢⡣⡱⡱⡱⡱⡑⡕⡅⡇⡕⡕⡕⡕⡕⡕⡕⡕
⡸⢨⠢⡃⢎⠜⡌⡪⢢⠱⡐⣕⢯⠪⡂⢇⢪⡸⡼⣝⡮⡻⣮⣳⡳⣽⡺⡮⡷⣝⣗⡯⡯⡯⣳⢦⣂⠂⡂⢂⢁⢂⢐⢈⣌⡴⣵⡫⣞⡽⣺⢵⣻⣺⢽⡽⡯⣟⣷⡳⡯⡯⡯⡯⣟⢾⢽⢽⢽⢽⢽⢽⣪⢪⢪⠪⡢⡣⡣⡱⡑⡕⢕⢕⢜⢜⢜⢜⢜⢜
⠜⡔⡑⡅⡣⡱⢨⢊⢆⠣⡑⣜⢽⡑⡅⣣⡳⡽⣝⡮⡯⣻⣺⡪⡯⣞⣞⢽⣝⣞⡾⡽⡽⣝⣞⣗⣯⣻⣺⣲⢖⣞⢾⣝⢮⣻⣪⢯⣗⣯⡯⣗⡷⣯⢯⡯⣿⢽⢮⢯⢯⢯⢯⡯⣯⢯⣯⣯⣯⣯⡯⣟⣞⡧⠧⡣⡣⡣⡪⡪⡪⡪⡪⡪⡪⡪⡪⡢⡣⡣
⠱⡨⢪⠨⡒⠜⡌⢆⢪⢘⢌⠼⣕⢇⡪⣞⡮⣻⢮⢯⣻⣺⡺⣮⣻⡺⣮⣳⣳⡳⡯⡯⡯⣗⣗⡯⡾⡽⡾⡾⣿⣞⣷⣽⣽⣾⡾⣿⢽⣳⢯⣗⡯⣷⣫⢿⢵⣫⢯⢯⢯⣻⡽⣽⡽⣏⢖⢒⡒⡆⡏⡝⠡⢀⠱⣸⢪⢪⢪⢪⢪⢪⢪⢪⢪⠪⡪⡪⡪⡪
⢱⢘⢔⠱⡨⡱⡘⢌⢢⢑⢢⢹⢮⠁⠛⢮⣻⢺⠩⡣⡑⢕⢙⣞⢞⣞⣞⢞⡮⡯⡯⡯⣻⡺⡮⡯⣟⡽⣝⡯⣗⡯⣗⡯⣗⡷⣫⢯⣻⣺⢽⢮⣟⢷⢽⢽⢽⣺⢽⢽⢽⣺⢽⣳⣟⣷⢱⢱⢱⢱⢱⢹⠐⢁⠐⢀⠣⡣⡣⡣⡣⡣⡣⡣⡱⡱⡱⡑⡕⡕
⠕⢔⠢⢣⠱⡐⡅⡣⡡⠣⡡⣳⢝⠀⠤⡨⡢⠣⡑⡌⡪⡨⢢⡫⣗⣗⢷⢝⡾⣝⢾⢽⣕⢯⢯⢯⢗⡯⣗⡯⣗⢯⣗⢯⣗⢯⣗⣟⣞⢾⢝⡷⡽⡽⡽⡽⣽⣺⢽⣫⢟⡾⣝⣷⣻⢾⡱⡱⡱⡱⡱⣑⢈⠀⡐⡀⢅⠍⢪⡪⡪⡪⡢⡣⡣⡣⡣⡣⡣⡣
⡑⢅⢣⢑⢅⢕⢌⢆⠕⡅⢳⢝⠅⠀⠡⡑⡕⡕⡱⡘⡔⡕⡱⣸⣳⡳⣝⢷⢽⡺⡽⡵⡽⡽⣍⠹⣳⣝⢷⣝⣞⢷⣝⢷⣝⣗⣗⣗⢽⣝⡗⢋⢸⡽⡽⣝⡷⡽⣽⣺⢽⣺⢽⢾⡽⣯⢪⢺⢸⢱⢹⢸⢸⢢⠠⢀⠱⡪⡄⣇⢏⢮⢪⡣⡳⡱⡣⡳⡕⣝
⡸⡘⡜⢜⢌⢆⢇⢎⢎⠂⣯⠫⡀⢀⢂⠂⡇⡇⢇⢇⢇⢣⢣⢪⡺⡮⡯⡯⣳⢯⢯⢯⢯⣻⣪⢀⠀⠁⠓⠳⠽⠵⡳⠽⡺⠮⠞⠚⠉⠄⠀⢄⢾⢽⣝⢷⢽⢽⣺⣺⢽⣺⢽⡯⣟⡗⣕⢵⢱⢣⢳⢱⢣⢣⡣⡔⣌⢮⢺⢸⢪⡪⡣⣣⢫⡪⡳⡱⡝⣜
⢜⠜⡜⢜⢜⢸⢨⢪⢂⢜⡮⠃⡀⠅⡆⡏⡪⡪⢪⢢⠣⡣⡣⡱⡪⡯⣏⡯⣞⡽⣕⡯⣗⢷⢽⢵⡀⠈⢀⠀⡀⠀⡀⠄⠀⢀⠠⠀⢁⠀⣢⢯⢯⢷⢽⢽⢽⢽⣺⣺⢽⣺⡽⣯⡯⡇⡇⣇⢧⢣⢳⢱⢕⢇⢇⢧⢣⢳⢱⡣⡳⡱⡝⡼⡸⡪⣎⢧⢫⡪
⢱⢑⢕⢕⢱⢑⢕⢕⢜⢮⡫⡰⢌⢜⢜⢌⢎⢪⠪⡢⡣⡣⡪⡊⡆⢯⡺⣝⣞⡮⣗⡯⣞⡽⡽⣕⣟⡮⣄⡀⠀⠄⠀⡀⠐⠀⡀⣄⣴⣺⣳⢽⢽⢽⢽⢽⢽⢽⣺⣺⢽⢾⣽⣳⡫⡪⣪⢪⢪⡪⡎⡮⡪⡪⡣⡳⡹⣸⢱⢕⡝⡎⡗⡝⣎⢗⡕⣗⢵⡹
⢑⢕⢅⢇⢕⢕⢱⢘⢜⢮⢇⢇⢣⢣⠱⡡⡣⡱⡱⡑⡕⢜⢌⢎⢎⢆⢏⣗⢷⣝⢮⡻⡮⡯⣯⣺⡺⡮⣗⡯⣟⡵⣳⡲⡯⡯⡯⣗⣗⢷⢽⢽⢽⢽⢽⢽⢽⢽⣺⢞⣯⢿⣺⢕⢕⢭⢪⢪⡪⡪⣪⢪⡪⡣⣫⢪⡺⡸⡪⡎⡮⡣⡏⣞⢼⡱⡕⡧⡳⣹
⠸⡰⡡⡣⢪⠢⡣⡱⡹⣝⠬⡢⡣⡱⡑⡕⢜⢌⢆⢇⢣⠣⡣⡱⡸⡰⡱⡘⡷⣝⢷⢽⢽⣺⡺⡮⡯⡻⣮⡻⡮⣯⡳⡯⡯⣯⣻⣺⣺⢽⢽⢽⢽⢽⢽⢽⢽⡽⣞⣿⣺⢯⢣⡣⡳⡱⡕⡇⣇⢏⢎⢮⡪⣺⢸⢜⡜⣎⢧⢫⢎⢗⡝⣜⢮⣚⢎⢗⡝⡼
⢕⢕⠜⡌⡎⡪⡊⡆⡽⣺⢘⢌⢆⢇⢎⢪⢸⠰⡑⡅⡇⡇⢇⢕⢕⢜⠜⡜⢜⢪⢯⢯⣳⣳⢽⢽⢽⢽⣺⡺⡽⡮⡯⣯⣻⣺⣺⡺⡮⡯⡯⡯⡯⡯⣯⢿⢽⡽⣯⢾⢱⢕⢕⢵⢱⢣⢳⢹⢸⢜⢕⢇⢗⢕⢧⢳⢹⡸⡜⡵⡹⣪⢺⢜⢮⡪⡮⡳⣹⢪
*/
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
//importar json de configuracion de cloudinary que está en la misma carpeta y se llama config.json
const config = require('./config.json');
/*el config.json tiene la siguiente estructura:
{
    "cloudinary": {
        "cloud_name": "nombre de la cuenta de cloudinary",
        "api_key": "api key de cloudinary",
        "api_secret": "api secret de cloudinary"
    }
}
Este archivo no se sube a github porque contiene datos sensibles (las claves de cloudinary)
Cabe aclarar que el archivo debe estar creado en la misma carpeta que el archivo que lo importa, sino mandará error
*/
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function uploadImage(file) {
    try {
        const result = await cloudinary.uploader.upload(file);
        const imageUrl = result.secure_url;
        return imageUrl;
    } catch (error) {
        console.error(error);
        return null;
    }
}
//obtener id de imagen de cloudinary de un enlace
function getImageId(imageUrl) {
    const imageId = imageUrl.split('/').pop().split('.')[0];
    return imageId;
}

//borrar imagen de cloudinary
async function deleteImage(imageUrl) {
    const public_id = getImageId(imageUrl);
    if (!public_id) return null;
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    uploadImage,
    getImageId,
    deleteImage
};