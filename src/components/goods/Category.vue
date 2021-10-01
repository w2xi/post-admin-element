<template>
	<div>
		<!-- 导航面包屑 -->
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<!-- 添加分类 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
				</el-col>
			</el-row>

			<tree-table
				:data="categoryList"
				:columns="tablesColumns"
				show-index
				index-text="#"	
				:selection-type="false"
				:expand-type="false"
				border
				stripe
			>
				<template slot="isUsed" slot-scope="scope">
					<i v-if="!scope.row.cat_deleted" class="el-icon-circle-check" style="color: #0f0"></i>
					<i v-else class="el-icon-circle-close" style="color: red"></i>
				</template>

				<template slot="level" slot-scope="scope">
					<el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
					<el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
					<el-tag v-else-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
				</template>

				<template slot="action" slot-scope="scope">
					<el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
					<el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCategory(scope.row.cat_id)">删除</el-button>
				</template>
			</tree-table>

			<!-- 分页 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[5, 10, 15]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</el-card>

		<!-- 编辑分类对话框 -->
		<el-dialog
			title="编辑分类"
			:visible.sync="editCateDialogVisible"
			width="50%"
			@close="$refs.editCateFormRef.resetFields()"
		>
			<el-form
				:model="editCateForm"
				:rules="editCateFormRules"
				ref="editCateFormRef"
				label-width="90px"
			>
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="editCateForm.cat_name" placeholder="请输入分类名称"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editCateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editCategory">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 添加分类 dialog -->
		<el-dialog
			title="添加分类"
			:visible.sync="addCateDialogVisible"
			width="50%"
			@close="closeAddCateDialog"
		>
			<el-form
				:model="addCateForm"
				:rules="addCateFormRules"
				ref="addCateFormRef"
				label-width="90px"
			>
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="addCateForm.cat_name" placeholder="请输入分类名称"></el-input>
				</el-form-item>
				<el-form-item label="父级分类">
					<el-cascader
						ref="cascaderRef"
						v-model="selectedKeys"
						:options="parentCateList"	
						:props="{ label: 'cat_name', value: 'cat_id', checkStrictly: true, expandTrigger: 'hover' }"
						placeholder="请选择( 或者搜索 )"
						@change="handleCascaderChange"
						clearable
						filterable
					>
					</el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCetegory">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data(){
		return {
			categoryList: [],
			queryInfo: {
				type: [1,2,3],
				pagenum: 1,
				pagesize: 5,
			},
			total: 0,
			loading: false,
			tablesColumns: [
				{ label: '分类名称', prop: 'cat_name' },
				{ 
					label: '是否有效', 
					type: 'template',  
					template: 'isUsed',
				},
				{ 
					label: '等级', 
					type: 'template',  
					template: 'level',
				},

				{
					label: '操作',
					type: 'template',
					template: 'action',
				}
			],

			selectedKeys: [],
			parentCateList: [],

			addCateDialogVisible: false,
			addCateForm: {
				cat_name: '',
				cat_pid: 0,
				cat_level: 0,
			},
			addCateFormRules: {
				cat_name: [
					{ required: true, message: '请输入分类名称', trigger: 'blur' },
				],
			},

			editCateDialogVisible: false,
			editCateForm: {
				cat_name: '',
			},
			editCateFormRules: {
				cat_name: [
					{ required: true, message: '请输入分类名称', trigger: 'blur' },
				],
			},
		}
	},

	created(){
		this.getCategoryList()
	},

	methods: {
		async getCategoryList(){
			this.loading = true

			const { data: res } = await this.$http.get('categories', { params: this.queryInfo })

			if ( res.meta.status === 200 ){
				this.categoryList = res.data.result
				this.total = res.data.total
				this.pagenum = res.data.pagenum
			}else{
				this.$message.error('获取数据失败')
			}

			this.loading = false
		},

		handleSizeChange(newSize){
			this.queryInfo.pagesize = newSize

			this.getCategoryList()
		},

		handleCurrentChange(newPage){
			this.queryInfo.pagenum = newPage

			this.getCategoryList()
		},

		// 删除分类
		deleteCategory(categoryId){
			this.$confirm('是否删除该分类?', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
				this.$http.delete(`categories/${categoryId}`)
					.then(res => {
						res = res.data
	
						if ( res.meta.status === 200 ){
							this.$message.success('删除成功')
							this.getCategoryList()
						}else{
							this.$message.error('删除失败')
						}
					}).catch(err => err)
			}).catch(err => err)
		},

		showEditCateDialog(categoryId){
			this.$http.get(`categories/${categoryId}`)
				.then(res => {
					res = res.data

					if ( res.meta.status === 200 ){
						this.editCateForm = res.data
						this.editCateDialogVisible = true
					}else {
						this.$message.error('获取分类失败')
					}
				})
		},

		// 编辑分类
		editCategory(){
			const { cat_id, cat_name } = this.editCateForm

			this.$http.put(`categories/${cat_id}`, {
				cat_name,
			}).then(res => {
				res = res.data

				if ( res.meta.status === 200 ){
					this.$message.success('更新成功')
					this.getCategoryList()
				}else {
					this.$message.error('更新失败')
				}
			}).finally(() => {
				this.editCateDialogVisible = false
			})
		},

		// 显示添加分类对话框
		showAddCateDialog(){
			this.$http.get('categories', {
				params: {
					type: [2],
				}
			}).then(res => {
				res = res.data

				if ( res.meta.status === 200 ){
					this.parentCateList = res.data
				}else {
					this.$message.error('获取数据失败')
				}
			}).finally(() => {
				this.addCateDialogVisible = true
			})
		},

		// 添加分类
		addCetegory(){
			this.$http.post('categories', this.addCateForm)
				.then(res => {
					res = res.data

					if ( res.meta.status === 201 ){
						this.$message.success('添加分类成功')

						this.getCategoryList()
					}else {
						this.$message.error('添加分类失败')
					}
				}).finally(() => {
					this.addCateDialogVisible = false
				})
		},

		handleCascaderChange(){
			const len = this.selectedKeys.length

			if ( len > 0 ){
				this.addCateForm.cat_pid = this.selectedKeys[len - 1]
				this.addCateForm.cat_level = len
			}else {
				this.addCateForm.cat_pid = 0
				this.addCateForm.cat_level = 0
			}
		},

		// 关闭添加分类对话框的处理
		closeAddCateDialog(){
			// reset form
			this.$refs.addCateFormRef.resetFields()
			this.selectedKeys = []
		},
	},

}
</script>

<style scoped>
.el-table,
.el-pagination,
.zk-table {
	margin-top: 15px;
}

.el-cascader {
	width: 100%;
}

</style>