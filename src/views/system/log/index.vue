<template>
	<el-container>
		<el-container>
			<el-main class="nopadding">
				<el-container>
					<el-header>
						<div class="left-panel">
							<el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
						</div>
						<div class="right-panel">
						<el-button type="primary" @click="getData">查询</el-button>
						</div>
					</el-header>
					<el-main class="nopadding">
						<scTable ref="table" :data="filteredData" :apiObj="apiObj" stripe highlightCurrentRow @row-click="rowClick">
							<el-table-column label="级别" prop="level" width="60">
								<template #default="scope">
									<el-icon style="color: #409EFF;"><el-icon-info-filled /></el-icon>
									<el-icon v-if="scope.row.level=='error'" style="color: #F56C6C;"><el-icon-circle-close-filled /></el-icon>
									<el-icon v-if="scope.row.level=='warn'" style="color: #E6A23C;"><el-icon-warning-filled /></el-icon>
									<el-icon v-if="scope.row.level=='info'" style="color: #409EFF;"><el-icon-info-filled /></el-icon>
								</template>
							</el-table-column>
							<el-table-column label="用户" 	  	prop="create_username" width="80"></el-table-column>
							<el-table-column label="日志时间"	prop="create_time" width="150"></el-table-column>
							<el-table-column label="操作" 	prop="action" width="150"></el-table-column>
							<el-table-column label="详情"		prop="description" width="400"></el-table-column>
							<el-table-column label="客户端IP"	prop="create_ip" width="120"></el-table-column>
						</scTable>
					</el-main>
				</el-container>
			</el-main>
		</el-container>
	</el-container>

	<el-drawer v-model="infoDrawer" title="日志详情" :size="600" destroy-on-close>
		<info ref="info"></info>
	</el-drawer>
</template>

<script>
	import info from './info'
	import scEcharts from '@/components/scEcharts'

	export default {
		name: 'log',
		components: {
			info,
			scEcharts
		},
		data() {
			return {
				infoDrawer: false,
				date: [],
				apiObj: this.$API.system.log.list,
				filteredData:[],
				search: {
					keyword: ""
				}
			}
		},
		mounted() {
		},
		computed:{
		},
		methods: {
			getData(){
				var tag = 0
				alert(this.date)
				if(this.date)
				{

					tag = 1
				}

				if(tag == 1)
				{
					var params = []
					alert(params)
					// var ret = this.$API.system.log.list.get(params)
					// alert(ret)
				}
			},
			upsearch(){

			},
			rowClick(row){
				this.infoDrawer = true
				this.$nextTick(() => {
					this.$refs.info.setData(row)
				})
			}
		}
	}
</script>

<style>
</style>
