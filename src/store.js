import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const state = {
  deleteMessage: "Are you sure?",
  modalHeadline: "Delete customers?",
};
export default new Vuex.Store({
  state,
});
