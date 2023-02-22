<template>
  <div :class="{ transition: isDark && isChange }"></div>
  <div :class="{ transitionLight: !isDark && isChange }"></div>
  <div :class="{ landing: !isDark, landingBlack: isDark }">
    <div :class="{ navBarOpenBg: navBarStatus, navBarCloseBg: !navBarStatus }">
      <div :class="{ navBarOpen: navBarStatus, navBarClose: !navBarStatus }">
        <img src="../../public/cerezas.jpg" alt="friendImg" class="ownImg">
        <h1 class="titleUserName"> UserName</h1>
        <div class="optionsContent">
          <div class="option">UserName</div>
          <div class="option">Password</div>
          <div class="option">Enviar Croissant a Jeremy</div>
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
          <div class="ownMessage" v-if="message.userName == 'Ale'">
            <div class="ownMessageContent">
              <p class="textOwnMessage">{{ message.messageContent }}</p>
            </div>
          </div>
          <div class="frienMessage" v-else>
            <div class="friendMessageContent">
              <p class="textFriendMessage">{{ message.messageContent }}</p>
            </div>
          </div>
        </div>

      </div>
      <div class="inputContent">
        <div class="emojiContent">
          <img src="../../public/happy-icon.svg" alt="SVG" class="emojiSvg">
        </div>
        <input type="text" class="inputMessage" placeholder="Escribe un mensaje">
        <div class="senderContent">
          <img :src="`data:image/jpg;base64,${imgSRC}`"  alt="SVG" class="sendSvg">
        </div>
      </div>
    </div>
    <div :class="{ friendsDark: isDark, friendsLight: !isDark }">
      <div class="title">
        <h1 class="connects">Amigos</h1>
      </div>
      <div class="contentList">
        <li v-for="friend in friendsList" :key="friend.userName">
          <div class="friendContent">
            <img :src="imgSRC" alt="friendImg" class="friendImg">
            <h1 class="friendName">{{ friend.userName }}</h1>
            <div :class="{ friendConnect: friend.connect, friendDisconnect: !friend.connect }"></div>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch, onMounted } from 'vue'
import { darkMode } from '@/utils/darkMode'
import cerezas from '../../public/cerezas.jpg'
import { navBar } from '@/utils/navBar'
import { provideApolloClient } from '@vue/apollo-composable'
import { defaultClient } from '../main'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'


