import Vue from 'vue'
import Vuex from 'vuex'
import api from '../request/api/index'
// import { removeToken } from "platuser/src/public/cookieTool.js";
import axios from "axios";


Vue.use(Vuex)

const SET_USER = 'SET_USER'
const SET_PROJECT = 'SET_PROJECT'
const SET_MEMBERSHIP_INFO = 'SET_MEMBERSHIP_INFO'

export default new Vuex.Store({
    state: {
        user: null,
        project: null,
        userSetting: {
            mapOptions: null,
            vectorOptions: null,
            editOptions: null,
            rasterOptions: null
        },//用户选项信息
        membershipInfo: null, // 会员信息
        timeZone: 'Asia/Shanghai',// Asia/Shanghai 或 UTC
    },
    getters: {
        project: state => state.project,
        user: state => state.user,
        userSetting: state => state.userSetting,
        membershipInfo: state => state.membershipInfo
    },
    mutations: {
        setProject(state, project) {
            if (!project) {
                state.project = null
                return
            }
            state.project = {
                id: project?.id,
                name: project?.name,
                workDir: project?.workDir,
                projection: project?.projection
            }
        },
        setUser(state, user) {
            state.user = user
        },

        /**
         * 设置用户选项
         */
        setUserSetting(state, userSetting) {
            state.userSetting = userSetting
        },

        /**
         * 设置会员信息
         * @param {*} state 
         * @param {*} membershipInfo 
         */
        setMembershipInfo(state, membershipInfo) {
            state.membershipInfo = membershipInfo
        },

        [SET_USER](state, user) {
            state.user = user
        },
        [SET_PROJECT](state, project) {
            state.project = project
        },
        [SET_MEMBERSHIP_INFO](state, membershipInfo) {
            state.membershipInfo = membershipInfo
        }
    },
    actions: {
        setProject({ commit }, project) {
            commit('setProject', project)
        },
        setUser({ commit }, user) {
            commit('setUser', user)
        },
        setMembershipInfo({ commit }, membershipInfo) {
            commit('setMembershipInfo', membershipInfo)
        },
        pullUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                api.user.getUserInfo().then(resp => {
                    let data = resp.data.result
                    if (data !== null) {
                        commit('setUser', data)
                        const url = `/CloudStorage/folderfile/upload/removeAllUnCompletedUploadTaskByUserId`
                        axios.delete(url, {
                            headers: {
                                'userId': data.id
                            }
                        }).then(() => { })
                    }
                    return resolve(data)
                }).catch(err => {
                    // removeToken()
                    return reject(err)
                })
            })
        },

        setUserSetting({ commit }, userSetting) {
            commit('setUserSetting', userSetting)
        },


        /**
         * 用户退出登录
         * @param commit
         * @returns {Promise<unknown>}
         */
        logout({ commit }) {
            return new Promise((resolve, reject) => {
                api.user.logout().then(() => {
                    commit('setUser', null)
                    return resolve()
                }).catch(err => {
                    return reject(err)
                })
            })
        },
    },
    modules: {
    }
})
