<template>
  <div class="back">
    <q-icon @click="goBack" name="arrow_back_ios"></q-icon>
  </div>
  <div class="search-container">
    <q-input class="input-search" outlined v-model="search" label="Tìm kiếm sản phẩm"></q-input>
    <q-btn class="btn-add" round color="primary" icon="add" @click="openAddProduct" />
    <q-dialog v-model="dialog" class="dialog">
      <q-card class="card">
        <span class="title">{{ dialogType === 'CREATE' ? 'Thêm sản phẩm mới' : `Cập nhật thông tin sản phẩm
          ${productInput.id}`
          }}</span>
        <q-input v-if="dialogType === 'CREATE'" class="input" v-model="productInput.id" label="Mã sản phẩm"></q-input>
        <q-input class="input" v-model="productInput.name" label="Tên sản phẩm"></q-input>
        <q-input class="input" v-model.number="productInput.price" label="Giá sản phẩm"></q-input>
        <q-input class="input" v-model.number="productInput.discount" label="Chiết khấu"></q-input>
        <q-select label="Khách hàng" v-model="productInput.clientId" :options="clients" option-label="name"
          option-value="id" map-options emit-value></q-select>
        <div>
          <p>Đã bán món hàng này</p>
          <q-radio class="input-radio" v-model="productInput.sale_status" label="Đã bán" val="true"></q-radio>
          <q-radio class="input-radio" v-model="productInput.sale_status" label="Chưa bán" val="false"></q-radio>
        </div>

        <div>
          <p>Đã trả tiền chiết khấu cho khách</p>
          <q-radio class="input-radio" v-model="productInput.discount_status" label="Đã trả" val="true"></q-radio>
          <q-radio class="input-radio" v-model="productInput.discount_status" label="Chưa trả" val="false"></q-radio>
        </div>

        <q-btn v-if="dialogType === 'CREATE'" class="btn-save" @click="handleAddProduct">Lưu</q-btn>
        <div class="update-group">
          <q-btn v-if="dialogType === 'UPDATE'" class="btn-update" @click="handleUpdate">Cập nhật</q-btn>
          <q-btn v-if="dialogType === 'UPDATE'" class="btn-delete" @click="handleDelete">Xóa</q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>

  <div class="checkbox">
    <q-checkbox v-model="IsSaleProduct" label="Đã bán"></q-checkbox>
    <q-checkbox v-model="IsDiscountProduct" label="Đã chiết khấu"></q-checkbox>
  </div>

  <span class="total">{{ filteredProducts.length }} sản phẩm</span>
  <div class="table-container" style="height: 400px; overflow-y: auto;">
    <table>
      <thead class="head-table">
        <tr>
          <th class="msp">Mã SP</th>
          <th class="tsp">Tên SP</th>
          <th class="gia">Giá</th>
          <th class="chietkhau">Chiết khấu</th>
        </tr>
      </thead>
      <tbody v-if="products.length > 0">
        <tr v-for="product in filteredProducts" :key="product.id">
          <td @click="openUpdateProduct(product.id)">{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ formattedPrice(product.price) }}</td>
          <td>{{ formattedPrice(product.discount) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, onBeforeMount, computed } from 'vue';
  import { Product } from '../entities/product.entity';
  import { Client } from '../entities/client.entity';
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  const dialogType = ref('CREATE')
  const dialog = ref()
  const search = ref()
  const router = useRouter()
  const $q = useQuasar()
  const IsSaleProduct = ref(false)
  const IsDiscountProduct = ref(false)
  const clients = ref<Client[]>();
  const products = ref<Product[]>([]);
  const productInput: Product = reactive({
    id: '',
    clientId: '',
    name: '',
    price: 0,
    discount: 0,
    discount_status: false,
    sale_status: false,
  })

  const goBack = () => {
    router.push({ path: '/' })
  }
  onBeforeMount(() => {
    const storedClients = localStorage.getItem('clients');
    const storedProducts = localStorage.getItem('products');

    if (storedProducts) {
      products.value = JSON.parse(storedProducts);
    } else {
      products.value = [];
    }

    if (storedClients) {
      clients.value = JSON.parse(storedClients);
      if (clients.value) {
        clients.value.sort((a, b) => a.name.localeCompare(b.name));
      }
    } else {
      clients.value = [];
    }
  })


  const checkIsExistMaSP = (maSP: string): boolean => {
    return products.value.some(product => product.id === maSP);
  };
  const openAddProduct = () => {
    productInput.id = '';
    productInput.discount = 0;
    productInput.discount_status = false;
    productInput.sale_status = false;
    productInput.name = '';
    productInput.price = 0;
    productInput.clientId = '';
    dialogType.value = 'CREATE'
    dialog.value = true;
  }

  const openUpdateProduct = (id: string) => {
    dialogType.value = 'UPDATE';
    const index = products.value.findIndex((product) => product.id === id);
    productInput.id = products.value[index].id;
    productInput.name = products.value[index].name;
    productInput.clientId = products.value[index].clientId;
    productInput.discount = products.value[index].discount;
    productInput.discount_status = products.value[index].discount_status;
    productInput.price = products.value[index].price;
    productInput.sale_status = products.value[index].sale_status;
    dialog.value = true;
  }

  const handleUpdate = () => {
    const index = products.value.findIndex((product) => product.id === productInput.id);
    products.value[index].clientId = productInput.clientId;
    products.value[index].name = productInput.name;
    products.value[index].discount = productInput.discount
    products.value[index].discount_status = productInput.discount_status;
    products.value[index].price = productInput.price;
    products.value[index].sale_status = productInput.sale_status;
    localStorage.setItem('products', JSON.stringify(products.value));
    dialog.value = false;
  }

  const filteredProducts = computed(() => {
    let filtered = products.value;

    if (IsSaleProduct.value) {
      filtered = filtered.filter(product => String(product.sale_status) === 'true');

    }

    if (IsDiscountProduct.value) {
      filtered = filtered.filter(product => String(product.discount_status) === 'true');
    }

    if (!search.value) {
      return filtered;
    }
    const keyword = search.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(keyword) ||
      product.id.toLowerCase().includes(keyword)
    );

    return filtered;
  });


  const handleAddProduct = () => {
    if (checkIsExistMaSP(productInput.id)) {
      $q.notify({
        color: 'negative',
        position: 'top',
        timeout: 2000,
        message: 'Trùng mã sản phẩm!'
      })
      return;
    }

    if (!productInput.id || !productInput.name || !productInput.price || !productInput.clientId || !productInput.discount) {
      $q.notify({
        color: 'negative',
        position: 'top',
        timeout: 2000,
        message: 'Không được để trống!'
      })
      return;
    }
    products.value = [...products.value, { ...productInput }]
    localStorage.setItem('products', JSON.stringify(products.value));
    dialog.value = false;
  }

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleDelete = () => {
    const confirm = window.confirm('Bạn muốn xóa sản phẩm này?');
    if (confirm) {
      const index = products.value.findIndex((product) => product.id === productInput.id);
      products.value.splice(index, 1);
      localStorage.setItem('products', JSON.stringify(products.value));
      dialog.value = false;
    }
    return;
  }

