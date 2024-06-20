//import config from "@/config"
import http from "@/utils/request"

export default {
	token: {
		//url: `${config.API_URL}/token`,
		//url: `http://192.168.31.241:8888/login`,
		url: `http://10.0.29.67:8888/login`,
		name: "登录获取TOKEN",
		post: async function(data={}){
			return await http.post(this.url, data);
		},
		del: async function(){
			return await http.delete(this.url);
		},//注销用户
	},
	user:{
		//url: `http://192.168.31.241:8888/system/user`,
		url: `http://10.0.29.67:8888/system/user`,
		name: "用户信息",
		get: async function(params){
			return await http.get(this.url, params);
		},//获取用户
		post: async function(data={}){
			return await http.post(this.url, data);
		},//创建用户
		put: async function(data={}){
			return await http.put(this.url, data);
		},//更新用户信息，包括重置密码
		del: async function(data={}){
			return await http.delete(this.url, data);
		},//删除用户
	},
}
