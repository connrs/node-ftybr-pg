var test = require('tape');
var pgMiddleware = require('..');
var PassThrough = require('stream').PassThrough;
var req, res;

function initReqRes() {
  req = new PassThrough();
  res = new PassThrough();
}

test('Initialises connection', function (t) {
  t.plan(1);
  initReqRes();
  var url = 'postgres://testuser:testpass@example.org:1111/db';
  var pg = {
    connect: function (connString, done) {
      t.equal(connString, url);
    }
  };
  pgMiddleware(pg, url)(req, res, function () {});
});

test('Returns error', function (t) {
  t.plan(1);
  initReqRes();
  var url = 'postgres://testuser:testpass@example.org:1111/db';
  var pg = {
    connect: function (connString, done) {
      done(new Error('PGSQL ERROR'));
    }
  };
  pgMiddleware(pg, url)(req, res, function (err) {
    t.equal(err.message, 'PGSQL ERROR');
  });
});

test('Sets dbClient to request', function (t) {
  t.plan(1);
  initReqRes();
  var url = 'postgres://testuser:testpass@example.org:1111/db';
  var pg = {
    connect: function (connString, done) {
      done(null, {test: true}, function () {});
    }
  };
  pgMiddleware(pg, url)(req, res, function (err) {
    t.deepEqual(req.pgClient, {test: true});
  });
});

test('End client on res finish event', function (t) {
  t.plan(1);
  initReqRes();
  var url = 'postgres://testuser:testpass@example.org:1111/db';
  var pg = {
    connect: function (connString, done) {
      done(null, {}, function () {
        t.pass();
      });
    }
  };
  pgMiddleware(pg, url)(req, res, function() {});
  res.emit('finish');
});

test('End client on res close event', function (t) {
  t.plan(1);
  initReqRes();
  var url = 'postgres://testuser:testpass@example.org:1111/db';
  var pg = {
    connect: function (connString, done) {
      done(null, {}, function () {
        t.pass();
      });
    }
  };
  pgMiddleware(pg, url)(req, res, function() {});
  res.emit('close');
});

test('End client on res error event', function (t) {
  t.plan(1);
  initReqRes();
  var url = 'postgres://testuser:testpass@example.org:1111/db';
  var pg = {
    connect: function (connString, done) {
      done(null, {}, function () {
        t.pass();
      });
    }
  };
  pgMiddleware(pg, url)(req, res, function() {});
  res.emit('error');
});
