<template>
  <div class="back">
    <q-icon @click="goBack" name="arrow_back_ios"></q-icon>
  </div>
  <h1>Danh sách khách hàng</h1>
  <div class="search-container">
    <q-input class="input-search" outlined v-model="search" label="Tìm kiếm khách hàng"></q-input>
    <q-btn class="btn-add" round color="primary" icon="add" @click="openClientAdd" />

    <q-dialog v-model="dialog" class="dialog">
      <q-card class="card">
        <span>{{ headerDialog }}</span>
        <q-input v-if="headerDialog === 'Thêm khách hàng mới'" class="input" v-model="clientInput.id"
          label="Mã khách hàng"></q-input>
        <q-input class="input" v-model="clientInput.name" label="Tên khách hàng"></q-input>
        <q-input class="input" v-model="clientInput.phoneNumber" label="Số điện thoại"></q-input>
        <q-input class="input" v-model="clientInput.linkFacebook" label="Link Facebook"></q-input>
        <q-btn v-if="headerDialog === 'Thêm khách hàng mới'" class="btn-save" @click="addClientToList">Lưu</q-btn>
        <q-btn v-if="headerDialog === 'Cập nhật khách hàng'" class="btn-save" @click="handleUpdate">Cập nhật</q-btn>
      </q-card>
    </q-dialog>
  </div>


  <div class="table-container" style="height: 350px; overflow-y: auto;">
    <table>
      <thead class="head-table">
        <tr>
          <th class="mkh">Mã KH</th>
          <th class="tkh">Tên KH</th>
          <th class="sdt">SDT</th>
          <th class="linkfb">Link FB</th>
        </tr>
      </thead>
      <tbody v-if="clients.length > 0">
        <tr v-for="client in filteredClients" :key="client.id">
          <td @click=updateClient(client.id)>{{ client.id }}</td>
          <td>{{ client.name }}</td>
          <td>{{ client.phoneNumber }}</td>
          <td><a :href="client.linkFacebook">Link</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
  h1 {
    font-size: 2.5em;
    margin: 0;
  }

  a {
    text-decoration: underline;
  }

  .mkh {
    width: 15%;
  }

  .tkh {
    width: 30%;
  }

  .sdt {
    width: 30%;
  }

  .linkfb {
    width: 15%;
  }

  .btn-save {
    padding: 5px 80px;
    margin: 0 auto;
    display: flex;
    background-color: rgb(42, 42, 215);
    color: white;
  }

  .input-search {
    font-size: 17px;
    width: 80%;
  }

  .btn-add {
    width: 17%;
  }


  .search-container {
    display: flex;
    gap: 20px
  }

  .card {
    width: 100%;
    margin-bottom: 300px;
  }

  .input {
    margin: 10px 0;
    font-size: 17px;
  }

  .table-container {
    margin-top: 40px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: rgb(185, 201, 214);
    position: sticky;
    top: 0;
    /* Đảm bảo tiêu đề dính vào đầu bảng khi cuộn */
    z-index: 1;
  }

  th.sticky {
    background-color: #f4f4f4;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }

  .back {
    display: flex;
    font-size: 30px;

  }


  td {
    font-size: 15px;
  }

  tr:nth-child(even) {
    background-color: #f4f4f4
  }

</style>


<script lang="ts" setup>
  import { computed, onBeforeMount, reactive, ref } from 'vue';
  import { Client } from '../entities/client.entity';
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';

  const $q = useQuasar()
  const router = useRouter()
  const search = ref()
  const dialog = ref()
  const clientInput: Client = reactive({
    id: '',
    name: '',
    phoneNumber: '',
    linkFacebook: ''
  });
  const headerDialog = ref('Thêm khách hàng mới')

  const clients = ref<Client[]>([]);

  onBeforeMount(() => {
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      clients.value = JSON.parse(storedClients);
    } else {
      clients.value = [];
    }
  })

  const filteredClients = computed(() => {
    if (!search.value) {
      return clients.value;
    }
    const keyword = search.value.toLowerCase();
    return clients.value.filter(client =>
      client.name.toLowerCase().includes(keyword) ||
      client.phoneNumber.includes(keyword) ||
      client.id.toString().includes(keyword)
    );
  });


  const checkIsExistMaKH = (maKH: string): boolean => {
    return clients.value.some(client => client.id === maKH);
  };
  const addClientToList = () => {
    if (checkIsExistMaKH(clientInput.id)) {
      $q.notify({
        color: 'negative',
        position: 'top',
        timeout: 2000,
        message: 'Trùng mã khách hàng!'
      })
      return;
    }

    if (!clientInput.id || !clientInput.name || !clientInput.phoneNumber) {
      $q.notify({
        color: 'negative',
        position: 'top',
        timeout: 2000,
        message: 'Không được để trống!'
      })
      return;
    }
    clients.value = [...clients.value, { ...clientInput }]
    localStorage.setItem('clients', JSON.stringify(clients.value));
    dialog.value = false;
  }

  const goBack = () => {
    router.push({ path: '/' })
  }

  const openClientAdd = () => {
    headerDialog.value = 'Thêm khách hàng mới';
    dialog.value = true;
    clientInput.id = '';
    clientInput.name = '';
    clientInput.linkFacebook = '';
    clientInput.phoneNumber = '';
  }

  const updateClient = (id: string) => {
    headerDialog.value = 'Cập nhật khách hàng';
    dialog.value = true;
    const index = clients.value.findIndex((client) => client.id === id);
    if (index === -1) {
      return;
    }
    clientInput.id = clients.value[index].id;
    clientInput.name = clients.value[index].name;
    clientInput.linkFacebook = clients.value[index].linkFacebook;
    clientInput.phoneNumber = clients.value[index].phoneNumber;
  }

  const handleUpdate = () => {
    if (!clientInput.name || !clientInput.phoneNumber) {
      $q.notify({
        color: 'negative',
        position: 'top',
        timeout: 2000,
        message: 'Không được để trống!'
      })
      return;
    }
    const index = clients.value.findIndex((client) => client.id === clientInput.id);
    clients.value[index].id = clientInput.id;
    clients.value[index].name = clientInput.name;
    clients.value[index].linkFacebook = clientInput.linkFacebook;
    clients.value[index].phoneNumber = clientInput.phoneNumber;
    localStorage.setItem('clients', JSON.stringify(clients.value));
    dialog.value = false;
  }

</script>