<template>
	<div id="app">
  	<router-view></router-view>
	</div>
</template>

<script>
import AppLogin from '@/components/Login'

export default {
  name: 'Login',
  components: {
    AppLogin
  }
}
</script>