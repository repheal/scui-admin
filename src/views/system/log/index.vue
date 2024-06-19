<template>
	<el-container>
		<el-container>
			<el-main class="nopadding">
				<el-container>
					<el-header>
						<div class="left-panel">
							<el-select v-model="application" placeholder="应用" @change="selectModules" clearable :teleported="false" style="width:150px;margin-right: 5px;">
								<el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<el-select v-model="modules" placeholder="模块" clearable :teleported="false" style="width:150px;margin-right: 5px;">
								<el-option v-for="item in modOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<el-input v-model="search.keyword" placeholder="关键词" clearable style="width:150px;margin-right: 5px;"></el-input>
							<el-date-picker v-model="date" type="daterange" :disabled-date="disabledDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
						</div>
						<div class="right-panel">
						<el-button type="primary" @click="upsearch">查询</el-button>
						</div>
					</el-header>
					<el-main class="nopadding">
						<scTable ref="table" :apiObj="apiObj" :params="params" stripe highlightCurrentRow @row-click="rowClick">
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
				params:{},
				application:'',
				appOptions:[
						{
							value: '',
							label: '',
						}
					],
				modules:'',
				allModOptions:[],
				modOptions:[],
				search: {
					keyword: ""
				}
			}
		},
		mounted() {
			var current_site = this.$TOOL.data.get("CURRENT_SITE")
				var app_auth = []
				if(current_site && current_site.app_auth)
				{
					app_auth = current_site.app_auth
					var i = 0
					Object.entries(app_auth).forEach(([authKey,authItem]) => {
						this.appOptions[i].value = authKey
						this.appOptions[i].label = authItem.name
						var j = 0
						var allModules = []
						Object.entries(authItem.modules).forEach(([moduleKey,moduleItem]) =>{
							var tmp = []
							tmp.value=moduleKey
							tmp.label=moduleItem.name
							allModules[j] = tmp
							this.allModOptions[authKey] = allModules
							j++
						})
						i++
						//console.log('---dds',this.allModOptions)
					})
					// console.log('---d',this.appOptions)
				}
				this.modOptions = this.allModOptions[this.appOptions[0].value]
		},
		computed:{
		},
		methods: {
			selectModules(val){
				this.modOptions = this.allModOptions[val]
			},
			upsearch(){
				if(this.date[0])
				{
					this.params.start_date = this.$TOOL.dateFormat(this.date[0],'yyyyMMdd')
					this.params.stop_date  = this.$TOOL.dateFormat(this.date[1],'yyyyMMdd')
				}
				if(this.application)
				{
					this.params.app_sign = this.application
				}
				if(this.modules)
				{
					this.params.module_sign = this.modules
				}

				if(this.search.keyword)
				{
					this.params.keyword = this.search.keyword
				}
console.log('--ggggg',this.params)
				if(this.params)
				{
					this.params.page = 1
					this.params.page_count = 20
					this.$refs.table.refresh()
				}
			},
			rowClick(row){
				this.infoDrawer = true
				this.$nextTick(() => {
					this.$refs.info.setData(row)
				})
			},
			disabledDate(time) {
				return time.getTime() > Date.now();
			}
		}
	}
</script>

<style>
</style>
