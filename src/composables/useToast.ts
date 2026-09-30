import { ref } from 'vue';

// Global toast (module-scoped singleton) — แทนการ emit 'showToast' ขึ้นไปหา App.vue
const message = ref<string | null>(null);

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

const show = (msg: string) => {
  message.value = msg;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    message.value = null;
  }, 3000);
};

export function useToast() {
  return { message, show };
}
