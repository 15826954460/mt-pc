const state = ()=>({
  menu: [], // 菜单
  hotPlace: [] // 热门城市
})

const mutations = {
  setMenu(state, val) {
    state.menu = val
  },
  setHotPlace(state, val) {
    state.hotPlace = val
  }
}

const actions = {
  setMenu: ({commit}, menu)=>{
    commit('setMenu', menu)
  },
  setHotPlace: ({commit}, hotPlace)=>{
    commit('setHotPlace', hotPlace)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