</script>

<style scoped>
  .input-search {
    font-size: 17px;
    width: 80%;
  }

  .back {
    display: flex;
    font-size: 30px;
    margin-bottom: 20px;
  }

  .checkbox {
    display: flex;
  }

  .btn-add {
    width: 17%;
  }

  .title {
    font-size: 18px;
  }

  .input {
    width: 100%;
  }


  .update-group {
    margin-top: 15px;
    display: flex;
    justify-content: space-around;
  }

  .btn-save {
    padding: 5px 80px;
    margin: 0 auto;
    display: flex;
    background-color: rgb(42, 42, 215);
    color: white;
  }

  .card {
    width: 100%;
    margin-bottom: 250px
  }

  .search-container {
    display: flex;
    gap: 20px;
  }

  p {
    margin: 10px 0;
    text-decoration: underline
  }

  .table-container {
    margin-top: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td {
    font-size: 15px;
  }

  tr:nth-child(even) {
    background-color: #f4f4f4
  }

  th,
  td {
    border: 1px solid rgb(233, 226, 226);
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
    background-color: #efdfdf8a;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }

  .msp {
    width: 15%;
  }

  .tsp {
    width: 30%;
  }

  .gia {
    width: 20%;
  }

  .chietkhau {
    width: 20%;
  }

  .total {
    display: flex;
  }

  .btn-update {
    padding: 10px 70px;
    background-color: blue;
    color: white;
  }

  .btn-delete {
    padding: 10px 30px;
    background-color: rgb(197, 35, 35);
    color: white;
  }
</style>