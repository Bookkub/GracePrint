const express = require('express'),
    router = express.Router({ mergeParams: true }),
    Print = require('../model/print'),
    Comment = require('../model/comment'),
    middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, async function (req, res) {
    try {
        const foundPrint = await Print.findById(req.params.id);
        res.render('comments/new.ejs', { print: foundPrint });
    } catch (err) {
        console.log(err);
    }
});

router.post("/", middleware.isLoggedIn, async function (req, res) {
    try {
        const foundPrint = await Print.findById(req.params.id);
        try {
            const comment = await Comment.create(req.body.comment);
            try {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                foundPrint.comments.push(comment);
                foundPrint.save();
                res.redirect('/prints/' + foundPrint._id);
            } catch (err) {
                console.log(err);
            }
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
});

router.get('/:comment_id/edit', middleware.checkCommentOwner, async function (req, res) {
    try {
        const foundComment = await Comment.findById(req.params.comment_id);
        res.render('comments/edit.ejs', { print_id: req.params.id, comment: foundComment });
    } catch (error) {
        console.log(error);
        res.redirect('back');
    }
});

router.put('/:comment_id', middleware.checkCommentOwner, async function (req, res) {
    try {
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        res.redirect('/prints/' + req.params.id);
    } catch (error) {
        console.log(error);
        res.redirect('back');
    }
});

router.delete('/:comment_id', middleware.checkCommentOwner, async function (req, res) {
    try {
        await Comment.findByIdAndRemove(req.params.comment_id);
        req.flash('success', 'Your comment was deleted');
        res.redirect('/prints/' + req.params.id);
    } catch (error) {
        req.flash('error', 'There are something wrong!!!');
        res.redirect('/prints/' + req.params.id);

    }

});

module.exports = router;