<template>
  <header class="header">
    <h1 :class="{ titleLight: !isDark, titleDark: isDark }" @click="toHome">AndreaChat</h1>
    <div class="authHeader" v-if="isAuth">
      <h2>Auth</h2>
    </div>
    <div class="landingButtons" v-else>
      <button @click="toCreador" :class="{ buttonDark: isDark }">Creador</button>
      <button @click="toFreelancer" :class="{ buttonDark: isDark }">Freelancer</button>
      <button @click="toLinkedin" :class="{ buttonDark: isDark }">Linkedin</button>
      <button @click="toGithub" :class="{ buttonDark: isDark }">Github</button>
      <button :class="{ viewButtonlight: !isDark, viewButtondark: isDark }" @click="changeView">
        <div :class="{ light: !isDark, dark: isDark }"></div>
      </button>
      <button :class="{ registerButton: !isDark, registerButtonDark: isDark}" @click="toCorrectPath">{{path}}</button>
    </div>

</header>
</template>

<script>
import { darkMode } from '@/utils/darkMode'
import { navBar } from '@/utils/navBar'
import { watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'



export default {
  setup() {

    const returnButton = {
      "/register": {
        button:"Inicia Sesión",
        theme: true,
        link:"#/login"
      },
      "/login": {
        button:"Regístrate",
        theme: false,
        link:"#/register"
      },
      "/": {
        button:"Regístrate",
        theme: false,
        link:"#/register"
      },
    }

    const route = useRoute();
    const path = computed(() => returnButton[route.path]? returnButton[route.path].button: "Menú")

    const isDark = ref(darkMode.value.isDark)
    const navBarStatus = ref(navBar.value.isOpen)

    const toCreador = () => {
    }
    const toFreelancer = () => {
      window.open("https://www.freelancer.es/u/alexrojas50", '_blank')
    }
    const toLinkedin = () => {
      window.open("https://www.linkedin.com/in/alejandro-rojas-b0814024b/", '_blank')
    }
    const toGithub = () => {
      window.open("https://github.com/alexrojas50", '_blank')
    }
    const toCorrectPath = () => {
      path.value == "Menú"? navBar.value.openCloseNav(): window.location.href = returnButton[route.path].link;
    }
    const toHome = () => {
      window.location.href = "#/";
    }

    const changeView = () => {
    darkMode.value.changeView()
    }

    watch(darkMode.value, (dark) => {
      isDark.value = dark.isDark
    })

    watch(navBar.value, (newNavBar) => {
      navBarStatus.value = newNavBar.isOpen
    })

    return {
      path,
      isDark,
      toCreador,
      toFreelancer,
      toLinkedin,
      toGithub,
      toCorrectPath,
      toHome,
      changeView
    }
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  position: relative;
  background: transparent;
  width: 100%;
  height: 60px;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  position: absolute;
  z-index: 100;
}

.titleLight {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 20px;
  color: whitesmoke;
  font-family: 'Lobster', cursive;
  letter-spacing: 2px;
  font-size: 35px;
}

.titleDark {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 20px;
  color: antiquewhite;
  font-family: 'Lobster', cursive;
  letter-spacing: 2px;
  font-size: 35px;
}
.titleLight:hover,.titleDark:hover{
  cursor: pointer;
}

.landingButtons {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  
  display: flex;
  justify-content: flex-end;
}

button {
  position: relative;
  min-width: 80px;
  width: 8vw;
  height: 35px;
  margin-right: 3vw;
  border: 2px solid #12525e;
  border-radius: 20px;
  background: transparent;
  color: #12525e;
  font-weight: bold;
  font-size: 13px;
  transition: 0.5s;
}

.buttonDark {
  border: 2px solid antiquewhite;
  color: antiquewhite;
}

button:hover {
  transform: scale(1.2);
  color: antiquewhite;
  border: 2px solid antiquewhite;
  cursor: pointer;
}

.registerButton {
  background: antiquewhite;
  transition: 1s;
  z-index: 999;
  margin-right: 10px;

}

.registerButtonDark {
  margin-right: 10px;
  background: antiquewhite;
  border: 2px solid antiquewhite;
  color:rgba(8, 7, 16, 1);
  transition: 1s;
  z-index: 999;
}



.registerButton:hover {
  color: #12525e;
  border: 2px solid #12525e;
}

.registerButtonDark:hover{
  color: rgba(8, 7, 16, 1);;
}

.viewButtonlight {
  position: relative;
  top: 0;
  width: 80px;
  height: 35px;
}

.viewButtondark {
  position: relative;
  top: 0;
  width: 80px;
  height: 35px;
  border: 2px solid antiquewhite;
}

.light {
  position: absolute;
  top: 1px;
  left: 3px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #12525e;
  transition: 1s;
}

.dark {
  position: absolute;
  top: 1px;
  left: 3px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: antiquewhite;
  transition: 1s;
  transform: translateX(41px)  
}




@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
</style>
