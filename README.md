# vue-factory

A factory/provider/service extension for vue.js

## Requirements

*  Vue 2.0
*  Vue 1.x not tested
*  Proxy/Reflect compatible browser for full features

## Installation

Install through npm

    npm install vue-factory

Include vue-factory in <body> after loading Vue and it will automatically hooked

    <script src="/path/to/vue-factory.js'"></script>

Or with Webpack/Browserify projects, add these lines in your main.js

    var Vue = require('vue');
    var VueFactory = require('vue-factory');

    Vue.use(VueFactory);

## Useage

1. write a factory Class/function:

```
class FactoryExample {
  constructor () {
    this.private = 'private'
  }
  echo (something) {
    console.log(something)
  }
  get prop () {
    return 'get: ' + this.value
  }
  set prop (value) {
    this.value = value
  }
}
```

2. setup VueFactory

*TODO*: to be finished
