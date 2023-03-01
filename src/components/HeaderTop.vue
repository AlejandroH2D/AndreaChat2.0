<template>
  <header class="header">
    <h1 :class="{ titleLight: !isDark, titleDark: isDark }" @click="toHome">AndreaChat</h1>
    <div class="authHeader" v-if="isAuth">
      <h2>Auth</h2>
    </div>
    <div class="landingButtons" v-else>
      <div v-if="!InnerW && !InnerWSmall">
        <button @click="toCreador" :class="{ buttonDark: isDark }">Creador</button>
        <button @click="toFreelancer" :class="{ buttonDark: isDark }">Freelancer</button>
        <button @click="toLinkedin" :class="{ buttonDark: isDark }">Linkedin</button>
        <button @click="toGithub" :class="{ buttonDark: isDark }">Github</button>
      </div>
      <div v-if="InnerW && !InnerWSmall">
        <button @click="OpenContact" :class="{ buttonDark: isDark }">Contacto</button>
      </div>
      <button :class="{ viewButtonlight: !isDark, viewButtondark: isDark }" @click="changeView" v-if="!InnerWSmall">
        <div :class="{ light: !isDark, dark: isDark }"></div>
      </button>
      <button :class="{ registerButton: !isDark, registerButtonDark: isDark }" @click="toCorrectPath"
        v-if="!InnerWSmall">{{ path }}</button>
    </div>
    <div class="contact" v-if="isOpenContact">
      <button @click="toCreador" :class="{ buttonDark: isDark, contactButton: isOpenContact }">Creador</button>
      <button @click="toFreelancer" :class="{ buttonDark: isDark, contactButton: isOpenContact }">Freelancer</button>
      <button @click="toLinkedin" :class="{ buttonDark: isDark, contactButton: isOpenContact }">Linkedin</button>
      <button @click="toGithub" :class="{ buttonDark: isDark, contactButton: isOpenContact }">Github</button>
    </div>
    <div v-if="InnerWSmall" class="landingButtons">
      <button :class="{ registerButton: !isDark, registerButtonDark: isDark, smallDark: InnerWSmall }"
        @click="openNavSmall">Menú</button>
    </div>
  </header>

  <div :class="{ navBarSmall: navSmall, navBarSmallClose: !navSmall }" v-if="navSmall">
    <button @click="toCreador"
      :class="{ buttonDark: isDark, contactButton: isOpenContact, buttonNav: navSmall }">Creador</button>
    <button @click="toFreelancer"
      :class="{ buttonDark: isDark, contactButton: isOpenContact, buttonNav: navSmall }">Freelancer</button>
    <button @click="toLinkedin"
      :class="{ buttonDark: isDark, contactButton: isOpenContact, buttonNav: navSmall }">Linkedin</button>
    <button @click="toGithub"
      :class="{ buttonDark: isDark, contactButton: isOpenContact, buttonNav: navSmall }">Github</button>
    <button :class="{ viewButtonlight: !isDark, viewButtondark: isDark, buttonNav: navSmall }" @click="changeView">
      <div :class="{ light: !isDark, dark: isDark }"></div>
    </button>
    <button :class="{ registerButton: !isDark, registerButtonDark: isDark, buttonNav: navSmall }"
      @click="toCorrectPath">{{ path }}</button>
  </div>
</template>

<script>
import { darkMode } from '@/utils/darkMode'
import { navBar } from '@/utils/navBar'
import { watch, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'



export default {
  setup() {
    const InnerW = ref()
    const InnerWSmall = ref()
    const isOpenContact = ref(false)
    const navSmall = ref(false)
    const returnButton = {
      "/register": {
        button: "Inicia Sesión",
        theme: true,
        link: "#/login"
      },
      "/login": {
        button: "Regístrate",
        theme: false,
        link: "#/register"
      },
      "/": {
        button: "Regístrate",
        theme: false,
        link: "#/register"
      },
    }
    onMounted(() => {
      window.addEventListener('resize', Resize)
      window.innerWidth < 860 && window.innerWidth > 515 ? InnerW.value = true : InnerW.value = false
      window.innerWidth < 860 && window.innerWidth < 515 ? InnerWSmall.value = true : InnerWSmall.value = false
    })

    const OpenContact = () => {
      isOpenContact.value = !isOpenContact.value
    }

    const Resize = (e) => {
      if (window.innerWidth < 860) {
        if (window.innerWidth < 515) {
          InnerWSmall.value = true
          isOpenContact.value = false
          InnerW.value = false
        } else {
          navSmall.value == true? openNavSmall(): null
          InnerWSmall.value = false
          InnerW.value = true
        }
      }
      else {
        InnerW.value = false
        isOpenContact.value = false
      }

      console.log("CAMBIO", e.target.innerWidth, InnerW.value)
    }
    const route = useRoute();
    const path = computed(() => returnButton[route.path] ? returnButton[route.path].button : "Menú")

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
      path.value == "Menú" ? navBar.value.openCloseNav() : window.location.href = returnButton[route.path].link;
    }
    const toHome = () => {
      window.location.href = "#/";
    }

    const changeView = () => {
      darkMode.value.changeView()
    }

    const openNavSmall = () => {
      if (navSmall.value == false) {
        var x = window.scrollX;
        var y = window.scrollY;
        window.onscroll = function () { window.scrollTo(x, y); };
      } else {
        window.onscroll = function () { };
      }
      navSmall.value = !navSmall.value
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
      InnerW,
      isOpenContact,
      InnerWSmall,
      navSmall,
      toCreador,
      toFreelancer,
      toLinkedin,
      toGithub,
      toCorrectPath,
      toHome,
      changeView,
      OpenContact,
      openNavSmall,
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
  font-size: 35px
}

.titleLight:hover,
.titleDark:hover {
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
  margin-right: 20px;

}

.registerButtonDark {
  margin-right: 20px;
  background: antiquewhite;
  border: 2px solid antiquewhite;
  color: rgba(8, 7, 16, 1);
  transition: 1s;
  z-index: 999;
}



.registerButton:hover {
  color: #12525e;
  border: 2px solid #12525e;
}

.registerButtonDark:hover {
  color: rgba(8, 7, 16, 1);
  ;
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
  right: 3px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: antiquewhite;
  transition: 1s;

}

.contact {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 70px;
  margin-right: 40px;
  border-radius: 30px;
  background: rgba(150, 149, 162, 0.167);
}

.contactButton {
  margin: 10px 10px 10px 10px
}

.navBarSmallClose {
  position: absolute;
  top: 60px;
  left: 0;
  height: 100vh;
  width: 0;
  transition: 0.5s;
}

.navBarSmall {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 60px;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.838);
  z-index: 99;
  transition: 0.5s;
  padding-top: 50px;
}

.buttonNav {
  position: relative;
  margin-top: 20px !important;
  width: 30vw;
}

@media (max-width: 515px) {
  button {
    margin-right: 0;
  }

  .registerButtonDark:last-child, .registerButton:last-child{
    margin: 10px;
  }
}


@media (max-width: 315px) {

  

  .titleLight {
    font-size: 11vw;
    width: 100vw;
    margin: auto 0;
    text-align: center;
  }

  .titleDark {
    font-size: 11vw;
    width: 100vw;
    margin: auto 0;
    text-align: center;
  }

  .landingButtons {
    position: absolute;
    top: 85px;
    width: 100vw;
    justify-content: center;
  }

  .registerButton {
    position: relative;
    width: 50vw;
    margin: 0;
    min-width: 0;
  }

  .registerButtonDark {
    position: relative;
    width: 50vw;
    margin: 0;
    min-width: 0;
  }
}


@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');</style>
