<template>
	<div class="container">
		<div class="form-box">
			<div class="logo-wrapper">
				<img class="logo" src="../assets/logo.png" alt="logo" />
			</div>
			<el-form 
				:model="loginForm" 
				status-icon 
				:rules="rules" 
				ref="loginForm" 
				class="login-form"
			>
				<el-form-item prop="username">
			    <el-input type="text" prefix-icon="el-icon-user" v-model="loginForm.username" autocomplete="off">
			    </el-input>
			  </el-form-item>
			  <el-form-item prop="password">
			    <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password" show-password autocomplete="off"></el-input>
			  </el-form-item>
			  <el-form-item class="form-action-btn">
			    <el-button type="primary" @click="submitForm('loginForm')" :loading="showLoading">提交</el-button>
			    <el-button type="info" @click="resetForm('loginForm')">重置</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>

const DURATION = 1000

export default {
  data() {
    return {
    	loginForm: {
    		username: 'admin',
    		password: '123456',
    	},
    	rules: {
    		username: [
    			{ required: true, message: '请输入用户名', trigger: 'blur' }
    		],
    		password: [
    			{ required: true, message: '请输入密码', trigger: 'blur' },
    			{ min: 6, message: '长度至少为6个字符', trigger: 'blur' }
    		]
    	},
    	showLoading: false,
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
        	this.showLoading = true

 					const { data: res } = await this.$http.post('login', this.loginForm)

 					if ( res.meta.status === 200 ){
 						sessionStorage.token = res.data.token

 						this.$message({
 							type: 'success',
 							message: '登录成功，正在跳转~',
 							duration: DURATION,
 							showClose: true,
 						})

 						setTimeout(() => {
 							this.showLoading = false
 							this.$router.push('home')
 						}, DURATION)
 					}else{
 						this.showLoading = false
 						this.$message({
 							type: 'error',
 							message: res.meta.msg,
 							showClose: true,
 						})
 					}
        } 
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.container {
	height: 100%;
	background-color: #41b883aa;
}
.form-box {
	width:  450px;
	height: 300px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 2px 2px 20px 5px rgba(0, 0, 0, .1);
	background-color: #fff;
}

.logo-wrapper {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 7px;
	border: 1px solid #fff;
	border-radius: 50%;
	box-shadow: 0 0 10px #efefef;
	background-color: #fff;
}

.logo {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	background-color: #efefef;
}

.login-form {
	position: absolute;
	bottom: 0;	
	width: 100%;
	padding: 0 10px;
	box-sizing: border-box;
}

.form-action-btn {
	text-align: right;
}
</style>