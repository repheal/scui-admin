<template>
	<div class="sc-video-split" ref="scVideoSplit"></div>
</template>

<script>
	import Player from 'xgplayer'

	export default {
		props: {
			src: { type: String, required: true, default: "" },
			autoplay: { type: Boolean, default: false },
			controls: { type: Boolean, default: true },
			loop: { type: Boolean, default: false },
			options: { type: Object, default: () => {} }
		},
		data() {
			return {
				player: null
			}
		},
		watch:{
			src(val){
				if(this.player.hasStart){
					this.player.src = val
				}else{
					this.player.start(val)
				}
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init(){
				this.player = new Player({
					el: this.$refs.scVideoSplit,
					url: this.src,
					autoplay: this.autoplay,
					loop: this.loop,
					controls: this.controls,
					fluid: true,
					lang: 'zh-cn',
					...this.options
				})
			}
		}
	}
</script>

<style scoped>
	.sc-video-split:deep(.danmu) > * {color: #fff;font-size:20px;font-weight:bold;text-shadow:1px 1px 0 #000,-1px -1px 0 #000,-1px 1px 0 #000,1px -1px 0 #000;}
	.sc-video-split:deep(.xgplayer-controls) {background-image: linear-gradient(180deg, transparent, rgba(0,0,0,0.3));}
	.sc-video-split:deep(.xgplayer-progress-tip) {border:0;color: #fff;background: rgba(0,0,0,.5);line-height: 25px;padding: 0 10px;border-radius: 25px;}
	.sc-video-split:deep(.xgplayer-enter-spinner) {width: 50px;height: 50px;}
</style>
