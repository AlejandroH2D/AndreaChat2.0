<template>
  <div :class="{ transition: isDark && isChange }"></div>
  <div :class="{ transitionLight: !isDark && isChange }"></div>
  <div :class="{ landing: !isDark, landingBlack: isDark }">
    <h1 class="title">Una nueva forma de encontrarse</h1>
    <p>Entra y disfruta de una nueva experiencia con todos tus amigos, familiares y conocidos.</p>
    <button :class="{registro: !isDark, registroDark: isDark}" @click="toRegister">Regístrate Gratis!</button>
    <div class="separadores">
      <div class="linea"></div>
      <p class="separador">O</p>
      <div class="linea"></div>
    </div>
    <button :class="{sesion: !isDark, sesionDark: isDark}" @click="toLogin">Inicia Sesión</button>
    <div class="svgIm">
      <img src="../../public/SvgLanding2.svg" alt="SVG" class="svgLanding">
      <img src="../../public/Message.svg" alt="SVG" class="svgMessage">
      <img src="../../public/Message2.svg" alt="SVG" class="svgMessage2">
      <img src="../../public/Message3.svg" alt="SVG" class="svgMessage3">
      <div class="dots"></div>
    </div>
</div>
</template>

<script>
import { ref, watch } from 'vue'
import { darkMode } from '@/utils/darkMode'


export default {
  setup() {

    const count = ref(0)
    const isDark = ref(darkMode.value.isDark)
    const isChange = ref(darkMode.value.isChange)


    watch(darkMode.value, (dark) => {
      isDark.value = dark.isDark
      isChange.value = dark.isChange
      console.log("CAMBIOOOO", isChange.value)
    })

    const toRegister = () => {
      window.location.href = "#/register";
    }

    const toLogin = () => {
      window.location.href = "#/login";
    }


    return {
      isDark,
      isChange,
      count,
      toRegister,
      toLogin
    }
  },


}


</script>

<style scoped>
.landing {
  background: radial-gradient(circle at 86% 94%, #FAEBD7 0%, #3792A5 100%);
  overflow: hidden;
  height: 100vh;
}

.landingBlack {
  background: radial-gradient(circle at 86% 89%, rgba(183, 170, 151, 1) 0%, rgba(8, 7, 16, 1) 53%);
  overflow: hidden;
  height: 100vh;
}

.transition {
  background: radial-gradient(circle at 86% 94%, #FAEBD7 0%, #3792A5 100%);
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  animation: transBg 0.8s linear 1;
  opacity: 0%;
  width: 0;
  height: 0;
}

@keyframes transBg {
  0% {
    opacity: 60%;
    width: 100vw;
    height: 100vh;
  }

  99% {
    width: 100vw;
    height: 100vh;
  }

  100% {
    opacity: 0%;
    width: 0;
    height: 0;
  }
}

.transitionLight {
  background: radial-gradient(circle at 86% 100%, rgba(250, 235, 215, 1) 0%, rgba(3, 27, 38, 1) 49%);
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  animation: transBg 0.8s linear 1;
  opacity: 0%;
  width: 0;
  height: 0;
}

.title {
  margin-top: 200px;
  margin-left: 30px;
  color: whitesmoke;
  font-family: 'Zeyada', cursive;
  font-size: 75px;
  letter-spacing: 1px;
}

.svgIm {
  position: absolute;
  width: 600px;
  height: 600px;
  right: 25px;
  bottom: 10px;
}

.svgMessage {
  position: absolute;
  z-index: 99;
  width: 70px;
  height: 70px;
  right: 430px;
  top: 50px;
  transform: rotateZ(-10deg);
  animation: animateMessage1 3s linear infinite;
  animation-delay: 0.5S;
}

@keyframes animateMessage1 {
  45% {

    transform: rotateZ(15deg);

  }

  100% {
    transform: rotateZ(-10deg);
  }
}

.svgMessage2 {
  position: absolute;
  z-index: 99;
  width: 70px;
  height: 70px;
  right: 250px;
  top: -10px;
  transform: rotateZ(-10deg);
  animation: animateMessage1 3s linear infinite;
}

.svgMessage3 {
  position: absolute;
  z-index: 99;
  width: 70px;
  height: 70px;
  right: 200px;
  bottom: 420px;
}


p {
  margin-top: 30px;
  font-size: 35px;
  margin-left: 60px;
  max-width: 50vw;
  letter-spacing: 2px;
  color: whitesmoke;
  line-height: 60px;
  font-family: 'Lobster', cursive;
}

.registro {
  margin-top: 100px;
  margin-left: 250px;
  border: none;
  background: antiquewhite;
  width: 230px;
  height: 55px;
  border-radius: 15px;
  font-size: 20px;
  color: #12525e;
  font-weight: bold;
  transition: 0.5s;
}

.registroDark {
  margin-top: 100px;
  margin-left: 250px;
  border: none;
  background: antiquewhite;
  width: 230px;
  height: 55px;
  border-radius: 15px;
  font-size: 20px;
  color: rgba(8, 7, 16, 1);
  font-weight: bold;
  transition: 0.5s;
}

.registro:hover, .registroDark:hover,.sesion:hover, .sesionDark:hover{
  cursor: pointer;
  transform: scale(1.2);
}

.separadores{
  display: flex;
  margin-left: 195px
}

.separador {
  margin-top: 0;
  margin-left: 0;
}

.linea{
  margin: auto 30px;
  width: 100px;
  height: 3px;
  background: antiquewhite;
}

.sesion {
  margin-left: 290px;
  border: none;
  background: antiquewhite;
  width: 150px;
  height: 35px;
  border-radius: 15px;
  font-size: 15px;
  color: #12525e;
  font-weight: bold;
  transition: 0.5s;
}

.sesionDark {
  margin-left: 290px;
  border: none;
  background: antiquewhite;
  width: 150px;
  height: 35px;
  border-radius: 15px;
  font-size: 15px;
  color: rgba(8, 7, 16, 1);
  font-weight: bold;
  transition: 0.5s;
}


@import url('https://fonts.googleapis.com/css2?family=Zeyada&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
</style>