# vue-factory

**NO FARTHER ROADMAP NOW, BECAUSE**

* A similar feature named provide/inject has been invited to vue since 2.2.0
* To manage data/states, please consider [Vuex](https://github.com/vuejs/vuex) first

A factory/provider/service extension for vue.js

## Requirements

*  Vue 2.x
*  Vue 1.x not tested
*  Proxy/Reflect compatible browser for full features

## Installation

Install through npm

```
npm install vue-factory
```

Include vue-factory in <body> after loading Vue and it will automatically hooked

```
<script src="/path/to/vue-factory.js'"></script>
```

Or with Webpack/Browserify projects, add these lines in your main.js

```
var Vue = require('vue');
var VueFactory = require('vue-factory');

Vue.use(VueFactory);
```

## Useage

1.  write a factory Class/function:

    ```
    class FactoryExample {
      constructor () {
        this.const = 'not editable'
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

    you can use *this.$Vue* in the factory Class to access the The global Vue API. For example, when working along with vue-resouce, *this.$Vue.http* is equivalent to *Vue.http*.

2.  register the factory Class:

    ```
    Vue.factory.register({
      'example': FactoryExample
    })
    ```

3.  declare providers that will be injected in the Vue component:

    as in a .vue file

    ```
    <script>
    ...
    export default {
       ...
       providers: ['example'],
       ...
    }
    ...
    </script>
    ```

4.  then, you can access the provider in the component using:

    ```
    this.example.echo("ok") // "ok"
    this.example.prop // get: undefined
    this.example.prop = "changed"
    this.example.prop // get: changed
    ```

    note that all of the providers are **Singletons**, if you inject the *example* provider into other components later, *this.example.prop* will get **changed** value.

## Demo

Basic Example: [Github](https://github.com/ye-will/vue-factory/tree/master/example)  
Working with Vuex: [JSFiddle](https://jsfiddle.net/ye_well/dcmxfcz3/)
