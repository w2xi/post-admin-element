<template>
	<div>
		<!-- 导航面包屑 -->
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-table 
				:data="rightList"
				v-loading="loading"
				:tree-props="{children: 'children'}"
				row-key="id"
				border 
				stripe
			>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="authName" label="权限名称"></el-table-column>
				<el-table-column prop="path" label="路径">
					<template slot-scope="scope">
						<el-tag>{{ scope.row.path }}</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
export default {
	data(){
		return {
			loading: false,
			rightList: []
		}
	},

	created(){
		this.getRightList()
	},

	methods: {
		async getRightList(){
			this.loading = true
			
			// 树形结构

			this.$http.get('rights/tree').then(res => {
				res = res.data

				if ( res.meta.status === 200 ){
					this.rightList = res.data
				} else {
					this.$message.error('获取权限列表失败')
				}
			}).finally(() => {
				this.loading = false
			})
		}
	},
}
</script>

<style scoped>

</style>