var models  = require('../models');
var stringHelper  = require('../helpers/string');

module.exports = {
  referenceCount: function(req) {
    var max = 100;
    var def = 10;
    var count = req.query.count;

    if (!count) {
      count = def;
    } else if (count > max) {
      count = max;
    }

    return count;
  },

  topReferences: function(req, res, next) {
    count = this.referenceCount(req);

    models.Reference.findAll({
      order: [['score', 'DESC']],
      limit: count,
      attributes: ["body", "score"]
    })
    .then(function(models) {
      res.json(models);
    });
  },

  searchForOneReference: function(req, res, next) {
    url = stringHelper.getReferenceBodyFromUrl(req.query.url);

    models.Reference.find({
      where: { body: url },
      attributes: [ "body", "score" ]
    }).then(function(models) {
      if (!models) return res.json({});
      res.json(models);
    });
  },

  searchForManyReference: function(req, res, next) {
    if (!Array.isArray(req.query.urls)) return res.status(501).send('You have to pass in an array for the "urls" parameter');

    var urls = req.query.urls;
    for(i=0; i<urls.length; i++) {
      urls[i] = stringHelper.getReferenceBodyFromUrl(urls[i]);
    }

    models.Reference.findAll({
      where: { body: urls },
      attributes: [ "body", "score" ]
    }).then(function(models) {
      if (!models) return res.json([]);
      res.json(models);
    });
  },

  searchReferences: function(req, res, next) {
    if ( req.query.urls ) {
      this.searchForManyReference(req, res, next);
    } else if ( req.query.url ) {
      this.searchForOneReference(req, res, next);
    }
  },
};