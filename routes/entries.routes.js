const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in');
const Entry = require('../models/Entry')



router.get('/new', isSignedIn, (req, res) => {
    res.render('entries/new.ejs');
})

router.post('/new', isSignedIn, async (req, res) => {
    console.log(req.body)
    console.log(req.session.user._id);
    if (req.body.isPublic === 'on') {
        req.body.isPublic = true
    } else {
        req.body.isPublic = false
    }
    const createdEntry = await Entry.create({
        title: req.body.title,
        entryBody: req.body.entryBody,
        isPublic: req.body.isPublic,
        owner: req.session.user._id
    })
    res.redirect('/all-entries')
})



router.get('/all-entries', isSignedIn, async (req, res) => {
    const allPublicEntries = await Entry.find({ isPublic: true })
        .populate('owner');

    res.render('all-entries.ejs', {
        entry: allPublicEntries,
        user: req.session.user
    });
});

router.get('/my-entries', isSignedIn, async (req, res) => {
    const allEntries = await Entry.find({
        owner: req.session.user._id
    }).populate('owner');

    res.render('all-entries.ejs', {
        entry: allEntries,
        user: req.session.user
    });
});






module.exports = router;
