<template>
	<el-container>
		<el-header>
			<el-alert
				ref="success"
				:title="tips.data.title" 
				:description="tips.data.description"
				type="success" 
				:closable="false"
				v-show="tips.success"
				show-icon></el-alert>
			<el-alert 
				ref="warning"
				:title="tips.data.title" 
				:description="tips.data.description"
				type="warning" 
				:closable="false"
				v-show="tips.warning"
				show-icon></el-alert>
			<el-alert 
				ref="error"
				:title="tips.data.title" 
				:description="tips.data.description"
				type="error" 
				:closable="false"
				v-show="tips.error"
				show-icon></el-alert>
		
			<div class="left-panel">
				<el-button v-show="tips.warning" type="primary" plain icon="el-icon-plus" @click="add" style="height: 40px; width: 40px; margin-left: 10px;"></el-button>
				<!-- <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button> -->
			</div>
			<!-- 
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.keyword" placeholder="部门名称" clearable></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div> -->
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" row-key="id" @selection-change="selectionChange" hidePagination>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="部门名称" prop="label" width="250"></el-table-column>
				<el-table-column label="排序" prop="sort" width="150"></el-table-column>
				<el-table-column label="状态" prop="status" width="150">
					<template #default="scope">
						<el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
						<el-tag v-if="scope.row.status==0" type="danger">停用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="date" width="180"></el-table-column>
				<el-table-column label="备注" prop="remark" min-width="300"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="170">
					<template #default="scope">
						<el-button-group>
							<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
							<el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
								<template #reference>
									<el-button text type="primary" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>

			</scTable>
		</el-main>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './save'

	export default {
		name: 'dept',
		components: {
			saveDialog
		},
		data() {
			return {
				dialog: {
					save: false
				},
				//apiObj: this.$API.system.auth,
				selection: [],
				search: {
					keyword: null
				},
				tips:{
					success:false,
					warning:false,
					error:false,
					data:{
						title:"授权提醒",
						description:"",
					}
				},
			}
		},
		mounted(){
			var params=[]
				params.page = 1
				params.page_count = 1
				
				this.initData(params)
		},
		methods: {
			async initData(params){
				var ret = await this.$API.system.auth.get(params)
				if(ret.error_code == 0 && ret.result && ret.result.data[0])
				{
					console.log(ret.result)
					switch(ret.result.data[0].expire_status)
					{
						case 0:
						this.tips.success = true
							break;
						case 1:
						this.tips.error = true
							break;
						case 2:
						this.tips.warning = true
							break;
						default:
							break;
					}
					this.tips.data.description = ret.result.data[0].expire_prompt
				}
				else
				{
					this.$message.error(ret.error_message)
				}
			},
			//添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open()
				})
			},
			//编辑
			table_edit(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(row)
				})
			},
			//查看
			table_show(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('show').setData(row)
				})
			},
			//删除
			async table_del(row){
				var reqData = {id: row.id}
				var res = await this.$API.demo.post.post(reqData);
				if(res.code == 200){
					this.$refs.table.refresh()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？如果删除项中含有子集将会被一并删除`, '提示', {
					type: 'warning'
				}).then(() => {
					const loading = this.$loading();
					this.$refs.table.refresh()
					loading.close();
					this.$message.success("操作成功")
				}).catch(() => {

				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//搜索
			upsearch(){

			},
			//根据ID获取树结构
			filterTree(id){
				var target = null;
				function filter(tree){
					tree.forEach(item => {
						if(item.id == id){
							target = item
						}
						if(item.children){
							filter(item.children)
						}
					})
				}
				filter(this.$refs.table.tableData)
				return target
			},
			//本地更新数据
			handleSaveSuccess(data, mode){
				if(mode=='add'){
					this.$refs.table.refresh()
				}else if(mode=='edit'){
					this.$refs.table.refresh()
				}
			}
		}
	}
</script>

<style>
</style>
