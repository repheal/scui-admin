/*
 * @Descripttion: 工具集
 * @version: 1.2
 * @LastEditors: sakuya
 * @LastEditTime: 2022年5月24日00:28:56
 */

import CryptoJS from 'crypto-js';
import sysConfig from "@/config";

const tool = {}

/* localStorage */
tool.data = {
	set(key, data, datetime = 0) {
		//加密
		if(sysConfig.LS_ENCRYPTION == "AES"){
			data = tool.crypto.AES.encrypt(JSON.stringify(data), sysConfig.LS_ENCRYPTION_key)
		}
        let cacheValue = {
            content: data,
            datetime: parseInt(datetime) === 0 ? 0 : new Date().getTime() + parseInt(datetime) * 1000
        }
        return localStorage.setItem(key, JSON.stringify(cacheValue))
	},
	get(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key))
            if (value) {
                let nowTime = new Date().getTime()
                if (nowTime > value.datetime && value.datetime != 0) {
                    localStorage.removeItem(key)
                    return null;
                }
				//解密
				if(sysConfig.LS_ENCRYPTION == "AES"){
					value.content = JSON.parse(tool.crypto.AES.decrypt(value.content, sysConfig.LS_ENCRYPTION_key))
				}
                return value.content
            }
            return null
        } catch (err) {
            return null
        }
	},
	remove(key) {
		return localStorage.removeItem(key)
	},
	clear() {
		return localStorage.clear()
	}
}

/*sessionStorage*/
tool.session = {
	set(table, settings) {
		var _set = JSON.stringify(settings)
		return sessionStorage.setItem(table, _set);
	},
	get(table) {
		var data = sessionStorage.getItem(table);
		try {
			data = JSON.parse(data)
		} catch (err) {
			return null
		}
		return data;
	},
	remove(table) {
		return sessionStorage.removeItem(table);
	},
	clear() {
		return sessionStorage.clear();
	}
}

/*cookie*/
tool.cookie = {
	set(name, value, config={}) {
		var cfg = {
			expires: null,
			path: null,
			domain: null,
			secure: false,
			httpOnly: false,
			...config
		}
		var cookieStr = `${name}=${escape(value)}`
		if(cfg.expires){
			var exp = new Date()
			exp.setTime(exp.getTime() + parseInt(cfg.expires) * 1000)
			cookieStr += `;expires=${exp.toGMTString()}`
		}
		if(cfg.path){
			cookieStr += `;path=${cfg.path}`
		}
		if(cfg.domain){
			cookieStr += `;domain=${cfg.domain}`
		}
		document.cookie = cookieStr
	},
	get(name){
		var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"))
		if(arr != null){
			return unescape(arr[2])
		}else{
			return null
		}
	},
	remove(name){
		var exp = new Date()
		exp.setTime(exp.getTime() - 1)
		document.cookie = `${name}=;expires=${exp.toGMTString()}`
	}
}

/* Fullscreen */
tool.screen = function (element) {
	var isFull = !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
	if(isFull){
		if(document.exitFullscreen) {
			document.exitFullscreen();
		}else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		}else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}else{
		if(element.requestFullscreen) {
			element.requestFullscreen();
		}else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		}else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		}
	}
}

/* 复制对象 */
tool.objCopy = function (obj) {
	return JSON.parse(JSON.stringify(obj));
}

/* 日期格式化 */
tool.dateFormat = function (date, fmt='yyyy-MM-dd hh:mm:ss') {
	date = new Date(date)
	var o = {
		"M+" : date.getMonth()+1,                 //月份
		"d+" : date.getDate(),                    //日
		"h+" : date.getHours(),                   //小时
		"m+" : date.getMinutes(),                 //分
		"s+" : date.getSeconds(),                 //秒
		"q+" : Math.floor((date.getMonth()+3)/3), //季度
		"S"  : date.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt;
}

/* 千分符 */
tool.groupSeparator = function (num) {
	num = num + '';
	if(!num.includes('.')){
		num += '.'
	}
	return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
		return $1 + ',';
	}).replace(/\.$/, '');
}

