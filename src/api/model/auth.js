//import config from "@/config"
import http from "@/utils/request"

export default {
	token: {
		//url: `${config.API_URL}/token`,
		//url: `http://127.0.0.1:4523/m1/4301866-3944438-default/login`,
		url: `http://192.168.2.39:8888/login`,
		
		name: "登录获取TOKEN",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	}
}
