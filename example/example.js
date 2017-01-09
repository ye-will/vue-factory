var Vue = require('vue')
var VueFactory = require('../')

var FactoryExample = function () {
  this.value = 'init value'
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
// Vue.use(VueFactory, {
//   'example': FactoryExample
// })

Vue.use(VueFactory)
Vue.factory.register({
  'example': FactoryExample
})

var template = `
<div>
  <div v-for="(prop, index) in props">{{index}}: {{prop}}</div>
  <button @click="echo">echo</button>
</div>
`

new Vue({
  el: '#app',
  providers: ['example'],
  template: template,
  data: {
    props: [],
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
    this.props.push(this.example.value)
    try {
      this.example.value = 'try set private'
    }
    catch (err) {
      this.props.push(err.message)
    }
  }
})
