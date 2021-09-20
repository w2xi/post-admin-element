<template>
	<div>
		<!-- 导航面包屑 -->
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
		  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row :gutter="20">
				<el-col :span="7">
				  <el-input 
				  	v-model="queryInfo.query" 
				  	placeholder="请输入内容" 
				  	@clear="getUserList"
				  	clearable
				  >
				    <el-button slot="append" icon="el-icon-search" @click="getUserList">
				   	</el-button>
				  </el-input>
				</el-col>
				<el-col :span="8">
					<el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>

			<!-- 表格 -->
			<el-table :data="userList" v-loading="tableLoading" width="100%" tripe border>
		    <el-table-column type="index" label="#"></el-table-column>
		    <el-table-column prop="username" label="姓名"></el-table-column>
		    <el-table-column prop="email" label="邮箱"></el-table-column>
		    <el-table-column prop="mobile" label="电话"></el-table-column>
		    <el-table-column prop="role_name" label="角色"></el-table-column>
		    <el-table-column label="状态">
		    	<template slot-scope="scope">
		    		<el-switch
		    			v-model="scope.row.mg_state"
  						@change="handleSwitchChange(scope.row)"
						>
						</el-switch>
		    	</template>
		    </el-table-column>
		    <el-table-column label="操作">
		    	<template slot-scope="scope">
		        <el-button
		          size="mini"
		          type="primary"
		          icon="el-icon-edit"
		          @click="showEditUserDialog(scope.row.id)"
		        >
		      	</el-button>
		        <el-button
		          size="mini"
		          type="danger"
		          icon="el-icon-delete"
		          @click="handleDeleteUser(scope.row)"
		        >
		        </el-button>

		        <el-tooltip content="分配角色" placement="top" :enterable="false">
			        <el-button
			          size="mini"	
			          type="warning"
			          icon="el-icon-setting"
			          @click="roleDialogVisible = true"
			        >
			        </el-button>
						</el-tooltip>
		      </template>
		    </el-table-column>
		  </el-table>

		  <!-- 表格分页 -->
		  <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="queryInfo.pagenum"
	      :page-sizes="[3, 6, 9]"
	      :page-size="queryInfo.pagesize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="total"
	    >
	    </el-pagination>
		</el-card>

		<!-- 添加用户的对话框 -->
		<el-dialog
		  title="添加用户"
		  width="50%"
		  :visible.sync="addUserDialogVisible"
		  @close="$refs.userAddFormRef.resetFields()"
		>
		  <el-form 
		  	:model="userAddForm" 
		  	:rules="userAddFormRules"
		  	ref="userFormRef"
		  	label-width="70px"
		 	>
		  	<el-form-item label="用户名" prop="username">
			    <el-input v-model="userAddForm.username"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="password">
			    <el-input v-model="userAddForm.password"></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="email">
			    <el-input v-model="userAddForm.email"></el-input>
			  </el-form-item>
			  <el-form-item label="手机" prop="mobile">
			    <el-input v-model="userAddForm.mobile"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addUserDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addUser" :loading="showLoading">确 定</el-button>
		  </span>
		</el-dialog>

		<!-- 编辑用户的对话框 -->
		<el-dialog
		  title="编辑用户"
		  :visible.sync="editUserDialogVisible"
		  width="50%"
		  @close="$refs.userEditFormRef.resetFields()"
		>
		  <el-form 
		  	:model="userEditForm" 
		  	:rules="userEditFormRules"
		  	ref="userEditFormRef"
		  	label-width="70px"
		 	>
		  	<el-form-item label="用户名" prop="username">
			    <el-input v-model="userEditForm.username" disabled></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="email">
			    <el-input v-model="userEditForm.email"></el-input>
			  </el-form-item>
			  <el-form-item label="手机" prop="mobile">
			    <el-input v-model="userEditForm.mobile"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editUserDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editUser" :loading="showLoading">确 定</el-button>
		  </span>
		</el-dialog>

		<!-- 角色分配对话框 -->
		<el-dialog
		  title="分配用户"
		  :visible.sync="roleDialogVisible"
		  width="50%"
		>
		  <el-form 
		  	ref="roleEditFormRef"
		  	label-width="70px"
		 	>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="roleDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="roleDialogVisible = false" :loading="showLoading">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data(){
		return {
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 2,
			},
			userList: null,
			total: 0,
			addUserDialogVisible: false,
			editUserDialogVisible: false,
			roleDialogVisible: false,
			userAddForm: {
				username: '',
				password: '',
				email: '',
				mobile: '',
			},
			userAddFormRules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur'},
					{ min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur'}
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, max: 15, message: '密码的长度在6-10个字符之间', trigger: 'blur' },
				],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
				],
				mobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
				],
			},
			userEditForm: {},
			userEditFormRules: {
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
				],
				mobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
				],
			},
			showLoading: false,
			tableLoading: false,
		}
	},

	async created(){
		this.getUserList()
	},

	methods: {
		sleep(millisecond){
			return new Promise(resolve => {
				setTimeout(resolve, millisecond)
			})
		},

		async getUserList(){
			this.tableLoading = true

			const { data: res } = await this.$http.get('users', { params: this.queryInfo })

			if ( res.meta.status === 200 ){
				this.userList = res.data.users
				this.total = res.data.total
			}else {
				this.$message.error(res.meta.msg)
			}

			this.tableLoading = false 
		},

		async handleSwitchChange(userInfo){
			const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)

			if ( res.meta.status === 200 ){
				this.$message.success(res.meta.msg)
			}else {
				userInfo.mg_state = !userInfo.mg_state
				this.$message.error('设置状态失败')
			}
		},

		handleSizeChange(newPageSize){
			this.queryInfo.pagesize = newPageSize
			this.getUserList()
		},

		handleCurrentChange(newPage){
			this.queryInfo.pagenum = newPage
			this.getUserList()
		},

		addUser(){
			this.$refs.userAddFormRef.validate(async valid => {
				if ( valid ){
					this.showLoading = true

					const { data: res } = await this.$http.post('users', this.userAddForm)

					if ( res.meta.status === 201 ){
						this.$message.success('添加用户成功')
						this.getUserList()
					}else {
						this.$message.error('添加用户失败')
					}

					this.showLoading = false
					this.addUserDialogVisible = false
				}
			})
		},
		
		async showEditUserDialog(userId){
			const { data: res } = await this.$http.get('users/' + userId)

			if ( res.meta.status === 200 ){
				this.userEditForm = res.data				
			} else {
				this.$message.error('查询用户信息失败')				
			}		

			this.editUserDialogVisible = true
		},

		editUser(){
			this.$refs.userEditFormRef.validate(async valid => {
				if ( valid ){
					this.showLoading = true

					const { id: userId } = this.userEditForm
					const { data: res } = await this.$http.put(`users/${userId}`, {
						email: this.userEditForm.email,
						mobile: this.userEditForm.mobile
					})

					if ( res.meta.status === 200 ){
						this.$message.success('编辑用户成功')
						this.getUserList()
					}else {
						this.$message.error('编辑用户失败')
					}

					this.showLoading = false
					this.editUserDialogVisible = false
				}
			})
		},

		handleDeleteUser(userInfo){
			this.$confirm('是否删除用户?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
      	const { data: res } = await this.$http.delete(`users/${userInfo.id}`)

				if ( res.meta.status === 200 ){
					this.$message.success('删除成功')
					this.getUserList()
				} else{
					this.$message.error('删除失败')
				}
      }).catch(err => err)
		},

		handleSetUser(userInfo){

		}
	},
}
</script>

<style scoped>
.el-card {
	box-shadow: 0px 0px 2px rgba(0,0,0,.1) !important;
}

.el-table {
	margin-top: 20px;
}

.el-pagination {
	margin-top: 20px;
}
</style>