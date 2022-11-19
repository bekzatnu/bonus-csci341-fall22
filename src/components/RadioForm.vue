<template>
  <div class="flex flex-nowrap overflow-x-auto border-collapse w-full align-middle whitespace-nowrap items-center" role="group">
    <toggle-button :aactive="input_type===buttn" v-for="(buttn,idx) in buttons" :key="idx" :toggleButtonName = "buttn" @toggle="updateActive"/>
  </div>
</template>

<script>
import ToggleButton from "@/components/ToggleButton.vue"

export default {
  name: "radio-form",
  data() {
    return {
    };
  },
  model: {
    prop: 'input_type',
    event: 'update:input_type'
  },
  props: ['buttons', 'input_type'],
  components: {
    ToggleButton
  },
  methods: {
    updateActive(type) {
      this.$emit('update:input_type', type)
    }
  }
};
</script>
