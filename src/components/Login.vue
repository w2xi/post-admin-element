<template>
	<div class="form-container">
		<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-form-item prop="username">
		    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
		  </el-form-item>
		  <el-form-item prop="password">
		    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
		  </el-form-item>
		  <el-form-item>
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
    			{ required: true, message: '请输入密码', trigger: 'blur' }
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
	width:  500px;
	height: 400px;
	margin: 200px auto;
	padding: 10px;
	box-shadow: 2px 2px 20px 5px rgba(0, 0, 0, .1);
}

.el-form {
	margin-top: 100px;
}
</style>