const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    middleware = require('../middleware'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/upload/');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    imageFilter = function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return callback(new Error('Only jpg, jpeg, png and gif.'), false);
        }
        callback(null, true);
    },
    upload = multer({ storage: storage, fileFilter: imageFilter }),
    Print = require('../model/print');

router.get('/', async function (req, res) {
    try {
        const allPrint = await Print.find({});
        res.render('prints/index.ejs', { prints: allPrint });
    } catch (err) {
        console.log(err);
    }
});

router.post('/', middleware.isLoggedIn, upload.single('image'), async function (req, res) {
    req.body.print.image = '/upload/' + req.file.filename;
    req.body.print.author = {
        id: req.user._id,
        username: req.user.username
    };
    try {
        await Print.create(req.body.print);
        res.redirect('/prints');
    } catch (err) {
        console.log(err);
    }
});

router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('prints/new.ejs');
});

router.get('/:id', async function (req, res) {
    try {
        const foundPrint = await Print.findById(req.params.id).populate('comments').exec();
        res.render('prints/show.ejs', { print: foundPrint });
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id/edit', middleware.checkPrintOwner, async function (req, res) {
    try {
        const foundPrint = await Print.findById(req.params.id);
        res.render('prints/edit.ejs', { print: foundPrint });
    } catch (error) {
        console.log(error);
    }

});

router.put('/:id', upload.single('image'), async function (req, res) {
    if (req.file) {
        req.body.print.image = '/upload/' + req.file.filename;
    }
    try {
        const updatedPrint = await Print.findByIdAndUpdate(req.params.id, req.body.print);
        res.redirect('/prints/' + req.params.id);
    } catch (error) {
        console.log(error);
        res.redirect('/prints/');
    }

});

router.delete('/:id', middleware.checkPrintOwner, async function (req, res) {
    try {
        await Print.findByIdAndRemove(req.params.id);
        res.redirect('/prints/');
    } catch (error) {
        console.log(error);
        res.redirect('/prints/');
    }

});

module.exports = router;