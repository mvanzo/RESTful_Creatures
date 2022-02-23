//import packages
const express = require('express');
const ejslayouts = require('express-ejs-layouts');
const { json } = require('express/lib/response');
const fs = require('fs')
// method override allows us to use put and delete methods through forms in HTML5
const methodOverride = require('method-override')

// create an instance of express
const app = express()

// MIDDLEWARE
// tell express to use ejs as the view engine
app.set('view engine', 'ejs')
// tell express we're using ejs layouts
app.use(ejslayouts)
// method-override middleware - needs to be above the body parser middleware
app.use(methodOverride('_method'))
// body-parser middleware -- tells express how to handle incoming form data (aka payload data)
// allows us to access data from req.body
app.use(express.urlencoded({extended: false}))


// ROUTES
// home
app.get('/', (req, res)=> {
    res.send('hello dinos')
})



// CONTROLLERS
// app.use('/dinosaurs', require('./controllers/dinosaurs-controller'))
// app.use('/prehistoric_creatures', require('./controllers/prehistoric-controller'))



// DINOSAURS
// index route
app.get('/dinosaurs', (req, res)=>{
    // pull in dinosaurs database
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    // parse data from json into JS object
    let dinoData = JSON.parse(dinosaurs)

    let nameFilter = req.query.nameFilter
    if(nameFilter){
        // filter out all dinos who don't have the queried name
        dinoData = dinoData.filter(dino=>{
            return dino.name.toLowerCase() === nameFilter.toLowerCase()
        })
    }
    res.render('index.ejs', {myDinos: dinoData})
})
    
// new route (renders)
app.get('/dinosaurs/new', (req, res)=>{
    res.render('new.ejs')
})

// edit form route
app.get('/dinosaurs/edit/:idx', (req, res)=>{
    // read in the dinos from the db
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino from corresponding to index
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    res.render('edit.ejs', {dino: targetDino, dinoId: dinoIndex})
})

// PUT route - UPDATE
app.put('/dinosaurs/:idx', (req, res)=>{
    // read in our existing dino data
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // replace dino fiels with with fields from form
    dinoData[req.params.idx].name = req.body.name
    dinoData[req.params.idx].type = req.body.type
    // write the updated array back to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    // redirect back to the index route
    res.redirect('/dinosaurs')
})

// show route - show all info about a single dino
// : indicates that the following is a url parameter -- access via req.params
app.get('/dinosaurs/:idx', (req, res)=>{
    // read in the dinos from the db
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino from corresponding to index
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    res.render('show.ejs', {dino: targetDino})
})

// post route - CREATE and add
app.post('/dinosaurs', (req, res)=>{
    // read in our dino data from the json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // add the new dino to the dinoData array
    dinoData.push(req.body)
    // save the dinosaurs to the json file
    // fs.writeFileSync takes two parameters 1.json file/database to pass into 2.the data to pass in (this was jsonified first)
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    // redirect back to the index route
    // res.redirect takes the url pattern for the get route that you want to run next
    res.redirect('/dinosaurs')

    console.log(req.body)
})

app.delete('/dinosaurs/:idx', (req, res)=>{
    // read in our dino data from the json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // remove the deleted dino from the dinoData
    dinoData.splice(req.params.idx, 1)
    // re-write file and convert back to JSON
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    // redirect back to index route
    res.redirect('/dinosaurs')
})



// prehistoric creatures
app.get('/prehistoric_creatures', (req, res)=>{
    let prehistoricCreatures = fs.readFileSync('./prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoricCreatures)
    res.render('prehistoric-creatures.ejs', {myPrehistoric: prehistoricData})
})

// new route (renders)
app.get('/prehistoric_creatures/new', (req, res)=>{
    res.render('new-prehistoric.ejs')
})

app.get('/prehistoric_creatures/:idx', (req, res)=>{
    let prehistoricCreatures = fs.readFileSync('./prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoricCreatures)
    // extract the info corresponding to the index
    let prehistoricIndex = req.params.idx
    let targetPrehistoric = prehistoricData[prehistoricIndex]
    res.render('showPrehistoric.ejs', {prehistoricAnimal: targetPrehistoric})
})

app.post('/prehistoric_creatures', (req, res)=>{
    let prehistoricCreatures = fs.readFileSync('./prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoricCreatures)
    // add the new prehistoric creature
    prehistoricData.push(req.body)
    //save to the the json file
    fs.writeFileSync('./prehistoric-creatures.json', JSON.stringify(prehistoricData))
    // redirect
    res.redirect('/prehistoric_creatures')
})

app.listen(8000, ()=> {
    console.log('DINO CRUD TIME')
})