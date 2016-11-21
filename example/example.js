var Vue = require('vue')
var VueFactory = require('../')

var FactoryExample = function () {
  this.private = 'private',
  this.value = 'init'
}
FactoryExample.prototype.echo = function (something) {
  window.alert(something)
};
Object.defineProperties(FactoryExample.prototype, {
  prop: {
    get: function () {
      return 'get: ' + this.value
    },
    set: function (value) {
      this.value = value
    }
  }
})

// use the plugin
Vue.use(VueFactory, {
  'example': FactoryExample
})

// Vue.use(VueFactory)
// Vue.factory.register({
//   'example': FactoryExample
// })

var template = `
<div>
  <div v-for="(prop, index) in props">index: {{prop}}</div>
  <button @click="echo">click me</button>
</div>
`

new Vue({
  el: '#app',
  providers: ['example'],
  template: template,
  data: {
    props: []
  },
  methods: {
    echo: function () {
      this.example.echo("Aha~")
    }
  },
  created() {
    this.props.push(this.example.prop)
    this.example.prop = 'vue factory works'
    this.props.push(this.example.prop)
  }
})
