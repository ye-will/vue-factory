;(function () {
  'use strict'

  var plugin = {}
  plugin.$providers = {}
  plugin.install = function (Vue, opts) {
    // check if vue-factory has already installed
    if (plugin.installed) {
      return
    }
    // ensure all of factory objects are Singletons
    // bind Vue root as $Vue to factory objects
    for (var key in opts) {
      var Provider = opts[key]
      if (typeof Provider === 'function') {
        Object.defineProperties(Provider.prototype, {
          $Vue: {
            get: function () {
              return Vue
            }
          }
        })
        plugin.$providers[key] = new Provider()
      } else {
        Provider.$Vue = Vue
        plugin.$providers[key] = Provider
      }
    }
    // inject factory objects to vue components when they have been created
    Vue.mixin({
      created: function () {
        var vm = this
        var providers = vm.$options.providers || []
        providers.forEach(function (inj) {
          if (Proxy && Reflect) {
            // if detected es6 Proxy/Reflect support, use them to prevent losing 'this'
            // when calling factory functions and protect factory properties
            vm[inj] = new Proxy(plugin.$providers[inj], {
              get: function (target, property) {
                var func = Reflect.get(target, property, target)
                if (typeof func === 'function') {
                  return function () {
                    var args = Array.prototype.slice.call(arguments)
                    return Reflect.apply(func, target, args)
                  }
                } else {
                  return func
                }
              },
              set: function (target, property, value) {
                var own = Object.getOwnPropertyDescriptor(target, property)
                if (typeof own === 'undefined') {
                  return Reflect.set(target, property, value, target)
                } else {
                  throw new Error('factory object is not editable, please use setters to change properties')
                }
              }
            })
          } else {
            // otherwise just bind the factory object to the vue component's context
            vm[inj] = plugin.$providers[inj]
          }
        })
      }
    })
  }

  if (typeof exports == "object") {
    module.exports = plugin
  } else if (typeof define == "function" && define.amd) {
    define([], function(){ return plugin })
  } else if (window.Vue) {
    window.VueFactory = plugin
    Vue.use(plugin)
  }

})()
