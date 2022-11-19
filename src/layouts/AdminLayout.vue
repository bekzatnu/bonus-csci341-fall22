<template>
  <div>
    <div class="relative bg-slate-100 py-10 min-h-screen">
      <div class="px-4 mb-10 md:px-10 mx-auto w-full">
        <data-table />
      </div>
    </div>
  </div>
</template>
<script>

import DataTable from '@/components/DataTable.vue'

export default {
  name: "admin-layout",
  components: {
    DataTable,
  },
};
</script>
