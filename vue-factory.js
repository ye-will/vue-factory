;(function () {
  'use strict'

  var plugin = {}
  plugin.$providers = {}

  var Configuration = function (Vue) {
    this.$Vue = Vue
  }
  Configuration.prototype.register = function (opts) {
    var vm = this
    // ensure all of factory objects are Singletons
    // bind Vue root as $Vue to factory objects
    for (var key in opts) {
      var Provider = opts[key]
      if (typeof Provider === 'function') {
        Object.defineProperties(Provider.prototype, {
          $Vue: {
            get: function () {
              return vm.$Vue
            }
          }
        })
        plugin.$providers[key] = new Provider()
      } else {
        Provider.$Vue = vm.$Vue
        plugin.$providers[key] = Provider
      }
    }
  }


  plugin.install = function (Vue, opts) {
    // check if vue-factory has already installed
    if (plugin.installed) {
      return
    }
    Vue.factory = new Configuration(Vue)
    if (typeof opts !== 'undefined') {
      Vue.factory.register(opts)
    }

    // inject factory objects to vue components when they have been created
    Vue.mixin({
      created: function () {
        var vm = this
        var providers = vm.$options.providers || []
        providers.forEach(function (inj) {
          if ((typeof Proxy !== 'undefined') && (typeof Reflect !== 'undefined')) {
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
            console.warn('No Proxy/Reflect support was found, vue-factory was in degraded mode. Take care of *this* pointer & variables of the factory object.')
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
