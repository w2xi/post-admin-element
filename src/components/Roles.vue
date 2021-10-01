<template>
	<div>
		<!-- 导航面包屑 -->
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<!-- 添加角色 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
				</el-col>
			</el-row>
      
      <!-- 角色列表 -->
			<el-table
        :data="roleList"
        style="marginTop: 20px"
        border
        stripe
			>
				<!-- 扩展项 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<template v-for="(child1, index1) of scope.row.children">
							<!-- 分割线 -->
							<el-divider v-if="scope.row.children.length > 1 && index1 !== 0" :key="child1.id"></el-divider>
							<el-row :key="child1.id">
								<!-- 一级权限 -->
								<el-col :span="5" class="expand-col-right">
									<el-tag closable @close="removeRightById(scope.row, child1.id)">{{ child1.authName }}</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								<el-col :span="19">
									<template v-for="(child2, index2) of child1.children">
										<!-- 分割线 -->
										<el-divider v-if="child1.children.length > 1 && index2 !== 0" :key="child2.id"></el-divider>
										<el-row :key="child2.id">
											<!-- 二级权限 -->
											<el-col :span="5">
												<el-tag type="success" closable @close="removeRightById(scope.row, child2.id)">{{ child2.authName }}</el-tag>
												<i class="el-icon-caret-right"></i>
											</el-col>
											<!-- 三级权限 -->
											<el-col :span="19">
												<el-tag type="warning" v-for="child3 of child2.children" :key="child3.id" closable @close="removeRightById(scope.row, child3.id)"
												>
													{{ child3.authName }}
												</el-tag>
											</el-col>
										</el-row>
									</template>
								</el-col>
							</el-row>
						</template>
					</template>
				</el-table-column>
				<el-table-column label="#" type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column lable="操作">
					<template slot-scope="scope">
						<el-button @click="showEditRoleDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
						<el-button @click="deleteRoleById(scope.row.id)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
						<el-button @click="showAllocateRoleDialog(scope.row)" type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 添加角色 -->
		<el-dialog
			title="添加角色"
			:visible.sync="addRoleDialogVisible"
			width="50%"
			@close="$refs.addRoleFormRef.resetFields()"
		>
			<el-form
				:model="roleForm"
				:rules="roleFormRules"
				ref="addRoleFormRef"
			>
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="roleForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="roleForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addRole" :loading="showLoading">确 定</el-button>
		  </span>
		</el-dialog>

		<!-- 编辑角色 -->
		<el-dialog
			title="编辑角色"
			width="50%"
			:visible.sync="editRoleDialogVisible"
			@close="$refs.editRoleFormRef.resetFields()"
		>
			<el-form
				:model="roleForm"
				:rules="roleFormRules"
				ref="editRoleFormRef"
			>
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="roleForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="roleForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editRole" :loading="showLoading">确 定</el-button>
		  </span>
		</el-dialog>

		<!-- 分配角色权限对话框 -->
		<el-dialog
			title="分配角色"
			width="50%"
			:visible.sync="allocateRoleDialogVisible"
			@close="thirdRightIdList = []"
		>
			<!-- 树形结构权限分配 -->
			<el-tree
			  :data="rightList"
			  show-checkbox
			  :default-checked-keys="thirdRightIdList"
			  node-key="id"
			  :props="{children: 'children', label: 'authName'}"
			  default-expand-all
			  ref="treeRef"
			>
			</el-tree>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="allocateRoleDialogVisible = false">取 消</el-button>
		    <el-button 
		    	type="primary" 
		    	:loading="showLoading"
		    	@click="allocateRoleRight"
		    >
		  		确 定
		  	</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data(){
		return {
			showLoading: false,
			roleList: [],
			rightList: [],
			addRoleDialogVisible: false,
			editRoleDialogVisible: false,
			allocateRoleDialogVisible: false,
			roleForm: {
				roleName: '',
				roleDesc: '',
			},
			roleFormRules: {
				roleName: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' }
				],
				roleDesc: [
					{ required: true, message: '请输入角色描述', trigger: 'blur' }
				],
			},
			thirdRightIdList: [],
			// 要分配权限的角色id
			currentRoleId: null
		}
	},

	computed: {
		
	},

	created(){
		this.getRoleList()
	},

	methods: {
		getRoleList(){
			this.loading = true

			this.$http.get('roles').then(res => {
				res = res.data

				if ( res.meta.status === 200 ){
					this.roleList = res.data
				} else {
					this.$message.error('获取角色列表失败')
				}
			}).finally(() => {
				this.loading = false
			})
		},

		// 新增角色
		addRole(){
			this.$refs.roleFormRef.validate(valid => {
				if ( valid ){
					this.showLoading = true

					this.$http.post('roles', {
						roleName: this.roleForm.roleName,
						roleDesc: this.roleForm.roleDesc,
					}).then(res => {
						res = res.data

						if ( res.meta.status === 201 ){
							this.$message.success('创建成功')
							this.getRoleList()
						} else {
							this.$message.error('创建失败')
						}
					}).finally(() => {
						this.showLoading = false
						this.addRoleDialogVisible = false
					})
				}
			})
		},

		// 显示编辑角色的对话框
		showEditRoleDialog(roleId){
			this.editRoleDialogVisible = true

			this.$http.get('roles/' + roleId).then(res => {
				res = res.data

				if ( res.meta.status === 200 ){
					this.roleForm = res.data
				}else {
					this.$message.error('查询角色信息失败')
				}
			}).catch(err => err)
		},

		// 编辑角色
		editRole(){
			this.$refs.editRoleFormRef.validate(valid => {
				if ( valid ){
					this.$http.put('roles/' + this.roleForm.roleId, {
						roleName: this.roleForm.roleName,
						roleDesc: this.roleForm.roleDesc,
					}).then(res => {
						res = res.data

						if ( res.meta.status === 200 ){
							this.$message.success('编辑成功')
							this.getRoleList()
						}else {
							this.$message.error('编辑失败')
						}
					}).catch(err => err)
						.finally(() => {
							this.editRoleDialogVisible = false
						})
				}
			})
		},

		// 删除角色
		deleteRoleById(roleId){
			this.$confirm('是否删除角色?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
      	const { data: res } = await this.$http.delete(`roles/${roleId}`)

				if ( res.meta.status === 200 ){
					this.$message.success('删除成功')
					this.getRoleList()
				} else{
					this.$message.error('删除失败')
				}
      }).catch(err => err)
		},

		// 移除权限
		removeRightById(role, rightId){
			this.$confirm('是否移除角色的权限?', '移除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
      	const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

				if ( res.meta.status === 200 ){
					this.$message.success('移除权限成功')
					
					role.children = res.data
				} else{
					this.$message.error('移除权限失败')
				}
      }).catch(err => err)
		},

		// 显示分配角色的对话框
		showAllocateRoleDialog(role){
			this.currentRoleId = role.id
			// 树形结构

			this.$http.get('rights/tree').then(res => {
				res = res.data

				if ( res.meta.status === 200 ){
					this.rightList = res.data
				} else {
					this.$message.error('获取权限列表失败')
				}
			}).catch(err => err)
				.finally(() => {
					this.thirdRightIdList = this.getThirdRightIdList(role)
					this.allocateRoleDialogVisible = true
				})
		},

		// 分配角色权限
		allocateRoleRight(){
			const keys = [
				...this.$refs.treeRef.getCheckedKeys(),
				...this.$refs.treeRef.getHalfCheckedKeys()
			]
			const keyIds = keys.join(',')

			this.showLoading = true

			this.$http.post(`roles/${this.currentRoleId}/rights`, {
				rids: keyIds
			}).then(res => {
				res = res.data

				if ( res.meta.status === 200 ){
					this.$message.success('分配角色成功')
					this.getRoleList()
				} else{
					this.$message.error('分配角色失败')
				}
			}).finally(() => {
				this.showLoading = false
				this.allocateRoleDialogVisible = false
			})

		},

		// 获取三级权限列表id
		getThirdRightIdList(role){
			const rightIdList = []

			for ( let child1 of role.children)
			{
				for ( let child2 of child1.children )
				{
					for ( let child3 of child2.children )  
					{
						rightIdList.push(child3.id)
					}
				}
			}

			return rightIdList
		},
	},
}
</script>

<style scoped>
.el-row {
	display: flex;
	align-items: center;
	text-align: left;
}

.expand-col-right {
	padding: 20px 50px; 
}

.el-tag {
	margin-right: 15px;
}
</style>