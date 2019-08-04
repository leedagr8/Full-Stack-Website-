const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(bodyParser.json()); //middleware
app.use(cors())

const database = {

    users: [
        {
            id: '123',
            name: 'John',
            email: 'John@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Ben',
            email: 'Ben@gmail.com',
            password: 'cook',
            entries: 2,
            joined: new Date()
        }
    ],

    login: [
        {
            id: '937',
            hash: '',
            email: 'John@gmail.com'
        }
    ]
}




app.get('/', (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
        console.log('success');
    } else {
        res.status(400).json('error loggin in');
    }
})


app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password,null,null, function(err, hash) {
        console.log(hash);
    });

    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })

    res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
           return res.json(user);
        }
    })

    if(!found) return res.status(400).json('user not found');

})

app.put('/image', (req,res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++;
           return res.json(user.entries);
        }
    })

    if(!found) return res.status(400).json('user not found');
})

app.listen(3001, () => {
    console.log('App is running on port 3001');
})

//root route that responds this is working

//Sign in route post request, and respond with success or fail

///Register will be a post request

//Home screen-- userId and get there information

//Update their count when user submits photo