import { defineStore } from "pinia";
import { ref } from "vue";

export const useIdsStore = defineStore(
  "ids",
  () => {
    const clienteId = ref(null);
    const asesorId = ref(null);

    const updateAsesorId = (e, newId) => {
      asesorId.value = newId;
    };
    const updateClienteId = (e, newId) => {
      clienteId.value = newId;
    };

    return { clienteId, asesorId, updateClienteId, updateAsesorId };
  },
  {
    persist: {
      // storage: localStorage,
      storage: sessionStorage,
    },
  }
);
