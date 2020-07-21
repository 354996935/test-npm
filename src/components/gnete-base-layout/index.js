import GneteBaseLayout from './src/main'

/* istanbul ignore next */
GneteBaseLayout.install = function(Vue) {
  Vue.component(GneteBaseLayout.name, GneteBaseLayout)
}

export default GneteBaseLayout
