var express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
var env = require('node-env-file');
var path = require('path');

var app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use('/documents', express.static('public'))

MongoClient.connect(process.env.MONGOURI, (err, database) => {
  // ... start the server
})


app.get('/', (req, res)=>{
	res.sendFile(path.join(__dirname+'/html/home.html'))
})

app.get('/documents', (req, res)=>{
	res.send("Hello")
	//res.sendFile("/documents/"+'test.pdf')
})

app.listen(process.env.PORT || 3000, ()=>{
	console.log("On")
	console.log(process.env.PORT || 3000)
});
