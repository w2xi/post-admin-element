<template>
	<el-container>
	  <el-header>
	  	<div class="content">
	  		<img src="@/assets/logo.png" alt="logo" class="logo" />
	  		<span class="title">电商后台管理系统</span>
	  	</div>
	  	<el-button type="info" @click="logout" class="logout">退出</el-button>
	  </el-header>
	  <el-container>
	    <el-aside :width="isCollapse ? '64px' : '200px'">
	  		<div class="toggle-collapse" @click="toggleCollapse">|||</div>
	    	<el-menu
		      background-color="#373d3f"
		      text-color="#fff"
		      active-text-color="#41b883"
		      :collapse="isCollapse"
		      :collapse-transition="false"
		      :default-active="activePath"
		      unique-opened
		      router
		    >
		      <el-submenu 
		      	:index="item.id + ''" 
		      	v-for="item of menuList"
		      	:key="item.id"
		      >
		      	<template slot="title">
		          <i :class="iconsObj[item.id]"></i>
		          <span>{{ item.authName }}</span>
		        </template>
		        <el-menu-item 
		        	:index="'/' + child.path"
		        	@click="saveNavState('/' + child.path)"
		        	v-for="child of item.children"
		        	:key="child.id"
		        >
		        	 <template slot="title">
			          <i class="el-icon-menu"></i>
			          <span>{{ child.authName }}</span>
			        </template>
		        </el-menu-item>
		      </el-submenu>
		    </el-menu>
	    </el-aside>
	    <el-main>
	    	<router-view></router-view>
	    </el-main>
	  </el-container>
	</el-container>
</template>

<script>
export default {
	data(){
		return {
			menuList: null,
			iconsObj: {
				125: 'el-icon-user-solid',
				103: 'el-icon-s-grid',
				101: 'el-icon-s-shop',
				102: 'el-icon-s-order',
				145: 'el-icon-s-marketing',
			},
			isCollapse: false,
			activePath: '',
		}
	},

	created(){
		this.getMenuList()
		this.activePath = window.sessionStorage.activePath
	},

	methods: {
		logout(){
			sessionStorage.clear()
			this.$router.push('/login')
		},
		async getMenuList(){
			const { data: res } = await this.$http.get('menus')

			if ( res.meta.status === 200 ){
				this.menuList = res.data
			} else {
				this.$message.error(res.meta.msg)
			} 
		},
		toggleCollapse(){
			this.isCollapse = !this.isCollapse
		},
		saveNavState(path){
			window.sessionStorage.activePath = path
			this.activePath = path
		},
	}
}
</script>

<style scoped>
.el-container {
	height: 100%;
}

.el-header {
  display: flex;
  align-items: center;
  background-color: #373d3f;
  color: #333;
}

.el-header .content {
	height: 100%;
	display: flex;
  align-items: center;
  margin-left: 5px;
  color: #f5f5f5;
}

.el-header .logo {
	height: 50px;
}

.el-header .title {
	font-size: 18px;
	margin-left: 10px;
}

.el-header .logout {
	height: 40px;
	position: absolute;
	right: 20px;
	border-radius: 6px;
}
  
.el-aside {
  background-color: #373d3f;
  color: #333;
}

.toggle-collapse {
	font-size: 12px;
	line-height: 24px;
	font-weight: 700;
	letter-spacing: .3em;
	text-align: center;
	color: #f5f5f5;
	background: #4a5064;
	cursor: pointer;
}

.el-menu {
	border: none;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
}
</style>