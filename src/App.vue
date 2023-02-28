<template>
  <div id="app">
    <HeaderTop></HeaderTop>
    <router-view v-slot="{ Component }">
      <transition name="slide-fade" mode="out-in">
        <div :key="$route.name">
          <component :is="Component"></component>
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script>
import HeaderTop from './components/HeaderTop.vue'

export default {
  name: 'App',
  components: {
    HeaderTop
  },
  setup(){
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  max-height:100%;
}

#app {

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: rgb(24, 25, 28);
}

/* .slide-fade-enter-active {
    transition: all 0.8s ease-in;
  }
  .slide-fade-leave-active {
    transition: all 0.8s ease-in;
  }
  .slide-fade-enter-from{
    opacity: 30%;
  }
  .slide-fade-leave-to {
    opacity: 30%;
  } */
</style>
