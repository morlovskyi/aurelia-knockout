'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KnockoutCustomAttribute = undefined;

var _dec, _dec2, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');



var KnockoutCustomAttribute = exports.KnockoutCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('knockout'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function () {
  function KnockoutCustomAttribute(element) {
    

    this.element = element;
  }

  KnockoutCustomAttribute.prototype.bind = function bind(executionContext) {
    ko.applyBindings(executionContext, this.element);
  };

  KnockoutCustomAttribute.prototype.unbind = function unbind() {
    ko.cleanNode(this.element);
  };

  return KnockoutCustomAttribute;
}()) || _class) || _class);