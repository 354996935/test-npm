const getters = {
  gneteBase: state => {
    return {
      app: state.gneteBase.app,
      permission: state.gneteBase.permission,
      settings: state.gneteBase.settings,
      tagsView: state.gneteBase.tagsView,
      user: state.gneteBase.user
    }
  }
}
export default getters
