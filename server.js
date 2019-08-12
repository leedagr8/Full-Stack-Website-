const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'leedagr8',
        password: '19656789',
        database: 'finalProjectAPI'
    }
});


const app = express();

app.use(bodyParser.json()); //middleware
app.use(cors())


app.get('/', (req, res) => {
    res.send('it is working');
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(users => {
                        res.json(users[0])
                    })
                    .catch(err => res.status('400').json('unable to get user'))
            } else {
                res.status(400).json('wrong creditianials')
            }
        })
        .catch(err => res.status('400').json('wrong creditianials'))
})


app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })


        .catch(err => res.status(400).json('unable to register'))


})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users')
        .where({
            id: id
        })
        .then(users => {
            if (users.length) {
                res.json(users[0]);
            } else {
                res.status(400).json('User not found');
            }
        }).catch(err => res.json('error getting data'));

    //   if (!found) return res.status(400).json('user not found');

})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to retrieve information'))
    //  if (!found) return res.status(400).json('user not found');
})

app.listen(3001, () => {
    console.log('App is running on port 3001');
})

//root route that responds this is working

//Sign in route post request, and respond with success or fail

///Register will be a post request

//Home screen-- userId and get there information

//Update their count when user submits photo
