<template>
	<div class="form-container">
		<img class="logo" src="../assets/logo.png" alt="logo" />
		<el-form 
			:model="ruleForm" 
			status-icon 
			:rules="rules" 
			ref="ruleForm" 
			class="login-form"
		>
			<el-form-item prop="username">
		    <el-input type="text" prefix-icon="el-icon-user" v-model="ruleForm.username" autocomplete="off">
		    </el-input>
		  </el-form-item>
		  <el-form-item prop="password">
		    <el-input type="password" prefix-icon="el-icon-lock" v-model="ruleForm.password" show-password autocomplete="off"></el-input>
		  </el-form-item>
		  <el-form-item class="form-action">
		    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
		    <el-button @click="resetForm('ruleForm')">重置</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
  data() {
    return {
    	ruleForm: {
    		username: '',
    		password: '',
    	},
    	rules: {
    		username: [
    			{ required: true, message: '请输入用户名', trigger: 'blur' }
    		],
    		password: [
    			{ required: true, message: '请输入密码', trigger: 'blur' },
    			{ min: 6, message: '长度至少为6个字符', trigger: 'blur' }
    		]
    	}
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.form-container {
	position: absolute;
	width:  500px;
	height: 350px;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 2px 2px 20px 5px rgba(0, 0, 0, .1);
}

.logo {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
}

.login-form {
	width: 90%;
	margin: 150px auto;
}

.form-action {
	text-align: right;
	margin-top: 30px;
}
</style>