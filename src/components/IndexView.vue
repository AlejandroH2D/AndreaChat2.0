<template>
  <div :class="{ transition: isDark && isChange }"></div>
  <div :class="{ transitionLight: !isDark && isChange }"></div>
  <div :class="{ landing: !isDark, landingBlack: isDark }">
    <div :class="{ bgModal: modelOpen }">
      <div :class="{ imgModalOpen: modelOpen, imgModalClose: !modelOpen && hasbenOpen }">
        <div :class="{ imgDrag: modelOpen }" @drop.prevent="dropHandle" @dragover.prevent @dragenter.prevent
          v-if="modelOpen">
          <input type="file" class="inputFile" v-on:change="inputModal">
          <h1 class="titleDrop1">Arrastra y suelta tu imagen de preferencia en formato jpg, jpeg o png. <br> O <br> haz
            click para seleccionarla</h1>
        </div>
        <div class="close" @click="openModalupdateImg" v-if="modelOpen"></div>
      </div>
    </div>
    <div :class="{ navBarOpenBg: navBarStatus, navBarCloseBg: !navBarStatus }">
      <div :class="{ navBarOpen: navBarStatus, navBarClose: !navBarStatus }">
        <img :src=ownImg alt="friendImg" class="ownImg">
        <h1 class="titleUserName"> {{ usarNameNav }}</h1>
        <img src="../../public/editIcon.svg" alt="SVG" class="editIcon" @click="openModalupdateImg">
        <div class="optionsContent">
          <div class="option">UserName</div>
          <div class="option">Password</div>
          <div class="option" v-if="InnerWBig" @click="openFriendsList">Amigos</div>
          <div class="option" v-if="InnerW" @click="closeOptions">Cerrar Opciones</div>
          <div class="option" @click="sendCroissant">Enviar Croissant a Jeremy</div>
          <div class="optionClose" @click="closeSession">Cerra Sesión</div>
          
        </div>
      </div>
    </div>
    <div :class="{ chatDark: isDark, chatLight: !isDark }">
      <div class="messagesContent">
        <div class="goToBottom" v-if="isUp" @click="goToBottom">
          <p>Ir al fondo</p>
        </div>
        <div v-for="message, index in messageList" :key="index">
          <div class="ownMessage" v-if="message.userID == idLocal">
            <div class="ownMessageContent">
              <p class="textOwnMessage">{{ message.message }}</p>
            </div>
          </div>
          <div class="frienMessage" v-else>
            <div class="friendMessageContent">
              <p class="textFriendMessage">{{ message.message }}</p>
            </div>
          </div>
        </div>

      </div>
      <div class="inputContent">
        <div class="emojiContent">
          <img src="../../public/happy-icon.svg" alt="SVG" class="emojiSvg">
        </div>
        <input type="text" class="inputMessage" placeholder="Escribe un mensaje" v-model="inputMessageContent">
        <div class="senderContent">
          <img src="../../public/sent-icon.svg" alt="SVG" class="sendSvg" @click="SENDMESSAGER">
        </div>
      </div>
    </div>
    <div :class="{ friendsDark: isDark, friendsLight: !isDark, openList: openFriends }" v-if="!InnerWBig || openFriends">
      <div :class="{title: true, titleList: openFriends}">
        <h1 class="connects">Amigos</h1>
        <h1 class="connects2" v-if="openFriends" @click="openFriendsList">Cerrar Lista</h1>
      </div>
      <div class="contentList">
        <li v-for="friend, i in friendsList" :key="friend.id" @click="getMessages(friend.id, i)">
          <div :class="{ friendContent: friendSelect != friend.id, friendContentSelect: friendSelect == friend.id }">
            <img :src="friend.img" alt="friendImg" class="friendImg">
            <h1 class="friendName">{{ friend.userName }}</h1>
            <div class="StatusFriend">
              <div :class="{ friendConnect: friend.connect, friendDisconnect: !friend.connect }"></div>
            </div>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch, onMounted } from 'vue'
import { darkMode } from '@/utils/darkMode'
import { navBar, InnerForNav, InnerBigForNav } from '@/utils/navBar'
import { provideApolloClient } from '@vue/apollo-composable'
import { defaultClient } from '../main'
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import './AlertsCSS/imgModal.css'
import Swal from 'sweetalert2'
import './AlertsCSS/registerAlerts.css'


