<template>

	<el-main style="padding:0 20px;">
		<el-descriptions :column="1" border size="small">
			<el-descriptions-item label="用户">{{data.create_username}}</el-descriptions-item>
			<el-descriptions-item label="客户端IP">{{data.create_ip}}</el-descriptions-item>
			<!-- <el-descriptions-item label="详情">{{data.description}}</el-descriptions-item> -->
			<el-descriptions-item label="操作">{{data.action}}</el-descriptions-item>
			<el-descriptions-item label="日志时间">{{data.create_time}}</el-descriptions-item>
		</el-descriptions>
		<el-collapse v-model="activeNames" style="margin-top: 20px;">
			<el-collapse-item title="详细" name="1">
				<div class="code">
					{{data.description}}
				</div>
			</el-collapse-item>
		</el-collapse>
	</el-main>
</template>

<script>
	export default {
		data() {
			return {
				data: {},
				activeNames: ['1'],
				typeMap: {
					'info': "info",
					'warn': "warning",
					'error': "error"
				}
			}
		},
		methods: {
			setData(data){
				this.data = data
			}
		}
	}
</script>

<style scoped>
	.code {background: #848484;padding:15px;color: #fff;font-size: 12px;border-radius: 4px;}
</style>
