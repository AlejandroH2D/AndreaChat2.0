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

console.log("averrr",typeof localStorage.dark)

localStorage.dark === "true"? darkMode.value.changeView(): null