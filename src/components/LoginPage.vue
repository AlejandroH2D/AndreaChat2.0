<template>
  <div :class="{ transition: isDark && isChange }"></div>
  <div :class="{ transitionLight: !isDark && isChange }"></div>
  <div :class="{ main: !isDark, mainDark: isDark }">
    <div class="loaderContainer">
      <span class="loader" v-if="loading"></span>
    </div>
    <form @submit.prevent="initSession">
      <h1 class="subtitle1">ANDREA</h1>
      <h1 class="subtitle2">CHAT</h1>
      <h3>Inicio de Sesión</h3>
      <label for="username">Nombre de usuario</label>
      <input type="text" placeholder="Ingresa tu nombre de usuario" id="username" v-model="userName">
      <label for="password">Password</label>
      <input type="password" placeholder="Ingresa tu contraseña" id="password" v-model="password">
      <button class="register" type="submit">Inicia Sesión</button>
      <div class="social">
        <div class="go" @click="toHome">
          <p>Home</p>
        </div>
        <div class="fb" @click="toLogin">
          <p>Registro</p>
        </div>
      </div>
    </form>

  </div>
</template>

<script>

import { darkMode } from '@/utils/darkMode'
import { ref, watch, onMounted } from 'vue'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { provideApolloClient } from '@vue/apollo-composable'
import { defaultClient } from '../main'
import './AlertsCSS/loginAlerts.css'
import Swal from 'sweetalert2'


export default {

  setup() {
    const loading = ref(false)

    const userName = ref('')
    const password = ref('')
    onMounted(() => {
      provideApolloClient(defaultClient)
      console.log(window.innerWidth)
    })


    const isDark = ref(darkMode.value.isDark)
    const isChange = ref(darkMode.value.isChange)

    watch(darkMode.value, (dark) => {
      isDark.value = dark.isDark
      isChange.value = dark.isChange
    })


    const toHome = () => {
      window.location.href = "#/";
    }

    const toLogin = () => {
      window.location.href = "#/register";
    }

    const initSession = async () => {
      loading.value = true
      const { onResult } = await useQuery(gql`
          query Login($userInfo: login) {
            login(userInfo: $userInfo) {
              error
              token
              userName
              userID
            }
          }
        `, {
        "userInfo": {
          "userName": userName.value,
          "userPassword": password.value
        },

      },
        {
          fetchPolicy: 'no-cache',
        })

      onResult(queryResult => {

        if (queryResult.data.login.error) {
          Swal.fire({
            customClass: {
              confirmButton: 'test-class',
              popup: 'popupClass',
            },
            position: window.innerWidth < 620? "top": "top-end",
            icon: 'error',
            title: queryResult.data.login.error,
            showConfirmButton: false,
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            color: 'antiquewhite',
            timer: 2000,
            allowOutsideClick: false
          })
        } else {
          Swal.fire({
            customClass: {
              confirmButton: 'test-class',
              popup: 'popupClass',
            },
            position: window.innerWidth < 620? "top": "top-end",
            icon: 'success',
            title: 'Bienvenido :D',
            showConfirmButton: false,
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            backdrop: `
            rgba(8, 7, 16, 0.7)
            url("nyan-cat.gif")
            ${window.innerWidth < 620? "left bottom": "left top"}
            no-repeat
          `,
            color: 'antiquewhite',
            timer: 2000,
            allowOutsideClick: false
          })
          localStorage.token = queryResult.data.login.token
          localStorage.userName = queryResult.data.login.userName
          localStorage.userID = queryResult.data.login.userID
          setTimeout(() => {
            window.location.href = "/#/index"
          }, 2100)
        }

        loading.value = false

        console.log("RESULTTTT", queryResult)
      })


    }
    return {
      password,
      userName,
      loading,
      isDark,
      isChange,
      toHome,
      toLogin,
      initSession
    }
  },


}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.mainDark {
  background: linear-gradient(66deg, rgba(183, 170, 151, 1) 0%, rgba(8, 7, 16, 1) 66%);
  width: 100vw;
  height: auto;
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: max(15vh, 70px);
  padding-bottom: 30px;
  display: flex;
  justify-content: center;
}

.main {
  background: linear-gradient(44deg, rgba(183, 170, 151, 1) 13%, rgba(55, 146, 165, 1) 100%);
  width: 100vw;
  height: auto;
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: max(15vh, 70px);
  padding-bottom: 30px;
  display: flex;
  justify-content: center;
}

.transition {
  background: linear-gradient(44deg, rgba(183, 170, 151, 1) 13%, rgba(55, 146, 165, 1) 100%);
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
  background: linear-gradient(66deg, rgba(183, 170, 151, 1) 0%, rgba(8, 7, 16, 1) 66%);
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

form {
  height: 520px;
  width: 38vw;
  background-color: rgba(255, 255, 255, 0.13);
  position: relative;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 50px 35px;
}

form * {
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
}

form h3 {
  font-size: 32px;
  font-weight: 500;
  line-height: 42px;
  text-align: center;
}

label {
  display: block;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}

input {
  position: relative;
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
  z-index: 2;
}

::placeholder {
  color: #e5e5e5;
}

button {
  margin-top: 50px;
  width: 100%;
  background-color: #ffffff;
  color: rgba(8, 7, 16, 1);
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: 1s;
}

.register:hover {
  background-color: antiquewhite;
  transform: scale(1.1);
}

.social {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.social div {
  background: red;
  width: 150px;
  border-radius: 3px;
  padding-top: 7px;
  padding-bottom: 7px;
  background-color: rgba(255, 255, 255, 0.27);
  color: #eaf0fb;
  text-align: center;
}

.social div:hover {
  background-color: rgba(255, 255, 255, 0.47);
}

.social .fb {
  margin-left: 25px;
}

.social p {
  font-size: 17px;
}

.social p:hover {
  cursor: pointer;
}


.subtitle1 {
  position: absolute;
  font-size: 100px;
  opacity: 0.2;
  font-family: 'Lobster', cursive;
  color: antiquewhite;
  right: -20vw;
  top: 6vh;
  user-select: none;
}

.subtitle2 {
  position: absolute;
  font-size: 100px;
  opacity: 0.2;
  font-family: 'Lobster', cursive;
  color: antiquewhite;
  right: -22vw;
  top: 18vh;
  user-select: none;
}

.loaderContainer{
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 50px;
  top: 53%;
}

.loader {
  position: relative;
  width: 48px;
  height: 48px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50%;
  display: inline-block;
  border-top: 4px solid antiquewhite;
  border-right: 4px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  z-index: 999;
}

.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border-left: 4px solid rgba(8, 7, 16, 1);
  border-bottom: 4px solid transparent;
  animation: rotation 0.5s linear infinite reverse;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 860px) {
  form {
    width: 60vw
  }

  .subtitle1 {
    font-size: 10vw;
    right: -16vw;
    top: 7vw;
  }

  .subtitle2 {
    font-size: 10vw;
    right: -16vw;
    top: 18vw;
  }
}

@media (max-width: 516px) {

  .social {
    margin-top: 30px;
    display: block;
    justify-content: center;
  }

  .social .fb {
    position: relative;
    margin-left: 0px;
  }

  .social div {
    width: 100%;
    margin-top: 10px;
  }

  form {
    padding: 30px;
    height: 100%;
    width: 80vw;
  }

  .subtitle1, .subtitle2{
    font-size: 0;
    position: relative;
  }
}

@media (max-width: 315px) {
  form {
    margin-top: 60px
  }

  .mainDark{
    padding-top:  70px;
  }

  .main{
    padding-top:  70px;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');</style>