export default {
  setup() {

    const imgSRC = ref('')
    const img = ref()
    const isUp = ref(false)
    var scrollObj = null
    const isDark = ref(darkMode.value.isDark)
    const isChange = ref(darkMode.value.isChange)
    const navBarStatus = ref(navBar.value.isOpen)


    onMounted(async () => {
      provideApolloClient(defaultClient)
      scrollObj = document.getElementsByClassName("messagesContent");
      scrollObj[0].scrollTop = scrollObj[0].scrollHeight;
      scrollObj[0].addEventListener('scroll', handleScroll)

      const { onResult } = await useQuery(gql`
        query GetAllUsers {
          getAllUsers {
            id
            userName
            status
            img {
              data
            }
          }
        }
      `,
        {
          fetchPolicy: 'no-cache',
        })

      onResult(async (res) => {
        console.log("USERSSSS", res.data.getAllUsers[2].img.data.data)
        imgSRC.value = btoa(String.fromCharCode.apply(null, new Uint8Array(res.data.getAllUsers[2].img.data.data)));
        img.value = new Image();
        img.value.src = `data:image/jpg;base64,${imgSRC.value}`;
      })
    })



    const handleScroll = () => {
      console.log("toppppp", scrollObj)
      console.log("HEIIGGGG", scrollObj[0].scrollHeight)

      scrollObj[0].scrollHeight * (80 / 100) > (scrollObj[0].scrollTop + scrollObj[0].clientHeight) ? isUp.value = true : isUp.value = false
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



    watch(navBar.value, (newNavBar) => {
      console.log("RECIBIENDO ACTTTT", newNavBar)
      navBarStatus.value = newNavBar.isOpen
    })


    const friendsList = ref([
      {
        userName: "Ale",
        connect: true,
        img: imgSRC.value
      },
      {
        userName: "Andrea",
        connect: true,
        img: cerezas
      },
      {
        userName: "Jeremy",
        connect: false,
        img: cerezas
      },
      {
        userName: "Katheren",
        connect: true,
        img: cerezas
      },

    ])

    const messageList = ref([
      {
        messageContent: "Esto es una prueba1",
        userName: "Andrea"
      },
      {
        messageContent: "Esto es una prueba2",
        userName: "Andrea"
      },
      {
        messageContent: "Esto es una prueba3",
        userName: "Ale"
      },
      {
        messageContent: "Esto es una prueba4",
        userName: "Ale"
      },
      {
        messageContent: "Esto es una prueba5",
        userName: "Andrea"
      },
      {
        messageContent: "Esto es una prueba6",
        userName: "Ale"
      },
      {
        messageContent: "Esto es una prueba7",
        userName: "Andrea"
      }, {
        messageContent: "Esto es una prueba8",
        userName: "Andrea"
      }, {
        messageContent: "Esto es una prueba9",
        userName: "Andrea"
      }, {
        messageContent: "Esto es una prueba11",
        userName: "Andrea"
      }, {
        messageContent: "Esto es una prueba12",
        userName: "Andrea"
      }, {
        messageContent: "Esto es una prueba13",
        userName: "Andrea"
      }, {
        messageContent: "Esto es una prueba14",
        userName: "Andrea"
      }, {
        messageContent: "Esto es una prueba15",
        userName: "Andrea"
      }, {
        messageContent: "Esto es una prueba16",
        userName: "Andrea"
      }, {
        messageContent: "Esto es una prueba17",
        userName: "Andrea"
      },
    ])

    watch(darkMode.value, (dark) => {
      isDark.value = dark.isDark
      isChange.value = dark.isChange
      console.log("CAMBIOOOO", isChange.value)
    })

    return {
      isDark,
      isChange,
      friendsList,
      messageList,
      isUp,
      goToBottom,
      navBarStatus,
      closeSession,
      imgSRC,
      img
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
  background: radial-gradient(circle at 51% 100%, rgba(103, 98, 91, 1) 0%, rgba(3, 27, 38, 1) 100%);
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
  margin-top: 70px;
  width: 70%;
  height: 90%;
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
  width: 28%;
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
  color: antiquewhite;
  font-family: 'Lobster', cursive;
  font-size: 30px;
  letter-spacing: 3px
}

.contentList {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  padding-right: 10px;
  padding-left: 10px;
  height: 90%;
  overflow-y: scroll;
  height: 100%;
  padding-right: -17px;
  /* Increase/decrease this value for cross-browser compatibility */

}

.friendContent {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 83px;
  border: 4px solid antiquewhite;
  border-radius: 30px;
  margin-top: 15px;
}

.friendImg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: auto 0 auto 15px;
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
  width: 55%;
}

.friendConnect {
  width: 25px;
  height: 25px;
  margin: auto 0;
  border-radius: 50%;
  background: green;
  border: 3px solid rgba(3, 27, 38, 1);

}

.friendDisconnect {
  width: 25px;
  height: 25px;
  margin-top: 22px;
  border-radius: 50%;
  background: red;
  border: 3px solid rgba(3, 27, 38, 1);
}

.inputContent {
  position: absolute;
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 60px;
  bottom: 0;
}

.inputMessage {
  position: relative;
  height: 40px;
  width: 80%;
  top: 50%;
  padding-left: 20px;
  background: transparent;
  border: 3px solid antiquewhite;
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
  height: 90%;
  overflow-y: scroll;
}

.ownMessage {
  display: flex;
  justify-content: end;
  position: relative;
  right: 0;
  margin: 23px 3px 23px 90px;
}

.frienMessage {
  display: flex;
  justify-content: start;
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
  background-color: rgba(3, 27, 38, 0.5)
}


.textOwnMessage {
  font-size: 18px;
  margin: 10px;
  color: antiquewhite;
  margin: 12px
}

.sendSvg {
  position: relative;
  width: 40px;
  height: 40px;
  left: 5px;
  top: 11px
}

.emojiSvg {
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
  color: antiquewhite;
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


@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
</style>
