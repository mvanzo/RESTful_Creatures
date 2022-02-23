const express = require('express')
const router = express.Router()

// prehistoric creatures
router.get('/prehistoric_creatures', (req, res)=>{
    let prehistoricCreatures = fs.readFileSync('./prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoricCreatures)
    res.render('prehistoric-creatures.ejs', {myPrehistoric: prehistoricData})
})

// new route (renders)
router.get('/prehistoric_creatures/new', (req, res)=>{
    res.render('new-prehistoric.ejs')
})

router.get('/prehistoric_creatures/:idx', (req, res)=>{
    let prehistoricCreatures = fs.readFileSync('./prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoricCreatures)
    // extract the info corresponding to the index
    let prehistoricIndex = req.params.idx
    let targetPrehistoric = prehistoricData[prehistoricIndex]
    res.render('showPrehistoric.ejs', {prehistoricAnimal: targetPrehistoric})
})

router.post('/prehistoric_creatures', (req, res)=>{
    let prehistoricCreatures = fs.readFileSync('./prehistoric-creatures.json')
    let prehistoricData = JSON.parse(prehistoricCreatures)
    // add the new prehistoric creature
    prehistoricData.push(req.body)
    //save to the the json file
    fs.writeFileSync('./prehistoric-creatures.json', JSON.stringify(prehistoricData))
    // redirect
    res.redirect('/prehistoric_creatures')
})

module.exports = router