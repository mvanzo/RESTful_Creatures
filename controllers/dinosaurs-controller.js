const express = require('express')
const router = express.Router()

// index route
router.get('/dinosaurs', (req, res)=>{
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
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
router.get('/dinosaurs/new', (req, res)=>{
    res.render('new.ejs')
})

// show route - show all info about a single dino
// : indicates that the following is a url parameter -- access via req.params
router.get('/dinosaurs/:idx', (req, res)=>{
    // read in the dinos from the db
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino from corresponding to index
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    res.render('show.ejs', {dino: targetDino})
})

// post route
router.post('/dinosaurs', (req, res)=>{
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

module.exports = router