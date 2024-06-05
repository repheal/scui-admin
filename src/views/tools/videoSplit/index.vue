<template>
  <div class="video-layout">
	<el-row :gutter="10" type="flex" class="row-bg" justify="start">
		<el-col :span="17">
			<div class="grid-video">
				<sc-video-split :src="playUrl" :options="options" ></sc-video-split>
			</div>
			<div class="grid-point">打点条</div>
		</el-col>
		<el-col :span="7"><div class="grid-catalog" >编目信息</div></el-col>
	</el-row> 
	<el-row :gutter="10" type="flex" class="row-bg" justify="start">
		<el-col :span="24"><div class="grid-list">列表</div></el-col>
	</el-row>
  </div>
	
</template>

<script>
	import scVideoSplit from '@/components/scVideoSplit'

	export default {
		name: 'scvideosplit',
		components: {
			scVideoSplit
		},
		data() {
			return {
				playUrl: "http://vod-demo.aihoge.com/video/2024/01/19/05f94d7945d6e363b3277c19414fdd8b.mp4",
				options: {
					poster: "https://fastly.jsdelivr.net/gh/scuiadmin/CDN/video/scui-player-demo-1080_Moment.jpg",
					pip: true
				}
			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
.video-layout{
	background-color: #292929;
	padding-top:10px;
	padding-left:5px;
}
.grid-video {    
    background-color: #fff;

	border:1px solid red;
    min-height: 430px;
  }
  .grid-point {    
    background-color: #fff;
	margin-top: 10px;
	border:1px solid red;
    min-height: 180px;
  }

  .grid-catalog{
	background-color: #fff;
	border:1px solid red;
	min-height: 620px;
  }
  .grid-list {    
    background-color: #fff;
	margin-top: 10px;
	border:1px solid red;
    min-height: 250px;
  }

</style>
