<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
		<el-form-item prop="user">
			<el-input v-model="form.user" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')">
				<!-- <template #append>
					<el-select v-model="userType" style="width: 130px;">
						<el-option :label="$t('login.admin')" value="admin"></el-option>
						<el-option :label="$t('login.user')" value="user"></el-option>
					</el-select>
				</template> -->
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password :placeholder="$t('login.PWPlaceholder')"></el-input>
		</el-form-item>
		<!-- <el-form-item style="margin-bottom: 10px;">
				<el-col :span="12">
					<el-checkbox :label="$t('login.rememberMe')" v-model="form.autologin"></el-checkbox>
				</el-col>
				<el-col :span="12" class="login-forgot">
					<router-link to="/reset_password">{{ $t('login.forgetPassword') }}？</router-link>
				</el-col>
		</el-form-item> -->
		<el-form-item>
			<el-button type="primary" style="width: 100%;" :loading="islogin" round @click="login">{{ $t('login.signIn') }}</el-button>
		</el-form-item>
		<Vcode :show="isShow" @success="success" @close="close" @fail="fail" :imgs="[Img]"></Vcode>
		<!-- <div class="login-reg">
			{{$t('login.noAccount')}} <router-link to="/user_register">{{$t('login.createAccount')}}</router-link>
		</div> -->
	</el-form>
	<sc-dialog v-model="dialogTimer" draggable title="提示" :show-fullscreen="false" :show-close="false">
		<span>这个对话框将在 {{ countdown }} 秒后自动关闭</span>
	</sc-dialog>
</template>

<script>

import Img from '@/assets/img/verifycode.png'
import Vcode from 'vue3-puzzle-vcode'
import { ref } from 'vue'
// console.log(Vcode)
const isShow = ref(false)

	export default {
		data() {
			return {
				form: {
					user: "",
					password: "",
					autologin: true
				},
				rules: {
					user: [
						{required: true, message: this.$t('login.userError'), trigger: 'blur'}
					],
					password: [
						{required: true, message: this.$t('login.PWError'), trigger: 'blur'}
					]
				},
				islogin: false,
				Img:Img,
				isShow:isShow,
				tmpRet:[],
				dialogTimer: false,
				count: 5, // 初始倒计时秒数
				timer: null, // 计时器
			}
		},
		watch:{
			dialogTimer(newVal) {
				if (newVal) {
				this.startCountdown();
				} else {
				this.clearTimer();
				}
			},
			count(newVal) {
				if (newVal <= 0) {
					this.dialogTimer = false;
					this.goToHome(this.tmpRet)
				}
			},
		},
		mounted() {

		},
		methods: {
			async success(){
				isShow.value = false
				this.islogin = true
				var data = {
					username: this.form.user,
					//password: this.$TOOL.crypto.MD5(this.form.password)
					password: this.$TOOL.crypto.AES.encrypt(this.form.password,'12345678')
				}
				//获取token
				var ret = await this.$API.auth.token.post(data)
				ret.error_code = 0 //先写死这个code
				ret.result.user.expire_date = '2024-07-01'
				ret.result.user.access_token = 'qqqqqqqqqqqq'
				ret.result.user.reset_pwd = 0
				if( [0].includes(ret.error_code) && ret.result){
					if(new Date(ret.result.user.expire_date).getTime() < new Date().getTime())
					{
						this.islogin = false
						this.$message.error(this.$i18n.messages[this.$i18n.locale].auth.expire_timeout)
						return false
					}
					if(ret.result.user.reset_pwd == 1)
					{
						this.$router.replace({
							path: '/reset_password'
						})
					}
					ret.result.auth.expire_status=1
					switch(ret.result.auth.expire_status) {
						case 0:
						// 可不处理
						this.goToHome(ret)
						case 1:
							this.tmpRet = ret
						this.openTimer()
						break
						// 以错误模式提示
						case 2:
						break
						// 以警告模式提示
						break;
						default:
						this.goToHome(ret)
						//可不处理
							break;
					}
				}else{					
					this.islogin = false
					this.$message.error(ret.error_message)
					if(ret.error_code == 4)
					{
						this.$router.replace({
							path: '/reset_password'
						})
					}
					if(ret.error_code == 3)
					{
						this.$router.replace({
							path: '/login'
						})
					}
					return false
				}

			},
			async goToHome(ret)
			{
				// 计算时间戳之间的差值
				const difference = Math.abs(new Date(ret.result.user.expire_date).getTime() - new Date().getTime())
				// 将差值转换为秒
				const sec = Math.floor(difference / 1000);
				this.$TOOL.cookie.set("TOKEN", ret.result.user.access_token, {
					expires: this.form.autologin ? sec : 0
				})
				this.$TOOL.data.set("USER_INFO", ret.result)
				this.$TOOL.data.set("CURRENT_SITE", ret.result.user.site_app_auth[0])

				//获取菜单
				var menu = null
				if(this.form.user == 'admin'){
					menu = await this.$API.system.menu.myMenus.get()
				}else{
					menu = await this.$API.demo.menu.get()
				}
				if(menu.code == 200){
					if(menu.data.menu.length==0){
						this.islogin = false
						this.$alert("当前用户无任何菜单权限，请联系系统管理员", "无权限访问", {
							type: 'error',
							center: true
						})
						return false
					}
					this.$TOOL.data.set("MENU", menu.data.menu)
					this.$TOOL.data.set("PERMISSIONS", menu.data.permissions)
					this.$TOOL.data.set("DASHBOARDGRID", menu.data.dashboardGrid)
				}else{
					this.islogin = false
					this.$message.warning(menu.message)
					return false
				}

				this.$router.replace({
					path: '/'
				})
				this.$message.success("Login Success 登录成功")
				this.islogin = false
				console.log('验证通过')
			},
			async close(){
				isShow.value = true
			},
			async fail(){
				console.log('验证失败')
			},
			async login(){
				var validate = await this.$refs.loginForm.validate().catch(()=>{})
				if(!validate){ return false }
				isShow.value = true
			},
			openTimer(){
				this.dialogTimer = true
				if(this.count<0)
				{
					this.count = 5
				}
				this.startCountdown()
			},
			handleClose(done) {
				this.clearTimer()
				done()
			},
			startCountdown() {
				if (this.timer) {
					return;
				}
				this.timer = setInterval(() => {
				if (this.count > 0) {
					this.count--;
				}
				}, 1000);
			},
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			beforeDestroy() {
				alert(123)
				this.clearTimer();
			},
		},

		computed: {
			countdown() {
				return this.count > 0 ? this.count : '关闭';
			},
		},
		components: {
			Vcode,
		}
	}
</script>

<style>
</style>
