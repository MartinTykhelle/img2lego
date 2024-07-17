
const express = require('express')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const lego = require('./lego.js')

const upload = multer({ dest: 'uploads/' })

const port = 3000
const app = express()

app.use('/',express.static('./frontend/dist'))

let lastUpload = {}

app.get('/data/legoColors', (req, res) => {
    res.json(lego.legoColors);
  })

 
app.get('/data/lastUpload', (req, res) => {
    res.json(lastUpload);
  })

app.post('/upload', upload.single('filename'),  function(req, res) {
lego.processFile(req.file.path,req.body.colors.split(','),function(data){
    lastUpload = data;
    //todo write lastUpload to file
    res.redirect('/');
})


});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})