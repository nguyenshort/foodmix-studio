<template>
  <div>
    <portal to="title">
      {{ title }}
    </portal>

    <portal to="action">
      <a-button type="primary" icon="plus" size="large" @click="$router.push('/workspace/recipe')">
        Thêm Mới
      </a-button>
    </portal>

    <a-table
      :columns="columns"
      :data-source="showSearch ? searchResults : recipes"
      :loading="isLoading"
      row-key="_id"
      :pagination="showSearch ? false : {
        current: page + 1,
        total: count
      }"
      @change="getRecipes($event.current - 1)"
    >
      <nuxt-link
        slot="name"
        slot-scope="text, record"
        :to="{
          name: 'workspace-recipe',
          query: {
            id: record.slug
          }
        }"
      >
        <div class="row-avatar">
          <img width="150" height="80" :src="$CDN(record.avatar)"  alt=""/>
          <p>{{ text }}</p>
        </div>
      </nuxt-link>
      <span slot="action" slot-scope="text, record, index">
        <a-button type="primary" icon="edit" @click="$router.push({
          name: 'workspace-recipe',
          query: {
            id: record.slug
          }
        })">Sửa</a-button>
        <a-popconfirm
          title="Bạn có chắc muốn xoá công thức này?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteRecipe(record.slug, index)"
        >
          <a-button type="danger" icon="delete">Xoá</a-button>
        </a-popconfirm>
      </span>

      <a-dropdown slot="customTitle" v-model="searchDropDown">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <a-icon type="search" />
        </a>
        <a-menu slot="overlay" @click="() => {}">
          <a-menu-item>
            <a-input v-model="keyword" placeholder="Nhập từ khoá..." @pressEnter="searchAction()">
              <a-icon slot="prefix" type="search" />
            </a-input>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item>
            <a-button style="width: 50%" type="primary" size="small" icon="search" @click="searchAction()">Tìm</a-button>
            <a-button style="width: 50%"  type="danger" size="small" @click="cancelSearch()">Huỷ</a-button>
          </a-menu-item>
        </a-menu>
      </a-dropdown>


    </a-table>

  </div>
</template>

<script>

export default {
  name: "RecipesPage",
  data() {
    return {
      columns: [
        {
          title: 'Tên',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: 'Phân Loại',
          dataIndex: 'category.name',
          key: 'category.name',
          align: 'center'
        },
        {
          title: 'Lượt Xem',
          dataIndex: 'views',
          key: 'views',
          align: 'center'
        },
        {
          title: 'Lượt Đánh Giá',
          key: 'countRating',
          dataIndex: 'countRating',
          align: 'center'
        },
        {
          title: 'Điểm Đánh Giá',
          key: 'rating',
          dataIndex: 'rating',
          align: 'center'
        },
        {
          key: 'action',
          align: 'right',
          scopedSlots: {
            customRender: 'action',
          },
          slots: { title: 'customTitle' }
        },
      ],
      isLoading: false,
      recipes: [],
      searchResults: [],
      count: 0,
      showSearch: false,
      page: 0,
      searchDropDown: false,
      keyword: '',
      title: 'Công Thức Của Tôi'
    }
  },
  mounted() {
    this.getCount()
    this.getRecipes(0)
  },
  methods: {
    async getCount() {
      try {
        const { data } = await this.$axios.$get('/admin/recipes/count')
        this.count = data
      } catch (e) {
          this.$message.warn('Lấy số lượng thất bại')
      }
    },
    async getRecipes(page) {
      this.isLoading = true
      try {
        const { data } = await this.$axios.$get('/admin/recipe', { params: { order: 'createdAt', page, limit: 10 } })
        this.recipes = data
        this.page = page
      } catch (e) {}
      this.isLoading = false
    },
    async deleteRecipe(slug, index) {
      this.isLoading = true
      try {
        await this.$axios.$delete('/admin/recipe/' + slug)
        this.$delete(this.recipes, index)
      } catch (e) {}
      this.isLoading = false
    },

    async searchAction() {
     if(!this.keyword) {
       return
     }
     this.title = `Tìm Kiếm "${this.keyword}"`
     this.searchDropDown = false
     this.showSearch = true
     this.isLoading = true
      try {
        const { data } = await this.$axios.$get('/admin/recipes/search', { params: { keyword: this.keyword, limit: 10 } })
        this.searchResults = data
      } catch (e) {}
      this.isLoading = false
    },

    cancelSearch() {
      if(this.showSearch) {
        this.title = 'Công Thức Của Tôi'
        this.searchDropDown = false
        this.showSearch = false
        this.searchResults = []
      }
    }
  }
}
</script>
