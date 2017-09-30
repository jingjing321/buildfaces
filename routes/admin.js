var express = require('express');
var router = express.Router();
router.get('/index', function(req, res, next) {
  res.render('admin/index');
});
router.get('/admin', function(req, res, next) {
  res.render('admin/index');
});
router.get('/column', function(req, res, next) {
  res.render('admin/column');
});
router.get('/comment', function(req, res, next) {
  res.render('admin/comment');
});
router.get('/ad-buy', function(req, res, next) {
  res.render('admin/ad-buy');
});
router.get('/ad-default', function(req, res, next) {
  res.render('admin/ad-default');
});
router.get('/ad-sell-report', function(req, res, next) {
  res.render('admin/ad-sell-report');
});
router.get('/ad', function(req, res, next) {
  res.render('admin/ad');
});
router.get('/gov-column', function(req, res, next) {
  res.render('admin/gov-column');
});
router.get('/gov', function(req, res, next) {
  res.render('admin/gov');
});
router.get('/login', function(req, res, next) {
  res.render('admin/login');
});
router.get('/user-authority', function(req, res, next) {
  res.render('admin/user-authority');
});
router.get('/user-character', function(req, res, next) {
  res.render('admin/user-character');
});
router.get('/user-manage', function(req, res, next) {
  res.render('admin/user-manage');
});

module.exports = router;