export default {

  setup() {
    const modelOpen = ref(false)
    const hasbenOpen = ref(false)
    const isUp = ref(false)
    var scrollObj = null
    const isDark = ref(darkMode.value.isDark)
    const isChange = ref(darkMode.value.isChange)
    const navBarStatus = ref(navBar.value.isOpen)
    const InnerW = ref(InnerForNav.value.InnerWSmall)
    const InnerWBig = ref(InnerBigForNav.value.InnerW)
    const usarNameNav = ref('')
    const imaAndrea = ref('')
    const ownImg = ref('')
    const friendsList = ref([])
    const friendSelect = ref('')
    const idLocal = ref('')
    const messageList = ref([])
    const inputMessageContent = ref('')
    const openFriends = ref(false)

    // var inputModalCounter = 0

    onMounted(async () => {
      provideApolloClient(defaultClient)

      console.log("Xdddd", InnerW.value)

      scrollObj = document.getElementsByClassName("messagesContent");
      scrollObj[0].scrollTop = scrollObj[0].scrollHeight;
      scrollObj[0].addEventListener('scroll', handleScroll)
      document.getElementsByClassName('inputMessage')[0].addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && inputMessageContent.value !== '' && friendSelect.value !== '') {
          SENDMESSAGER()
        }
      });
      usarNameNav.value = localStorage.userName
      idLocal.value = localStorage.userID

      const { onResult, refetch } = await useQuery(gql`
        query GetAllUsers {
          getAllUsers {
            id
            userName
            status
            img {
              data
              contentType
            }
          }
        }
      `,
        {
          fetchPolicy: 'no-cache',
        })

      onResult(async (data) => {
        friendsList.value = []
        data.data.getAllUsers.map((friend) => {
          if (friend.userName == 'Alejandro' && friend.userName !== localStorage.userName) {
            friendsList.value.push({
              userName: friend.userName,
              connect: friend.status,
              img: './nyan-cat.gif',
              id: friend.id
            })
          } else {
            if (friend.userName !== localStorage.userName) {
              // const chatCode = String.fromCharCode(...new Uint8Array(friend.img.data.data))
              var binary = '';
              var bytes = new Uint8Array(friend.img.data.data);
              var len = bytes.byteLength;
              for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64String = btoa(binary);
              friendsList.value.push({
                userName: friend.userName,
                connect: friend.status,
                img: `data:image/${friend.img.contentType};base64,` + base64String,
                id: friend.id
              })
            } else {
              if (friend.userName == "Alejandro") {
                ownImg.value = "./nyan-cat.gif"
              } else {
                var binary2 = '';
                var bytes2 = new Uint8Array(friend.img.data.data);
                var len2 = bytes2.byteLength;
                for (var i2 = 0; i2 < len2; i2++) {
                  binary2 += String.fromCharCode(bytes2[i2]);
                }
                const base64String2 = btoa(binary2);
                // const base64String = btoa(String.fromCharCode(...new Uint8Array(friend.img.data.data)));
                ownImg.value = `data:image/${friend.img.contentType};base64,` + base64String2

              }
            }
          }
        })
      })
      refetch()
    })

    var newMessage = useSubscription(gql`
      subscription Xddd($messageAddedId: ID) {
        messageAdded(id: $messageAddedId) {
          groupName
          isgroup
          message {
            date
            message
            userID
            userName
          }
          usersID
        }
      }
    `, {
      "messageAddedId": localStorage.userID
    })

    newMessage.onResult((result) => {
      if (result.data.messageAdded.isGroup) {
        console.log("Messsage Group", result)
      } else {
        if (result.data.messageAdded.usersID.includes(friendSelect.value)) {
          messageList.value.push(...[result.data.messageAdded.message])
          setTimeout(goToBottom, 1)
        }
      }
    })

    var changeStatus = useSubscription(gql`
      subscription StatusUser {
        statusUser {
          status
          userId
        }
      }
    `)

    changeStatus.onResult((result) => {
      if (result.data.statusUser.userId !== localStorage.userID) {
        friendsList.value[friendsList.value.findIndex((friend) => friend.id == result.data.statusUser.userId)].connect = result.data.statusUser.status
      }
    })




    const handleScroll = () => {
      scrollObj[0].scrollHeight * (75 / 100) > (scrollObj[0].scrollTop + scrollObj[0].clientHeight) ? isUp.value = true : isUp.value = false
    }

    const goToBottom = () => {
      scrollObj[0].scrollTop = scrollObj[0].scrollHeight;
    }

    const closeSession = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      navBar.value.openCloseNav()
      const { mutate: Register } = useMutation(
        gql`
          mutation Mutation($changeStatusId: ID) {
            changeStatus(id: $changeStatusId) {
              error
              success
            }
          }
        `
      )

      Register({
        "changeStatusId": localStorage.userID
      })
      window.location.href = "#/login";
    }

    const openModalupdateImg = async () => {
      modelOpen.value = !modelOpen.value
      hasbenOpen.value = true
    }

    const inputModal = async (e) => {
      console.log("NOOOOOOOOO")
      var img = e.target.files[0]
      if (img.type.split("/")[1] == "png" || img.type.split("/")[1] == "jpg" || img.type.split("/")[1] == "jpeg") {

        const reader = await new FileReader();
        reader.readAsDataURL(img);
        reader.onload = async (event) => {
          imaAndrea.value = event.target.result
          console.log(imaAndrea.value)
          const { mutate: Register } = useMutation(
            gql`
              mutation Mutation($data: changeImgInput) {
                changeImgUser(data: $data) {
                  error
                  status
                }
              }
            `
          )
          Register({
            "data": {
              "base64": imaAndrea.value,
              "userId": localStorage.userID
            }
          }).then((res) => {
            if (res.data.changeImgUser.error == false) {
              openModalupdateImg()
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al cambiar la imagen',
                customClass: {
                  popup: 'popupModal'
                }
              })
            } else {
              openModalupdateImg()
              Swal.fire({
                icon: 'success',
                title: 'Cambio realizado',
                text: 'Se ha cambiado la imagen exitosamente',
                customClass: {
                  popup: 'popupModal'
                }
              })
            }
          })
        };
      } else {
        openModalupdateImg()
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Solo aceptamos imágenes en formato png, jpg y jpeg',
          customClass: {
            popup: 'popupModal'
          }
        })
      }
    }

    const dropHandle = (e) => {
      var img = e.dataTransfer.files[0]
      if (img.type.split("/")[1] == "png" || img.type.split("/")[1] == "jpg" || img.type.split("/")[1] == "jpeg") {
        console.log("IMGAAA", img)
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (event) => {
          imaAndrea.value = event.target.result
          const { mutate: Register } = useMutation(
            gql`
              mutation Mutation($data: changeImgInput) {
                changeImgUser(data: $data) {
                  error
                  status
                }
              }
            `
          )
          Register({
            "data": {
              "base64": imaAndrea.value,
              "userId": localStorage.userID
            }
          }).then((res) => {
            if (res.data.changeImgUser.error == false) {
              openModalupdateImg()
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al cambiar la imagen',
                customClass: {
                  popup: 'popupModal'
                }
              })
            } else {
              openModalupdateImg()
              Swal.fire({
                icon: 'success',
                title: 'Cambio realizado',
                text: 'Se ha cambiado la imagen exitosamente',
                customClass: {
                  popup: 'popupModal'
                }
              })
            }
          })

        };


      } else {
        openModalupdateImg()
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Solo aceptamos imágenes en formato png, jpg y jpeg',
          customClass: {
            popup: 'popupModal'
          }
        })
      }
    }

    const getMessages = async (friendID) => {
      messageList.value = []
      friendSelect.value = friendID
      const { onResult } = await useQuery(gql`
        query GetMessage($data: getMessagesInput) {
          getMessage(data: $data) {
            error
            messages {
              date
              message
              userID
              userName
            }
            success
          }
        }
      `,
        {
          data: {
            isGroup: false,
            chatId: "",
            friendId: friendID,
            userId: localStorage.userID
          }
        },
        {
          fetchPolicy: 'no-cache',
        })

      onResult(async (data) => {
        if (data.data.getMessage.messages) {
          messageList.value.push(...data.data.getMessage.messages)
          setTimeout(goToBottom, 1)
        }
      })
    }

    const SENDMESSAGER = () => {
      if (inputMessageContent.value !== '' && friendSelect.value !== '') {
        const check = inputMessageContent.value.replace(/\s/g, '')
        if (check.length != 0) {
          sendMessage()
          inputMessageContent.value = ''
        }
      }
    }

    const sendMessage = async () => {
      const { mutate: Register } = useMutation(
        gql`
          mutation InsertMessageFriend($data: insertMessageFriend) {
            insertMessageFriend(data: $data) {
              error
              success
            }
          }
        `,
      )

      Register({
        "data": {
          date: Date.now(),
          friendId: friendSelect.value,
          message: inputMessageContent.value,
          userId: localStorage.userID,
          userName: localStorage.userName
        }
      })
    }

    const sendCroissant = async () => {
      const { mutate: Register } = useMutation(
        gql`
          mutation Croissant($userId: ID) {
            Croissant(userId: $userId) {
              error
              success
            }
          }
        `,
      )

      Register({
        userId: localStorage.userID
      }).then((res) => {
        if (res.data.Croissant.error != "false") {
          Swal.fire({
            customClass: {
              popup: 'popupClass',
            },
            position: 'top-end',
            icon: 'error',
            title: res.data.Croissant.error,
            showConfirmButton: false,
            timer: 3000,
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
            customClass: {
              popup: 'popupClass',
            },
            position: 'top-end',
            icon: 'success',
            title: "Croissant Enviado 🥐",
            showConfirmButton: false,
            timer: 3000,
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

    const openFriendsList = () => {
      navBar.value.isOpen ? navBar.value.openCloseNav() : null
      
      openFriends.value = !openFriends.value
    }

    const closeOptions = () => {
      navBar.value.openCloseNav()
    }

    watch(navBar.value, (newNavBar) => {
      navBarStatus.value = newNavBar.isOpen
    })

    watch(InnerForNav.value, (newInnerW) => {
      InnerW.value = newInnerW.InnerWSmall
      console.log("CAMBIANDO INNERW", InnerW.value)
    })

    watch(InnerBigForNav.value, (newInnerW) => {
      InnerWBig.value = newInnerW.InnerW
      console.log("CAMBIANDO INNERBIGGGGW", InnerWBig.value)
    })

    watch(darkMode.value, (dark) => {
      isDark.value = dark.isDark
      isChange.value = dark.isChange
    })


    return {
      isDark,
      idLocal,
      inputMessageContent,
      InnerWBig,
      InnerW,
      openFriends,
      inputModal,
      ownImg,
      hasbenOpen,
      modelOpen,
      usarNameNav,
      isChange,
      friendsList,
      messageList,
      isUp,
      friendSelect,
      goToBottom,
      navBarStatus,
      closeSession,
      openModalupdateImg,
      dropHandle,
      getMessages,
      SENDMESSAGER,
      sendCroissant,
      openFriendsList,
      closeOptions,
    }
  },


}
</script>

<style scoped>
*::-webkit-scrollbar {
  display: none;
}

.landing {
  position: relative;
  background: radial-gradient(circle at 51% 100%, rgba(231, 221, 208, 0.835) 0%, rgba(55, 147, 165, 0.696) 100%);
  overflow: hidden;
  height: 100vh;
}

.landingBlack {
  position: relative;
  background: radial-gradient(circle at 51% 100%, rgba(103, 98, 91, 1) 0%, #031b26 100%);
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

.chatDark {
  position: absolute;
  display: block;
  margin-top: 70px;
  width: 70%;
  height: 90%;
  overflow: hidden;
}

.chatLight {
  position: absolute;
  margin-top: 70px;
  width: 70%;
  height: 90%;
}

.friendsDark {
  position: absolute;
  right: 0;
  width: max(28%, 315px);
  height: 100%;
  margin-top: 75px;
  overflow: hidden;
  border-left: 15px solid rgba(3, 27, 38, 0.8);
  ;
  background: rgba(3, 27, 38, 0.6);
  border-top-left-radius: 25px;
}

.friendsLight {
  position: absolute;
  right: 0;
  width: 28%;
  height: 100%;
  margin-top: 75px;
  overflow: hidden;
  border-left: 15px solid rgba(3, 27, 38, 0.8);
  ;
  background: rgba(3, 27, 38, 0.6);
  border-top-left-radius: 25px;
}

.openList{
  background: #031b26;
  width: 100% !important;
  border-radius: 0;
}

.titleList{
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
}

.connects2{
  color: rgb(156, 44, 44);
  font-family: 'Lobster', cursive;
  font-size: 30px;
  letter-spacing: 3px;
  margin-right: 20px;
}

.title {
  margin-top: 20px;
  width: 100%;
  max-height: 70px;
  position: relative;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.connects {
  color: #faebd7;
  font-family: 'Lobster', cursive;
  font-size: 30px;
  letter-spacing: 3px
}

.contentList {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  height: 90%;
  overflow-y: scroll;
  height: 100%;
  /* Increase/decrease this value for cross-browser compatibility */

}

.friendContent {
  display: flex;
  align-items: center;
  width: 100%;
  height: max(5vw, 64px);
  border: 4px solid antiquewhite;
  overflow: auto;
  border-radius: 30px;
  margin-top: 15px;
  padding-right: 10px;
  box-sizing: border-box;
}

.friendContentSelect {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: max(5vw, 64px);
  overflow: auto;
  border: 4px solid;
  border-image:
    linear-gradient(to bottom,
      antiquewhite,
      rgba(0, 0, 0, 0)) 1 100%;
  border-radius: 30px;
  margin-top: 15px;
  padding-right: 10px;
}

.friendContent:hover {
  cursor: pointer;
}

.friendImg {
  width: 4.222vw;
  height: auto;
  min-width: 50px;
  border-radius: 50%;
  margin: auto 0 auto 1px;
  border: 3px solid rgba(3, 27, 38, 1);
}

li {
  list-style-type: none;
}

li:last-child {
  height: 250px
}

.friendName {
  margin: auto 0;
  color: antiquewhite;
  margin: auto 0 auto 15px;

}

.StatusFriend {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-left: 5px;
}

.friendConnect {
  width: 25px;
  height: 25px;
  min-width: 25px;
  margin-left: 10%;
  margin-right: 10%;
  border-radius: 50%;
  background: green;
  border: 3px solid rgba(3, 27, 38, 1);
}

.friendDisconnect {
  margin-left: 10%;
  margin-right: 10%;
  width: 25px;
  height: 25px;
  min-width: 25px;
  border-radius: 50%;
  background: red;
  border: 3px solid rgba(3, 27, 38, 1);
}

.inputContent {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 60px;
}

.inputMessage {
  position: relative;
  height: 40px;
  width: 80%;
  top: 50%;
  padding-left: 20px;
  background: transparent;
  border: 3px solid #faebd7;
  transform: translateY(-50%);
  border-radius: 20px;
  font-size: 15px;
}


.inputMessage:focus {
  outline: none
}

.emojiContent {
  width: 60px;
  height: 100%;
  margin: auto auto
}

.senderContent {
  width: 60px;
  height: 100%;
  margin: auto auto
}

.senderContent:hover,
.emojiContent:hover {
  cursor: pointer;
}

.sender {
  margin: auto;
  width: 50px;
  height: 50px
}

.messagesContent {
  margin-top: 5px;
  display: block;
  width: 100%;
  height: calc(100% - 80px);
  overflow-y: scroll;
}

.ownMessage {
  display: flex;
  justify-content: flex-end;
  position: relative;
  right: 0;
  margin: 23px 3px 23px 90px;
}

.frienMessage {
  display: flex;
  justify-content: flex-start;
  left: 0;
  margin: 20px;
  margin-right: 90px;
}

.friendMessageContent {
  border: 3px solid rgb(250, 235, 215);
  border-radius: 30px;
  background-color: rgba(250, 235, 215, 0.82)
}

.textFriendMessage {
  font-size: 18px;
  margin: 10px;
  color: rgb(2, 14, 19);
  margin: 12px
}

.ownMessageContent {
  border: 3px solid rgba(3, 27, 38, 1);
  border-radius: 30px;
  background-color: rgba(3, 27, 38, 0.5);
  max-width: 80%;
  width: auto;
  padding: 10px;
}


.textOwnMessage {
  font-size: 18px;
  color: antiquewhite;
  width: 100%;
  height: auto;
  word-wrap: break-word;
  margin: auto;
  white-space: wrap;
  overflow: hidden;
}

.sendSvg {
  filter: brightness(0) saturate(100%) invert(100%) sepia(16%) saturate(2727%) hue-rotate(309deg) brightness(102%) contrast(96%);
  position: relative;
  width: 40px;
  height: 40px;
  left: 5px;
  top: 11px
}

.emojiSvg {
  filter: brightness(0) saturate(100%) invert(100%) sepia(16%) saturate(2727%) hue-rotate(309deg) brightness(102%) contrast(96%);
  position: relative;
  width: 40px;
  height: 40px;
  left: 5px;
  top: 11px;
}

.goToBottom {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 20%;
  height: 30px;
  background: rgba(3, 27, 38, 0.3);
  left: 40%;
  bottom: 80px;
  border-radius: 30px;
}

.goToBottom:hover {
  cursor: pointer;
}

.goToBottom p {
  margin-top: auto;
  margin-bottom: auto;
  font-size: 16px;
  font-weight: Bold;
  color: antiquewhite;
}

.navBarCloseBg {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 60px;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.navBarOpenBg {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 60px;
  background-color: rgba(3, 27, 38, 0.6);
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  z-index: 101;
}

.navBarClose {
  height: 100%;
  width: 0;
  position: fixed;
  background-color: rgba(3, 27, 38);
  overflow-x: hidden;
  top: 60px;
  transition: 0.5s;
  padding-top: 60px;
  z-index: 101;
}

.navBarOpen {
  height: 100%;
  width: 300px;
  position: fixed;
  background-color: rgba(3, 27, 38);
  overflow-x: hidden;
  top: 60px;
  transition: 0.5s;
  padding-top: 60px;
  z-index: 101;
  box-shadow: 0px 20px 18px 20px rgba(0, 0, 0, 0.59);
}

.titleUserName {
  position: absolute;
  margin-left: 135px;
  color: antiquewhite;
  top: 15px
}

.ownImg {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  top: 15px;
  margin-left: 20px;
  border: 4px solid antiquewhite;
}

.optionsContent {
  width: 300px;
  height: 73%;
  margin-top: 80px;
  padding-top: 1px;

}

.option {
  margin-top: 20px;
  margin-left: 16px;
  color: #faebd7;
  font-size: 20px;
  height: 40px;
  overflow: hidden;
  font-weight: bold
}

.option:hover {
  cursor: pointer;
}

.optionClose {
  margin-top: 20px;
  margin-left: 16px;
  color: rgb(188, 38, 38);
  font-size: 20px;
  height: 40px;
  overflow: hidden;
  font-weight: bold
}

.optionClose:hover {
  cursor: pointer;
}

.editIcon {
  position: absolute;
  width: 40px;
  height: 40px;
  filter: brightness(0) saturate(100%) invert(99%) sepia(87%) saturate(702%) hue-rotate(300deg) brightness(106%) contrast(96%);
  margin-left: 130px
}

.editIcon:hover {
  cursor: pointer;
}

.imgModalOpen {
  position: absolute;
  left: 0;
  right: 0;
  width: 44vw;
  height: 44vh;
  background: rgba(3, 27, 38, 1);
  border-radius: 30px;
  margin: 30vh 30vw 0 auto;
  z-index: 999;
  animation: zoomIn;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 0.8s;
  /* don't forget to set a duration! */
}



.imgModalClose {
  position: absolute;
  left: 0;
  right: 0;
  width: 44vw;
  height: 44vh;
  background: rgba(3, 27, 38, 1);
  border-radius: 30px;
  margin: 30vh 30vw 0 auto;
  z-index: 999;
  animation: zoomOut;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 0.8s;
  /* don't forget to set a duration! */
  animation-fill-mode: forwards;
}

.imgDrag {
  margin: auto;
  margin-top: 5%;
  width: 80%;
  height: 80%;
  border: 6px dashed #faebd7;
  border-radius: 30px;

}

.imgDrag:hover {
  cursor: pointer;
}

.bgModal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  background: #00000023;
}

.close {
  position: absolute;
  right: 0px;
  top: 0px;
  margin-top: 20px;
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

.titleDrop1 {
  width: 100%;
  color: rgba(250, 235, 215, 0.557);
  text-align: center;
  margin-top: 15%;
  font-size: 18px;
  line-height-step: 9px
}

.inputFile {
  width: 80%;
  height: 80%;
  border-radius: 30px;
  opacity: 0;
  position: absolute;
  z-index: 9999;
}

.inputFile:hover {
  cursor: pointer;
  display: none
}

@media (max-width: 1125px) {
  .chatDark {
    width: calc(100vw - 338px)
  }
}

@media (max-width: 859px) {
  .chatDark{
    width: 100%;
  }
}

@media (max-height: 570px) {
  .messagesContent{
    height: calc(100% - 100px);
  }
}

@media (max-height: 360px) {
  .messagesContent{
    height: calc(100% - 110px);
  }
}

@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
</style>
