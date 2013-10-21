function ftybrPg(pg, connectionString) {
  return function (req, res, done) {
    pg.connect(connectionString, onConnect.bind(null, req, res, done));
  };
}

function onConnect(req, res, done, err, client, doneClient) {
  if (err) {
    done(err);
  }
  else {
    req.pgClient = client;
    res.on('finish', doneClient);
    res.on('close', doneClient);
    res.on('error', doneClient);
    done();
  }
}

module.exports = ftybrPg;
