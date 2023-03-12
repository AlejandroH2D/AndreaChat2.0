<template>
    <div class="changePasswordView">
        <div :class="{ ChangePasswordModal: !isClosing, ChangePasswordModalClose: isClosing }">
            <div class="close" @click="closing();"></div>
            <h1 class="title">Cambia tu contraseña</h1>
            <input type="text" placeholder="Inserta tu nueva contraseña" class="inputNewName">
            <div>
                <button class="sendBtn">Enviar</button>
            </div>
        </div>
    </div>
</template>
  
<script>

import { ref, onMounted } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { provideApolloClient } from '@vue/apollo-composable'
import { defaultClient } from '../main'
import gql from 'graphql-tag'
import 'animate.css';
import Swal from 'sweetalert2'
import './AlertsCSS/registerAlerts.css'

export default {
    setup(props, { emit }) {
        const loading = ref(false)
        const userName = ref('')
        const isClosing = ref(false)

        onMounted(() => {
            provideApolloClient(defaultClient)
        })




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
                }
            }).then((res) => {
                loading.value = false
                if (res.data.register.status) {
                    Swal.fire({
                        customClass: {
                            confirmButton: 'test-class',
                            popup: 'popupClass',
                        },
                        position: window.innerWidth < 620 ? "top" : "top-end",
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
              ${window.innerWidth < 620 ? "left bottom" : "left top"}
              no-repeat
            `,
                        color: 'antiquewhite',
                    })
                } else {
                    Swal.fire({
                        customClass: {
                            confirmButton: 'test-class',
                            popup: 'popupClass',
                        },
                        position: window.innerWidth < 620 ? "top" : "top-end",
                        icon: 'error',
                        title: res.data.register.error,
                        showConfirmButton: true,
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        },
                        color: 'antiquewhite',
                    })
                }

            })
        }

        const closing = () => {
            isClosing.value = !isClosing.value
            setInterval(() => {
                emit('closePassword')
            }, 300)

        }
        return {
            loading,
            userName,
            isClosing,
            Register,
            closing,
        }
    },


}

</script>
  
<style scoped>
.changePasswordView {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #00000093;
}

.ChangePasswordModal {
  position: relative;
  width: 44vw;
  height: 44vh;
  min-height: 230px;
  background: #031b26;
  border-radius: 30px;
  display: block;
  text-align: center;
  animation: zoomIn;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 0.8s;
}

.ChangePasswordModalClose {
  position: relative;
  width: 44vw;
  height: 44vh;
  min-height: 260px;
  background: #031b26;
  border-radius: 30px;
  display: block;
  text-align: center;
  animation: zoomOut;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 0.8s;
  /* don't forget to set a duration! */
  animation-fill-mode: forwards;
}

.close {
    position: absolute;
    right: 0px;
    top: 0px;
    margin-top: 18px;
    margin-right: 20px;
    width: 32px;
    height: 32px;
}

.close:hover {
    cursor: pointer;
}

.close:before,
.close:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 3px;
    background-color: rgb(157, 37, 37);
}

.close:before {
    transform: rotate(45deg);
}

.close:after {
    transform: rotate(-45deg);
}

.title {
    margin-top: max(10vh, 36px);
    color: antiquewhite;
}

.inputNewName {
    width: 70%;
  height: 15%;
  min-height: 30px;
  margin-top: max(5%, 18px);
  border-radius: 15px;
  border: 2px solid antiquewhite;
  background-color: rgba(255, 255, 255, 0.13);
  backdrop-filter: blur(10px);
  padding-left: 10px;
  color: antiquewhite;
  font-size: 13px;
}

.sendBtn {
  position: relative;
  width: 10vw;
  height: 4vh;
  min-height: 25px;
  margin-top: 5%;
  background: antiquewhite;
  border: none;
  border-radius: 10px;
}
</style>