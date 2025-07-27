const express = require("express");
const compression = require('compression');
const path = require("path");
const multer = require("multer");
const fs = require('fs');
const cors = require('cors');
const imagemin = require('imagemin');
const imageminGifsicle = require('./imagemin-gifsicle');
const sizeOf = require('image-size');
const _http = require('http');
const _https = require('https');
const crt = require("./crt");
async function UpdateGif(location, dir, resize) {
    if(!resize){
        await imagemin([location], {
            glob: false,
            destination: dir,
            plugins: [
                imageminGifsicle({optimizationLevel: 3})
            ]
        });
        return;
    }
    const dimensions = sizeOf(location)
    let _size = dimensions.width;
    let f1, f2 = 0;
    if(dimensions.width > dimensions.height){
        _size = dimensions.height;
        f1 = Math.round((dimensions.width - dimensions.height)/2);
    }else{
        f2 = Math.round((dimensions.height - dimensions.width)/2);
    }
    await imagemin([location], {
        glob: false,
        destination: dir,
        plugins: [
            imageminGifsicle({optimizationLevel: 3, w:_size, f1, f2})
        ]
    });
}
let storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let pch = path.join(__dirname, "/uploads/" + req.body["dir"]).replace("#", '').replace("?", '');
        if (!fs.existsSync(pch)) await fs.promises.mkdir(pch, {recursive: true});
        cb(null, pch)
    },
    filename: function (req, file, cb) {
        /*console.log(req.body)*/
        let name = file.originalname.replace(file.originalname.toString().split(".")[0], '');
        cb(null, req.body["name"] + name)
    }
});
function fileFilter (req, file, cb) {
    const pch = path.join(__dirname, "/uploads/" + req.body["dir"]).replaceAll("#", '').replaceAll("?", '').replaceAll("..", '');
    const name = req.body["name"] + file.originalname.replace(file.originalname.toString().split(".")[0], '');
    const incl = path.join(pch, name);
    cb(null, !fs.existsSync(incl))
}

let upload = multer({ storage: storage, fileFilter: fileFilter }).single("filedata");
app = express();
app.use(compression({
    level: 9,
    threshold: 128
}));
app.use(cors());
app.use(function(req, res, next){
    let str = `IP: ${(req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.replace('::ffff:', '')} `;
    str += `Method: ${req.method} `;
    str += `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    console.log(str);
    if (req.method === 'GET') res.set('Cache-control', 'public, max-age=604800');
    next();
});
app.use(express.static(path.join(__dirname, "/uploads")));
app.post("/upload", function (req, res, next) {
    upload(req, res, function (err) {
        if(err instanceof multer.MulterError) return res.status(400).send("Ошибка при загрузке файла");
        const filedata = req.file;
        if(!filedata) return res.status(400).send("Ошибка при загрузке файла");
        /*console.log(filedata);*/
        if(filedata.mimetype === 'image/gif'){
            UpdateGif(filedata.path, filedata.destination, req.body.dir.includes('scpsl.store'));
        }
        res.status(200).send("Файл загружен");
    });
});
app.post("/upload/link", async function(req, res, next) {
    console.log(req.query);
    const pch = path.join(__dirname, "/uploads/" + req.query.dir).replace("#", '').replace("?", '');
    if (!fs.existsSync(pch)) await fs.promises.mkdir(pch, {recursive: true});
    await download(req.query.link ?? req.query.url, `${pch}/${req.query.name}`.replace("#", '').replace("?", ''), null);
    res.status(200).send('ok');
});
app.use(function(req, res){
    res.status(404).send('<html oncut="return false;"ondragstart="return false;"ondrop="return false;"oncontextmenu="return false;">'+
    '<head><link rel="stylesheet" href="/style.css"><title>cdn</title></head><body>file not found</body></html>')
});
let download = async function(url, dest, cb) {
    if(!url || !dest) return;
    try{if(fs.existsSync(dest))return;}catch{}
    let file = fs.createWriteStream(dest);
    let http = _http;
    if(url.split('://')[0].toLowerCase() === 'https') http = _https;
    await new Promise(resolve => {
        http.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                resolve();
                file.close(cb);
            });
        }).on('error', function(err) {
            resolve();
            fs.unlink(dest, null);
            if (cb) cb(err.message);
        });
    });
};
_https.createServer({
    key: crt.key,
    cert: crt.crt,
    passphrase: ''
}, app).listen(2521);
_http.createServer(app).listen(2653, 'localhost');