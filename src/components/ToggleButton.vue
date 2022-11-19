<template>
  <button class="px-6 py-3 flex-1
                 font-medium text-xs leading-tight
                 hover:text-slate-200 hover:bg-slate-800
                 w-full
                 active:bg-slate-700 transition duration-150 ease-in-out"
          :class="[this.aactive ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800']"
          type="button"
          @click="updateActive">
    {{toggleButtonName}}
    </button>
</template>

<script>
export default {
  name: "toggle-button",

  props: ['aactive', 'toggleButtonName'],
  model: {
  },

  methods: {
    updateActive() {
      this.$emit('toggle', this.toggleButtonName)
    }
  }
};
</script>
