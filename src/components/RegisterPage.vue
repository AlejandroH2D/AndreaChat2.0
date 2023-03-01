<template>
  <div :class="{ transition: isDark && isChange }"></div>
  <div :class="{ transitionLight: !isDark && isChange }"></div>
  <div :class="{ main: !isDark, mainDark: isDark }">
    <span class="loader" v-if="loading"></span>
    <div class="background">
    </div>
    <form @submit.prevent="Register">
      <h3>Regístrate aquí</h3>
      <label for="username">Nombre de Usuario</label>
      <input type="text" placeholder="Ingresa tu nombre de usuario" id="username" v-model="userName">
      <label for="password">Password</label>
      <input type="password" placeholder="Ingresa tu contraseña" id="password" v-model="password">
      <button class="register" type="submit">Regístrate</button>
      <div class="social">
        <div class="go" @click="toHome">
          <p>Home</p>
        </div>
        <div class="fb" @click="toLogin">
          <p>Login</p>
        </div>
      </div>
    </form>
    <h1 class="subtitle1">ANDREA</h1>
    <h1 class="subtitle2">CHAT</h1>
  </div>
</template>

<script>

import { darkMode } from '@/utils/darkMode'
import { ref, watch, onMounted } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { provideApolloClient } from '@vue/apollo-composable'
import { defaultClient } from '../main'
import gql from 'graphql-tag'
import 'animate.css';
import Swal from 'sweetalert2'
import './AlertsCSS/registerAlerts.css'

export default {
  setup() {
    const loading = ref(false)
    const userName = ref('')
    const password = ref('')

    onMounted(() => {
      provideApolloClient(defaultClient)
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
      window.location.href = "#/login";
    }

    const Register = async () => {
      loading.value = true
      const { mutate: Register } = useMutation(
        gql`
          mutation Register ($userInfo: register) {
            register(userInfo: $userInfo) {
              error
              status
            }
          }
        `
      )

      Register({
        "userInfo": {
          "userName": userName.value,
          "userPassword": password.value
        }
      }).then((res) => {
        loading.value = false
        if (res.data.register.status) {
          Swal.fire({
          customClass:{
            confirmButton:'test-class',
            popup: 'popupClass',
          },
          position: 'top-end',
          icon: 'success',
          title: 'Te has registrado exitosamente. Inicia sesión para entrar al chat.',
          showConfirmButton: true,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          backdrop: `
            rgba(8, 7, 16, 0.7)
            url("nyan-cat.gif")
            left top
            no-repeat
          `,
          color: 'antiquewhite',
        })
        } else {
          Swal.fire({
          customClass:{
            confirmButton:'test-class',
            popup: 'popupClass',
          },
          position: 'top-end',
          icon: 'error',
          title: res.data.register.error,
          showConfirmButton: true,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          backdrop: `
            rgba(8, 7, 16, 0.7)
            url("nyan-cat.gif")
            left top
            no-repeat
          `,
          color: 'antiquewhite',
        })
        }
        
      })



    }
    return {
      loading,
      password,
      userName,
      isDark,
      isChange,
      toHome,
      toLogin,
      Register,
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
  height: 100vh;
  overflow: hidden;
}

.main {
  background: linear-gradient(44deg, rgba(183, 170, 151, 1) 13%, rgba(55, 146, 165, 1) 100%);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
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

.background {
  background-color: transparent;
  width: 430px;
  height: 520px;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}

.background .shape {
  height: 200px;
  width: 200px;
  position: absolute;
  border-radius: 50%;
}

.shape:first-child {
  background: linear-gradient(135deg,
      rgba(3, 27, 38, 1),
      rgb(14, 82, 113));
  left: -80px;
  top: -80px;
}

.shape:last-child {
  background: linear-gradient(135deg,
      rgb(205, 160, 101),
      antiquewhite);
  right: -80px;
  bottom: -80px;
}

form {
  height: 520px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.13);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
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
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
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
  right: 160px;
  top: 200px;
  user-select: none;
}

.subtitle2 {
  position: absolute;
  font-size: 100px;
  opacity: 0.2;
  font-family: 'Lobster', cursive;
  color: antiquewhite;
  right: 70px;
  top: 310px;
  user-select: none;

}

.loader {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  border-top: 4px solid antiquewhite;
  border-right: 4px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  margin-top: 45%;
  margin-left: 48.3%;
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


@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
</style>
