const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize( 'bloodsugar','postgres', 'postgres1234', {
    host: '192.168.1.85',
    dialect: 'postgres'
  });

const User = sequelize.define('users'
    , {
        // Model attributes are defined here
        fname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lname: {
            type: DataTypes.STRING
            // allowNull defaults to true
        }
    }
    , {
        // Other model options go here
        timestamps: false
    }
);

const bsData = sequelize.define('userdata'
    , {
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entrydate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        measurement: {
            type: DataTypes.STRING,
            allowNull: false
        },
        meal: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    },
    {
        timestamps: false
    }
)

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());

//home page and form
app.get('/', async (req, res) => {
    res.sendFile(__dirname+"/public/index.html")
})

// view data route
app.route('/data')
    .get( async (req, res) => {
        res.sendFile(__dirname+"/public/data.html")
    })
    .post(async (req,res)=>{
        let theData = await bsData.findAll()
        res.send(theData)
    })
app.route('/data/:time')
    .post(async (req,res)=>{
        console.log(req.params)
        // let theData = await bsData.findAll()
        switch(req.params) {
            case 'daily':
                break;
            default:
                res.status(404).redirect('/data')
        }
        // res.status(200).send()
    })

// upload data route    
app.post('/uploadData',(req,res)=>{
        let dateObject;
        if (req.body.time){
            let splitTime = req.body.time.split(':')
            let hour = splitTime[0]
            if (req.body.time.includes('PM')){
                hour = (parseInt(hour)+12).toString()
            }
            dateObject = new Date(req.body.date + ' ' + hour+":"+splitTime[1])
        }

        let beforeAfter = true;
        if(req.body.timing === 'after') {
            beforeAfter = false;
        }
        bsData.create({
            userid:1,
            entrydate: dateObject,
            amount: parseInt(req.body.amount),
            meal: beforeAfter,
            measurement: req.body.measurement
        })
        return res.status(200).redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})