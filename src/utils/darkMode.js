import { ref } from "vue";

export const darkMode = ref({
    isDark: false,
    isChange: false,
    changeView() {
        this.isDark = !this.isDark;
        localStorage.dark = this.isDark
        this.isChange = !this.isChange
        setTimeout(() => {
            this.isChange = !this.isChange 
        },800)
    }
});

localStorage.dark === "true"? darkMode.value.changeView(): null