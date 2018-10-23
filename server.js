const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');

var cheerio = require('cheerio');
const config = require('dotenv').load();

const expressValidator = require("express-validator");

const { check, validationResult } = require('express-validator/check');
const app = express();
const router = express.Router();

app.use(expressValidator());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/bpost', [
  check('district').exists()
],

async(req, res, next)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });
    if(req.body.district === '') return res.status(400).json({message: 'Please complete the form'});

    var url = process.env.BASER_URL+req.body.district;
    
    request(url, function(err, response, html) {
      if (!err){
          const $ = cheerio.load(html);
          var news = [];
          $('#latestul .f20').each(function(i, elem) {
            news.push({
              title: $(this).text().trim(),
              url: $(this).attr('href')
            });
          });
          
          $('#latestul .shou2').each(function(i, elem) {
            news[i].img = $(this).attr('src');
          });

          $('#latestul .foot').each(function(i, elem) {
            news[i].date = $(this).attr('title');
            news[i].time = $(this).text().trim();
          });

          $('#latestul .ln18').each(function(i, elem) {
            news[i].text = $(this).text().trim();
          });

          //var result = {link};
          res.status(200).json(news);
          next();    
      }
      else {
        return res.status(400).json({message: "District is invalid"});
      }
    });
  }catch(err){
    return res.status(400).json({message: err.message});
  };
});

app.post('/bpost/content', [
  check('url').exists()
],

async(req, res, next)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });
    if(req.body.url === '') return res.status(400).json({message: 'Please complete the form'});
    request(req.body.url, function(err, resp, html) {
      if (!err && resp.statusCode === 200){
          const $ = cheerio.load(html);
          var news = [{}];
          news[0].title = $('#arttitle').text().trim();
          news[0].time = $('.bdr3').text();
          news[0].img = $('.imgfull').attr('src');
          news[0].text = $('.txt-article').text().trim();
          
          res.status(200).json(news);
          next();    
      }
      else {
        return res.status(400).json({message: "URL is invalid"});
      }
  });
  }catch(err){
    return res.status(400).json({message: err.message});
  };
});


app.use('/api', router);
module.exports = app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});