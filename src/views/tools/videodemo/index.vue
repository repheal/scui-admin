<template>
	<el-main>
		<!-- <el-alert title="播放器使用来自西瓜视频的西瓜播放器xgplayer" type="success" style="margin-bottom:20px;"></el-alert> -->
		<el-row :gutter="15">
			<el-col :lg="12">
				<el-card shadow="never" header="MP4点播">
					<sc-video :src="playUrl" :options="options"></sc-video>
				</el-card>
			</el-col>
		</el-row>
	</el-main>
</template>

<script>
	import scVideo from '@/components/scVideo'

	export default {
		name: 'scvideo',
		components: {
			scVideo
		},
		data() {
			return {
				playUrl: "https://fastly.jsdelivr.net/gh/scuiadmin/CDN/video/scui-player-demo-720.mp4",
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
</style>
