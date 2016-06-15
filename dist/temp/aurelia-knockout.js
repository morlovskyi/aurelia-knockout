'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KnockoutCustomAttribute = exports.KnockoutBindable = exports.KnockoutComposition = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dec, _class, _dec2, _class2, _dec3, _dec4, _class4;

var _knockout = require('knockout');

var ko = _interopRequireWildcard(_knockout);

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaLoader = require('aurelia-loader');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaBinding = require('aurelia-binding');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KnockoutComposition = exports.KnockoutComposition = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.CompositionEngine, _aureliaDependencyInjection.Container, _aureliaLoader.Loader), _dec(_class = function () {
  function KnockoutComposition(compositionEngine, container, loader) {
    _classCallCheck(this, KnockoutComposition);

    this.compositionEngine = compositionEngine;
    this.container = container;
    this.loader = loader;
  }

  KnockoutComposition.prototype.register = function register() {
    var _this = this;

    window.ko = ko;

    ko.bindingHandlers.compose = {
      update: function update(element, valueAccessor, allBindings, viewModel) {
        var value = valueAccessor();

        if (element.childElementCount > 0) {
          _this.callEvent(element, 'detached', [element, element.parentElement]);

          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
        }

        _this.doComposition(element, ko.unwrap(value), viewModel);
      }
    };
  };

  KnockoutComposition.prototype.callEvent = function callEvent(element, eventName, args) {
    var viewModel = ko.dataFor(element.children[0]);

    var func = viewModel[eventName];

    if (func && typeof func === 'function') {
      func.apply(viewModel, args);
    }
  };

  KnockoutComposition.prototype.doComposition = function doComposition(element, unwrappedValue, viewModel) {
    var _this2 = this;

    this.buildCompositionSettings(unwrappedValue, viewModel).then(function (settings) {
      _this2.composeElementInstruction(element, settings, _this2).then(function () {
        _this2.callEvent(element, 'compositionComplete', [element, element.parentElement]);
      });
    });
  };

  KnockoutComposition.prototype.composeElementInstruction = function composeElementInstruction(element, instruction, ctx) {
    instruction.viewSlot = instruction.viewSlot || new _aureliaTemplating.ViewSlot(element, true, ctx);
    return this.processInstruction(ctx, instruction);
  };

  KnockoutComposition.prototype.processInstruction = function processInstruction(ctx, instruction) {
    instruction.container = instruction.container || ctx.container;
    instruction.executionContext = instruction.executionContext || ctx;
    instruction.viewSlot = instruction.viewSlot || ctx.viewSlot;
    instruction.viewResources = instruction.viewResources || ctx.viewResources;
    instruction.currentBehavior = instruction.currentBehavior || ctx.currentBehavior;

    return this.compositionEngine.compose(instruction).then(function (next) {
      ctx.currentBehavior = next;
      ctx.currentViewModel = next ? next.executionContext : null;
    });
  };

  KnockoutComposition.prototype.buildCompositionSettings = function buildCompositionSettings(value, bindingContext) {
    var view = void 0;
    var moduleId = void 0;
    var viewModel = void 0;
    var activationData = void 0;

    if (typeof value === 'string') {
      if (this.endsWith(value, '.html')) {
        view = value;
        moduleId = value.substr(0, value.length - 5);
      } else {
        moduleId = value;
      }
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value) {
      if (value.view && !value.model) {
        view = value.view;
        viewModel = bindingContext;
      } else if (!value.view && value.model) {
        viewModel = value.model;
      } else if (value.view && value.model) {
        view = value.view;
        viewModel = value.model;
      } else {
        viewModel = value;
      }

      if (value.activationData) {
        activationData = value.activationData;
      }

      if (typeof viewModel === 'string') {
        moduleId = viewModel;
        viewModel = null;
      }
    } else if (typeof value === 'function') {
      viewModel = value();
    }

    var settings = { view: view, viewModel: viewModel, model: activationData };

    if (!viewModel && moduleId) {
      return this.loadModule(moduleId).then(function (modelInstance) {
        settings.viewModel = modelInstance;
        return Promise.resolve(settings);
      });
    }

    return Promise.resolve(settings);
  };

  KnockoutComposition.prototype.loadModule = function loadModule(moduleId) {
    var _this3 = this;

    return this.loader.loadModule(moduleId).then(function (result) {
      if (typeof result !== 'function') {
        return result;
      }

      return _this3.container.get(result);
    });
  };

  KnockoutComposition.prototype.endsWith = function endsWith(s, suffix) {
    return s.indexOf(suffix, s.length - suffix.length) !== -1;
  };

  return KnockoutComposition;
}()) || _class);
var KnockoutBindable = exports.KnockoutBindable = (_dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaBinding.ObserverLocator), _dec2(_class2 = function () {
  function KnockoutBindable(observerLocator) {
    _classCallCheck(this, KnockoutBindable);

    this.subscriptions = [];

    this.observerLocator = observerLocator;
  }

  KnockoutBindable.prototype.applyBindableValues = function applyBindableValues(data, target, applyOnlyObservables) {
    var _this4 = this;

    data = data || {};
    target = target || {};
    applyOnlyObservables = applyOnlyObservables === undefined ? true : applyOnlyObservables;

    var keys = Object.keys(data);

    keys.forEach(function (key) {
      var outerValue = data[key];
      var isObservable = ko.isObservable(outerValue);

      if (isObservable || !applyOnlyObservables) {
        (function () {
          var observer = _this4.getObserver(target, key);

          if (observer && observer instanceof _aureliaTemplating.BehaviorPropertyObserver) {
            observer.setValue(isObservable ? ko.unwrap(outerValue) : outerValue);
          }

          if (isObservable) {
            _this4.subscriptions.push(outerValue.subscribe(function (newValue) {
              observer.setValue(newValue);
            }));
          }
        })();
      }
    });

    var originalUnbind = target.unbind;

    target.unbind = function () {
      _this4.subscriptions.forEach(function (subscription) {
        subscription.dispose();
      });

      _this4.subscriptions = [];

      if (originalUnbind) {
        originalUnbind.call(target);
      }
    };
  };

  KnockoutBindable.prototype.getObserver = function getObserver(target, key) {
    return this.observerLocator.getObserver(target, key);
  };

  return KnockoutBindable;
}()) || _class2);
var KnockoutCustomAttribute = exports.KnockoutCustomAttribute = (_dec3 = (0, _aureliaTemplating.customAttribute)('knockout'), _dec4 = (0, _aureliaDependencyInjection.inject)(Element), _dec3(_class4 = _dec4(_class4 = function () {
  function KnockoutCustomAttribute(element) {
    _classCallCheck(this, KnockoutCustomAttribute);

    this.element = element;
  }

  KnockoutCustomAttribute.prototype.bind = function bind(executionContext) {
    ko.applyBindings(executionContext, this.element);
  };

  KnockoutCustomAttribute.prototype.unbind = function unbind() {
    ko.cleanNode(this.element);
  };

  return KnockoutCustomAttribute;
}()) || _class4) || _class4);