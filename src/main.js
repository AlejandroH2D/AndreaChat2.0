import { createApp, provide, h } from "vue";
import App from './App.vue'
import router from './router'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { splitLink } from "./Apollo/ApolloIndex";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { EmojiPickerPlugin } from 'vue-emoji-picker'



export const defaultClient  = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })

const app = createApp({
    setup() {
        provide(DefaultApolloClient, defaultClient);
    },

    render: () => h(App),
})
app.use(EmojiPickerPlugin)
app.use(router)
app.mount('#app')
