const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'abhilash.gj',
    password : '',
    database : 'meetingRoom'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> {
	db.select('email','password').from('login')
	.then(data=>{
			console.log("rest",req.body.email,"cust",req.body.password);
			res.send(data);
	})
})

app.post('/login',(req,res)=>{
	db.select('email','password').from('login').where({'email':req.body.email,'password':req.body.password})
	.then(data=>{
			console.log("rest",req.body.email,"cust",req.body.password);
			if(data[0].email==req.body.email && data[0].password==req.body.password)
			{
				res.json("success");
			}
	})
	.catch(err=>res.status(400).json('error getting data'))
})


app.post('/getBookings',(req,res)=>{
	db.select('*').from('bookings').where({'roomnum':req.body.roomnum}).orderBy('eventdate','asc').orderBy('eventtime','asc')
	.then(data=>{
		res.json(data);
	})
	.catch(err=>res.status(400).json('error getting data'))
})

app.post('/getBookingsEmail',(req,res)=>{
	db.select('*').from('bookings').where({'email':req.body.email})
	.then(data=>{
		res.json(data);
	})
	.catch(err=>res.status(400).json('error getting data'))
})

app.post('/makeBooking',(req,res)=>{
	db('bookings').returning('*').insert({email:req.body.email,eventname:req.body.eventname,people:req.body.people,eventdate:req.body.eventdate,eventtime:req.body.eventtime,endtime:req.body.endtime,roomnum:req.body.roomnum})
	.then(response=>{
		console.log("Inserting ",req.body.email,req.body.eventname,req.body.people,req.body.eventdate,req.body.eventtime,req.body.endtime,req.body.roomnum);
	res.json(response);
	})
	.catch(err=>res.status(400).json('error getting data'))
})



app.listen(3000, ()=> {
  console.log('app is running on portn 3000');
})