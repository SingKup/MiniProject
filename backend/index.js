let express = require('express')
let app = express()
let router = express.Router()
let PORT = 80
let bodyParser = require('body-parser');
let students = 
{ 
    list:
    [ 
        {
            id: 6135512001,
            name: "Thanawat",
            surname: "Meejan",
            major: "CoE",
            GPA: 3.3,
        },

        {
            id: 4010341,
            name: "John",
            surname: "Lennon",
            major: "SE",
            GPA: 2.87
        }

    ]
}

app.use('/api', bodyParser.json() ,router);
app.use('/api', bodyParser.urlencoded({ extended: false}) ,router);

router.route('/students')
    .get((req,res) => res.json(students.list))
    .post((req,res) => 
    {
        let id = students.list.length ? students.list[students.list.length-1].id+1:1
        id = req.body.id
        let name = req.body.name
        let surname = req.body.surname
        let major = req.body.major
        let GPA = req.body.GPA
        students = { list: [ ...students.list, {id, name, surname,major,GPA} ]}
        res.json(students.list)
    })

router.route('/students/:student_id')
    .get( (req,res) => 
    {
        let id = students.list.findIndex((item) => (item.id === +req.params.student_id) )
        if(id === -1)
        {
            res.send('No id : (show now)')
        }
        else
        {
            res.json(students.list[id])
        }

    })
    .put( (req,res) =>
    {
        let id = students.list.findIndex((item) => (item.id === +req.params.student_id) )
        if(id === -1)
        {
            res.send('No id : (update)')
        }
        else
        {
            students.list[id].name = req.body.name
            students.list[id].surname = req.body.surname
            students.list[id].major = req.body.major
            students.list[id].GPA = req.body.GPA
            res.json(students.list)
        }
        
    }) 
    .delete( (req,res) =>
    {
        let id = students.list.findIndex((item) => (item.id === +req.params.student_id) )
        if(id === -1)
        {
            res.send('No id : (delete)')
        }
        else
        {
           students.list = students.list.filter( (item) => item.id !== +req.params.student_id)
           res.json(students.list) 
        }
        
    })

app.listen(PORT, () => console.log('Server is running at',PORT));
