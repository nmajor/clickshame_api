"use strict";

module.exports = function(sequelize, DataTypes) {
  var Strike = sequelize.define("Strike", {
    link: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    violation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['misleading_title', 'misinformation', 'emotionally_manipulative']],
      }
    },
    comment: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true,
    tableName: 'strikes',
    timestamps: true,
    updatedAt: false,

    classMethods: {
      associate: function(models) {
        Strike.belongsTo(models.Identity);
        Strike.belongsTo(models.Reference);
        Strike.belongsTo(models.Domain);
      }
    },

    instanceMethods: {
      findAndSetIdentity: function() {
        var this_strike = this;
        var models = require('../models');
        var Promise = require("bluebird");
        var resolver = Promise.pending();

        models.Identity
        .find({ where: { key: this.key } })
        .then(function(identity) {
          this_strike.set("identity_id", identity.id);
          resolver.resolve(this_strike);
        });
        return resolver.promise;
      },

      findAndSetDomain: function() {
        var Promise = require("bluebird");
        var resolver = Promise.pending();
        var this_strike = this;
        var models = require('../models');
        var stringHelper = require('../helpers/string');
        var domain_name = stringHelper.getDomainNameFromUrl(this_strike.link);

        models.Domain
        .find({ where: { name: domain_name } })
        .then(function(domain) {
          if (domain) {
            this_strike.set("domain_id", domain.id);
            resolver.resolve(this_strike);
          } else {
            models.Domain
            .create({ name: domain_name })
            .then(function(domain) {
              resolver.resolve(this_strike);
              this_strike.set("domain_id", domain.id);
            });
          }
        });
        return resolver.promise;
      },

      findAndSetReference: function() {
        var Promise = require("bluebird");
        var resolver = Promise.pending();
        var this_strike = this;
        var models = require('../models');
        var stringHelper = require('../helpers/string');
        var reference_body = stringHelper.getReferenceBodyFromUrl(this_strike.link);

        models.Reference
        .find({ where: { body: reference_body } })
        .then(function(reference) {
          if (reference) {
            this_strike.set("reference_id", reference.id);
            resolver.resolve(this_strike);
          } else {
            models.Reference
            .create({ body: reference_body })
            .then(function(reference) {
              this_strike.set("reference_id", reference.id);
              resolver.resolve(this_strike);
            });
          }
        });
        return resolver.promise;
      },

      findAndSetAssociations: function() {
        return this.findAndSetIdentity()
        .then(function(strike) { return strike.findAndSetDomain(); })
        .then(function(strike) { return strike.findAndSetReference(); });
      }
    },

    hooks: {
      afterCreate: function(strike) {
        strike.getDomain().then(function(domain) { domain.updateScore() });
        strike.getReference().then(function(reference) { reference.updateScore() });
      }
    },

    getterMethods: {
      key: function() { return this._key },
    },

    setterMethods: {
      key: function(v) { this._key = v },
    }
  });

  return Strike;
};