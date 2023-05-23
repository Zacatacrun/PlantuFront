
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
/*
⠀⠀⠀⢰⣢⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⡟⠈⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⣿⣿⣿⣿⣶⣤⣀⠀⢀⣴⣾⣿⣷⣯⣳⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢀⡞⡷⢰⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⠿⠷⠿⠿⠿⠿⠟⠛⠋⠉⠉⠉⠉⠉⠉⠉⠙⢿⣾⠛⢯⣷⠹⢾⣷⣄⠀⣀⣴⣿⠿⠀⠀⠀⠀⠀
⠀⢸⣼⡇⠸⢺⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣢⣤⣤⣤⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⡛⠀⠈⣯⣧⠀⠙⠻⠛⠷⠋⠁⠀⠀⠀⠀⠀⠀
⠀⠈⢷⣤⣴⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠴⡿⣿⣿⣿⣿⣿⣿⣿⠟⠉⣠⣼⣋⣿⣿⣿⣿⣿⣿⡄⠀⠹⡝⣆⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣗⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⢼⣦⣾⣇⣮⣟⣋⠉⠉⠛⠻⢄⠐⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠙⠓⠛⠛⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡇⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣯⠞⢻⣩⠍⠀⠀⠀⠀⠀⠉⢭⣀⣀⠘⡝⠻⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡇⡇⠀⠀⠀⠀⠀⣀⣠⣤⣤⣤⣼⣿⣦⣄⡑⢤⣀⣀⣀⠤⠒⠋⠁⢈⠀⣉⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣤⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣇⡇⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⡀⠀⠀⠀⣀⣠⣽⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀
⠀⠀⠀⢸⡀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⣿⡿⢗⢲⡄⠀⠀
⠀⠀⠀⡼⡷⢾⣿⣿⠿⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠸⡥⠖⠺⠳⡀⠀
⠀⠀⢀⣇⠗⢤⣻⠁⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢸⣁⠀⡠⣗⠳⡄
⠀⣠⣻⡸⠀⡀⢹⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⡝⠿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⢡⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠈⢇⢦⢹⠑⠿
⢠⣫⣇⡟⡚⣡⠞⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠈⠉⠉⠉⠉⠉⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠈⠉⠛⠀⠀
⠘⣹⢸⡼⠽⠃⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⣀⣀⢀⣀⣀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⡿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⡇⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/
//importar json de configuracion de cloudinary que está en la misma carpeta y se llama config.json
const config = require('./config.json');
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
module.exports = {
    uploadImage
};