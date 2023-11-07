const middlewareObj = {},
    Print = require('../model/print'),
    Comment = require('../model/comment');

middlewareObj.checkPrintOwner = async function (req, res, next) {
    if (req.isAuthenticated()) {
        try {
            const foundPrint = await Print.findById(req.params.id);
            if (foundPrint.author.id.equals(req.user._id) || req.user.isAdmin) {
                return next();
            } else {
                req.flash('error', 'You do not have permission to do this action!');
                res.redirect('back');
            }
        } catch (error) {
            res.redirect('back');
        }

    } else {
        req.flash('error', 'You need to login first');
        res.redirect('/login');
    }
}

middlewareObj.checkCommentOwner = async function (req, res, next) {
    if (req.isAuthenticated()) {
        try {
            const foundComment = await Comment.findById(req.params.comment_id);
            if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                return next();
            } else {
                req.flash('error', 'You do not have permission to do this action!');
                res.redirect('back');
            }
        } catch (error) {
            res.redirect('back');
        }

    } else {
        req.flash('error', 'You need to login first');
        res.redirect('/login');
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to login first');
    res.redirect('/login');
}

module.exports = middlewareObj;