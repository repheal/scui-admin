<!--
 * @Descripttion: scDialog 弹窗扩展演示文件
 * @version: 1.0
 * @Author: sakuya
 * @Date: 2021年8月27日08:56:30
 * @LastEditors:
 * @LastEditTime:
-->

<template>
	<el-main>
		<el-alert title="二次封装el-dialog,加入加载中/最大化." type="success" style="margin:0 0 20px 0;"></el-alert>
		<el-card shadow="never" header="内置">
			<el-button type="primary" @click="open1">默认</el-button>
			<el-button type="primary" @click="open2">加载</el-button>
			<el-button type="primary" @click="open3">禁止拖拽最大化和关闭</el-button>
			<el-button type="primary" @click="open4">倒计时</el-button>
		</el-card>
		<el-card shadow="never" header="异步" style="margin-top: 15px;">
			<el-button type="primary" @click="asyn1">异步加载1</el-button>
			<el-button type="primary" @click="asyn2">异步加载2</el-button>
			<el-alert title="适用于页面有很多弹窗操作,利用异步组件按需加载,加快首屏的加载速度和打包体积" style="margin-top: 20px;"></el-alert>
		</el-card>
	</el-main>

	<sc-dialog v-model="dialog1" draggable title="提示">
		内容
		<template #footer>
			<el-button @click="dialog1 = false">取 消</el-button>
			<el-button type="primary" @click="dialog1 = false">确 定</el-button>
		</template>
	</sc-dialog>

	
	<sc-dialog v-model="dialog4" draggable title="提示">
		<span>这个对话框将在 {{ countdown }} 秒后自动关闭</span>
	</sc-dialog>

	<sc-dialog v-model="dialog2" draggable title="模拟加载" :width="400" :loading="dialog2Loading">
		<el-empty description="NO Data" :image-size="80"></el-empty>
		<template #footer>
			<el-button @click="dialog2 = false">取 消</el-button>
			<el-button type="primary" @click="dialog2 = false" :loading="dialog2Loading">确 定</el-button>
		</template>
	</sc-dialog>

	<sc-dialog v-model="dialog3" title="禁用拖拽" :show-fullscreen="false" :show-close="false">
		内容
		<template #footer>
			<el-button @click="dialog3 = false">取 消</el-button>
			<el-button type="primary" @click="dialog3 = false">确 定</el-button>
		</template>
	</sc-dialog>

	<dialog1 v-if="asynDialog1" draggable @closed="asynDialog1 = false"></dialog1>
	<dialog2 v-if="asynDialog2" draggable @closed="asynDialog2 = false"></dialog2>

</template>

<script>
	import { defineAsyncComponent } from 'vue'

	export default {
		name: 'dialogExtend',
		components: {
			dialog1: defineAsyncComponent(() => import("./dialog1")),
			dialog2: defineAsyncComponent(() => import("./dialog2")),
		//	dialog4: defineAsyncComponent(() => import("./dialog4"))
		},
		data() {
			return {
				dialog1: false,
				dialog2: false,
				dialog3: false,
				dialog4: false,
				dialog2Loading: false,
				asynDialog1: false,
				asynDialog2: false,
				count: 10, // 初始倒计时秒数
				timer: null, // 计时器
			}
		},
		mounted() {

		},
		methods: {
			open1(){
				this.dialog1 = true
			},
			open2(){
				this.dialog2 = true
				this.dialog2Loading = true
				setTimeout(()=>{
					this.dialog2Loading = false
				}, 1000)
			},
			open3(){
				this.dialog3 = true
			},
			open4(){
				this.dialog4 = true
				if(this.count<0)
				{
					this.count = 10
				}
				this.startCountdown()
			},
			asyn1(){
				this.asynDialog1 = true
			},
			asyn2(){
				this.asynDialog2 = true
			},


			handleClose(done) {
				this.clearTimer();
				done();
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
				this.clearTimer();
			},
		},
		computed: {
			countdown() {
				return this.count > 0 ? this.count : '关闭';
			},
		},
		watch: {
			dialog4(newVal) {
				if (newVal) {
				this.startCountdown();
				} else {
				this.clearTimer();
				}
			},
			count(newVal) {
				if (newVal <= 0) {
				this.dialog4 = false;
				}
			},
		},
	}
</script>

<style>
</style>
