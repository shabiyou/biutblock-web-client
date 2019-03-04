<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import JsonRPCClient from './lib/jayson-rpc-vue'

Vue.use(JsonRPCClient)
export default {
  name: 'App'
}
</script>

<style>

</style>
