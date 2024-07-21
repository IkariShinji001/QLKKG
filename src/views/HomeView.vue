<template>
  <h1>Quản lý kho ký gửi</h1>
  <router-link to="/clients">
    <div class="btn-container">
      <q-btn class="client_list">Quản lý Danh sách khách hàng</q-btn>
    </div>
  </router-link>

  <router-link to="/products">
    <div class="btn-container">
      <q-btn class="kho-list">Kho ký gửi</q-btn>
    </div>
  </router-link>
</template>

<script lang="ts" setup>

</script>

<style scoped>
  .client_list {
    margin-top: 100px;
    background-color: rgb(42, 42, 215);
    color: white;
    padding: 15px 20px;
    width: 100%;
    font-size: 17px;
  }

  .kho-list {
    margin-top: 20px;
    background-color: rgb(42, 42, 215);
    color: white;
    padding: 15px 20px;
    width: 100%;
    font-size: 17px;
  }

  .btn-container {
    min-width: 320px;
  }

  h1 {
    font-size: 2.7em;
  }
</style>