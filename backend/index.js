let express = require('express')
let app = express()
let router = express.Router()
let PORT = 80
let bodyParser = require('body-parser');
let amwayproduct = 
{ 
    list:
    [ 
        {
            id: 001,
            name: "protein",
            brand: "NUTRILITE",
            price: "1100",
        },

        {
            id: 002,
            name: "collagen",
            brand: "TRUVIVITY",
            price: "1000"
        }

    ]
}

app.use('/api', bodyParser.json() ,router);
app.use('/api', bodyParser.urlencoded({ extended: false}) ,router);

router.route('/amwayproduct')
    .get((req,res) => res.json(amwayproduct.list))
    .post((req,res) => 
    {
        let id = amwayproduct.list.length ? amwayproduct.list[amwayproduct.list.length-1].id+1:1
        id = req.body.id
        let name = req.body.name
        let brand = req.body.brand
        let price = req.body.price

        amwayproduct = { list: [ ...amwayproduct.list, {id, name, brand, price} ]}
        res.json(amwayproduct.list)
    })

router.route('/amwayproduct/:amway_id')
    .get( (req,res) => 
    {
        let id = amwayproduct.list.findIndex((item) => (item.id === +req.params.amway_id) )
        if(id === -1)
        {
            res.send('No id : (show now)')
        }
        else
        {
            res.json(amwayproduct.list[id])
        }

    })
    .put( (req,res) =>
    {
        let id = amwayproduct.list.findIndex((item) => (item.id === +req.params.amway_id) )
        if(id === -1)
        {
            res.send('No id : (update)')
        }
        else
        {
            amwayproduct.list[id].name = req.body.name
            amwayproduct.list[id].brand = req.body.brand
            amwayproduct.list[id].price = req.body.price

            res.json(amwayproduct.list)
        }
        
    }) 
    .delete( (req,res) =>
    {
        let id = amwayproduct.list.findIndex((item) => (item.id === +req.params.amway_id) )
        if(id === -1)
        {
            res.send('No id : (delete)')
        }
        else
        {
           amwayproduct.list = amwayproduct.list.filter( (item) => item.id !== +req.params.amway_id)
           res.json(amwayproduct.list) 
        }
        
    })

app.listen(PORT, () => console.log('Server is running at',PORT));
