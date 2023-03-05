import {createRouter,createWebHashHistory } from 'vue-router'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import LandingPage from './components/LandingPage'
import IndexView from './components/IndexView'
import { defaultClient } from './main'
import gql from 'graphql-tag'

const routes = [
    {
      path: "/login",
      name: "login",
      meta: {
        isAuth: true
      },
      component: LoginPage
    },
    {
      path: "/register",
      name: "register",
      meta: {
        isAuth: true
      },
      component: RegisterPage
    },
    {
      path: "/",
      name: "home",
      component: LandingPage
    },
    {
      path: "/index",
      name: "index",
      meta: {
        requiresAuth: true
      },
      component: IndexView
    },
  ];

  const router = createRouter({
    history: createWebHashHistory(),
    routes
  })

  router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (localStorage.token) {
        const auth = await defaultClient.query({
          query: gql`
          query Query($token: String) {
            verifyToken(token: $token)
          }
          `,
          fetchPolicy: "no-cache" ,
          variables: {
           token: localStorage.token
          }
         }).then(res => {
          console.log(res)
          return res.data.verifyToken
         })
         if (auth) {
          next();
        } else {
          next({ name: "login" });
        }
      } else {
        next({ name: "login" });
      }
    } else {
      next();
    }
  });

  router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.isAuth)) {
      if (localStorage.token) {
        const auth = await defaultClient.query({
          query: gql`
          query Query($token: String) {
            verifyToken(token: $token)
          }
          `,
          variables: {
           token: localStorage.token
          }
         }).then(res => {
          return res.data.verifyToken
         })
         if (auth) {
          next({ name: "index" });
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next();
    }
  });
  
  export default router;