/* 常用加解密 */
tool.crypto = {
	//MD5加密
	MD5(data){
		return CryptoJS.MD5(data).toString()
	},
	//BASE64加解密
	BASE64: {
		encrypt(data){
			return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data))
		},
		decrypt(cipher){
			return CryptoJS.enc.Base64.parse(cipher).toString(CryptoJS.enc.Utf8)
		}
	},
	//AES加解密
	AES: {
		encrypt(data, secretKey, config={}){
			if(secretKey.length % 8 != 0){
				console.warn("[SCUI error]: 秘钥长度需为8的倍数，否则解密将会失败。")
			}
			const result = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
				iv: CryptoJS.enc.Utf8.parse(config.iv || ""),
				mode: CryptoJS.mode[config.mode || "CBC"],
				padding: CryptoJS.pad[config.padding || "Pkcs7"]
			})
			return result.toString()
		},
		decrypt(cipher, secretKey, config={}){
			const result = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Utf8.parse(secretKey), {
				iv: CryptoJS.enc.Utf8.parse(config.iv || ""),
				mode: CryptoJS.mode[config.mode || "CBC"],
				padding: CryptoJS.pad[config.padding || "Pkcs7"]
			})
			return CryptoJS.enc.Utf8.stringify(result);
		}
	}
}

/*截取字符并补位*/
tool.getBytesByLength =  function (key, padding, begin = 0, length = 16) {
	let keyLength = key.length;
	if (keyLength >= length) {
	  return key.slice(0, length);
	}
	let paddingLength = padding.length;
	let paddingIndex = begin;
	while (keyLength < length) {
	  let paddingChar = padding[paddingIndex % paddingLength];
	  if (keyLength === 0 && paddingChar === "0") {
		paddingIndex++;
		continue;
	  }
	  key += paddingChar;
	  paddingIndex++;
	  keyLength++;
	}
	return key;
}

/* httpvalue传输过程中加解密 */
tool.httpvalue = {
	//AES加解密
	AES: {
		encrypt(value,param,userid = 0,access_token = 0){
			if(!access_token)
			{
				var currentDate = new Date()
				access_token = tool.dateFormat(currentDate,'yyyyMMdd')
				userid = userid.toString()
			}
			var key = tool.getBytesByLength(param,access_token,param.length)
			var iv  = tool.getBytesByLength(userid,access_token,userid % 16)
			  	value = CryptoJS.enc.Utf8.parse(value)
			  	key = CryptoJS.enc.Utf8.parse(key) // 替换为你的密钥
			  	iv  = CryptoJS.enc.Utf8.parse(iv) // 替换为你的初始向量
			//  console.log(1111,key.toString(),iv.toString(),value.toString())
			 var encrypted = CryptoJS.AES.encrypt(value, key, { 
				iv: iv, 
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.ZeroPadding
			})
			console.log(encrypted.toString())
			return encrypted.toString()
		},
		decrypt(value,param,userid = 0,access_token = 0){
			if(userid !== 0)
			{
				var userinfo = tool.data.get('USER_INFO')
				console.log(userinfo)
				access_token = userinfo.user.access_token
				userid 		 = userinfo.user.id
			}
			else
			{
				var currentDate = new Date()
				access_token = tool.dateFormat(currentDate,'yyyyMMdd')
				userid = userid.toString()
			}

			var key = tool.getBytesByLength(param,access_token,param.length)
			var iv  = tool.getBytesByLength(userid,access_token,userid % 16)
			// console.log(key,iv)
			// console.log(value,param,userid,access_token)
				key = CryptoJS.enc.Utf8.parse(key) // 替换为你的密钥
				iv  = CryptoJS.enc.Utf8.parse(iv) // 替换为你的初始向量
			const decrypted = CryptoJS.AES.decrypt(value, key, {
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.ZeroPadding
			})
			var decryptedValue = decrypted.toString(CryptoJS.enc.Utf8);

			return decryptedValue
		}
	}
}

export default tool
