const express = require('express'),
    app = express(),
    passport = require('passport'),
    port = process.env.PORT || 80,
    cors = require('cors'),
    cookie = require('cookie')

const bcrypt = require('bcrypt')

const db = require('./database.js')
let users = db.users

let amwayproducts = 
{ 
    list:
    [ 
        {
            id: 1,
            name: "protein",
            brand: "NUTRILITE",
            price: "1100",
        },

        {
            id: 2,
            name: "collagen",
            brand: "TRUVIVITY",
            price: "1000"
        }

    ]
}

require('./passport.js')

const router = require('express').Router(),
    jwt = require('jsonwebtoken')

app.use('/api', router)
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.route('/amwayproducts')
    .get((req,res) => res.json(amwayproducts))
    .post((req,res) => 
    {
        let id = amwayproducts.list.length ? amwayproducts.list[amwayproducts.list.length-1].id+1:1
        
        let name = req.body.name
        let brand = req.body.brand
        let price = req.body.price

        amwayproducts = { list: [ ...amwayproducts.list, {id, name, brand, price} ]}
        res.json(amwayproducts)
    })

router.route('/amwayproducts/:amway_id')
    .get( (req,res) => 
    {
        let id = amwayproducts.list.findIndex((item) => (item.id === +req.params.amway_id) )
        if(id === -1)
        {
            res.send('No id : (show now)')
        }
        else
        {
            res.json(amwayproducts.list[id])
        }

    })
    .put( (req,res) =>
    {
        let id = amwayproducts.list.findIndex((item) => (item.id === +req.params.amway_id) )
        if(id === -1)
        {
            res.send('No id : (update)')
        }
        else
        {
            amwayproducts.list[id].name = req.body.name
            amwayproducts.list[id].brand = req.body.brand
            amwayproducts.list[id].price = req.body.price

            res.json(amwayproducts)
        }
        
    }) 
    .delete( (req,res) =>
    {
        let id = amwayproducts.list.findIndex((item) => (item.id === +req.params.amway_id) )
        if(id === -1)
        {
            res.send('No id : (delete)')
        }
        else
        {
           amwayproducts.list = amwayproducts.list.filter( (item) => item.id !== +req.params.amway_id)
           res.json(amwayproducts) 
        }
        
    })

    router.post('/login', (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            console.log('Login: ', req.body, user, err, info)
            if (err) return next(err)
            if (user) {
                const token = jwt.sign(user, db.SECRET, {
                    expiresIn: (req.body.RememberMe === "on") ?'7d' : '1d'
                })
                // req.cookie.token = token
                res.setHeader(
                    "Set-Cookie",
                    cookie.serialize("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        maxAge: 60 * 60,
                        sameSite: "strict",
                        path: "/",
                    })
                );
                res.statusCode = 200
                return res.json({ user, token })
            } else
                return res.status(422).json(info)
        })(req, res, next)
    })
    
    router.get('/foo',
        passport.authenticate('jwt', { session: false }),
        (req, res, next) => {
            return res.json({ message: "Foo" })
    
        });
    
    router.get('/logout', (req, res) => { 
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", '', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: -1,
                sameSite: "strict",
                path: "/",
            })
        );
        res.statusCode = 200
        return res.json({ message: 'Logout successful' })
    })
    
    
    
    /* GET user profile. */
    router.get('/profile',
        passport.authenticate('jwt', { session: false }),
        (req, res, next) => {
            res.send(req.user)
        });
    
    router.post('/register',
        async (req, res) => {
            try {
                const SALT_ROUND = 10
                const { username, email, password } = req.body 
                if (!username || !email || !password)
                    return res.json( {message: "Cannot register with empty string"})
                if (db.checkExistingUser(username) !== db.NOT_FOUND)
                    return res.json({ message: "Duplicated user" })
    
                let id = (users.users.length) ? users.users[users.users.length - 1].id + 1 : 1
                hash = await bcrypt.hash(password, SALT_ROUND)
                users.users.push({ id, username, password: hash, email })
                res.status(200).json({ message: "Register success" })
            } catch {
                res.status(422).json({ message: "Cannot register" })
            }
        })
    
    router.get('/alluser', (req,res) => res.json(db.users.users))
    
    router.get('/', (req, res, next) => {
        res.send('Respond without authentication');
    });
    
    // Error Handler
    app.use((err, req, res, next) => {
        let statusCode = err.status || 500
        res.status(statusCode);
        res.json({
            error: {
                status: statusCode,
                message: err.message,
            }
        });
    });
    
    // Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`))
