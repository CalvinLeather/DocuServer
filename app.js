var express = require('express')
const bodyParser= require('body-parser')
var mime = require('mime');
var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
		console.log(file.mimetype);
		console.log(mime.extension(file.mimetype));
    cb(null, Date.now() + '.' +mime.extension(file.mimetype)) //Appending .jpg
  }
})
var upload = multer({ storage: storage })
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

var env = require('node-env-file');
env(__dirname + '/.env');

var path = require('path');

var app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(bodyParser.text())

app.use('/files', express.static('uploads'))
app.use('/static', express.static('static'))
app.use('/bower_components',  express.static('bower_components'))


app.get('/', (req, res)=>{
	res.sendFile(path.join(__dirname+'/html/home.html'))
})
app.get('/search', (req, res)=>{
	res.sendFile(path.join(__dirname+'/html/search.html'))
})


app.get('/documents',upload.none(), (req, res)=>{
	res.setHeader('Content-Type', 'application/json')
	if (req.query.key){
		var r = new RegExp(req.query.key, 'ig')
		var field =req.query.field
		var obj = {}
		obj[field] = r
		db.collection('documents').find(obj).toArray((err, results)=>{
			res.send(JSON.stringify(results))
		})
	} else{
	db.collection('documents').find().toArray((err, results)=>{
		res.send(JSON.stringify(results))
	})
	}
})

var form_data = [
								{name:'file'},
								{name:'title'},
								{name:'authors'},
								{name:'tags'}
							]
app.post('/documents', upload.fields(form_data),(req, res)=>{
	if (!req.body) return res.sendStatus(400)
	if (!req.files) return res.sendStatus(400)
	var file = req.files['file'][0]
	var data = {"title":req.body.title,
							"authors":req.body.authors.split(','),
							"tags":req.body.tags.split(','),
							"filename":file['filename']}
	db.collection('documents').insert(data, (err, records)=>{
		if (err) return console.log(err)
		res.send(JSON.stringify(records['ops'][0]))
	})
})

app.post('/documents/:id', upload.fields(form_data),(req, res)=>{
	if (!req.body) return res.sendStatus(400)
	var data = {$set: {"title":req.body.title,
							"authors":req.body.authors.split(','),
							"tags":req.body.tags.split(',')
						}}
	var o_id = new ObjectID(req.params.id);
	console.log(o_id)
	db.collection('documents').update({'_id':o_id}, data, (err, records)=>{
		if (err) return console.log(err)
		res.send(JSON.stringify(records))
	})
})

app.delete('/documents',upload.none(), (req, res)=>{
	if (!req.body) return res.sendStatus(400)
	var o_id = new ObjectID(req.body.id);
	db.collection('documents').remove({'_id' : o_id}, 1, (err, result)=>{
		if (err) return console.log(err)
		res.send(JSON.stringify(result))
	})
})

MongoClient.connect(process.env.MONGOURI_RW, (err, database) => {
	if (err) return console.log(err)
	db = database
	app.listen(process.env.PORT || 3000, ()=>{
		console.log("Connected and On")
		console.log(process.env.PORT || 3000)
	});
})
