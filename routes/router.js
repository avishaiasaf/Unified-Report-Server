const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const reportHandler = require('../public/javascripts/reportHandler');
const accessories = require("../public/javascripts/accessories.js");

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
//var upload = multer({ dest: 'uploads/' })
var cpUpload = upload.fields([{ name: 'iniFile', maxCount: 1 }, { name: 'bkmvFile', maxCount: 1 }])

router.post('/analyze_report', cpUpload, function (req, res, next) {

  var ini = Buffer.from(req.files['iniFile'][0].buffer).toString("utf-8");
  var bkmv = Buffer.from(req.files['bkmvFile'][0].buffer).toString("utf-8");

  reportHandler.ini = ini;
  reportHandler.bkmvdata = bkmv;
  reportHandler.init();
  var record = reportHandler.tran_ids
  var summary_c100 = reportHandler.summary_c100;
  var summary_d110 = reportHandler.summary_d110;
  var summary_d120 = reportHandler.summary_d120;
  var parsed_sections = reportHandler.bkmvdata_parsed;
  var headerError = reportHandler.headerError;
  var fields = accessories.fields;
  setTimeout(()=>{
    //res.send(record); //Buffer.from(iniFile[0].buffer).toString("utf-8");
    res.render('explore', {title: 'Explore', caption: 'Explore Company Report', 
            options: record, c100: summary_c100, d110: summary_d110, d120: summary_d120,
            parsed_sections: parsed_sections, fields: fields, headerError: headerError});
    //console.log(fields);
  }, 1500);
  
});


router.get('/', (req, res)=>{
    res.render('index', {title: 'Home', caption: 'Home'});
});

router.get('/explore', (req, res)=>{
    res.render('explore', {title: 'Explore', caption: 'Explore Company Report'})
})

router.get('/about', (req, res)=>{
    console.log('redirected to about page')
    res.render('about', {title: 'About', caption: 'About'})
})

router.use('/', (req, res)=>{
    console.log('redirected to 404 page')
    res.status(404).render('error', {title: 'Error 404', caption: 'Error 404 - Page Not Found'});
})

module.exports = router;