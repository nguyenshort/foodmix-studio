<template>
  <div>
    <portal to="title">
      Phân Loại Món Ăn
    </portal>

    <a-table :columns="columns" :data-source="categories" row-key="_id" :loading="isLoading">

      <div slot="avatar" slot-scope="text">
        <div class="row-avatar">
          <img width="150" height="80" :src="$CDN(text)" alt=""/>
        </div>
      </div>

      <span slot="action" slot-scope="text, record, index">
        <a-button type="primary" icon="edit" @click="showModal(index)">Sửa</a-button>
        <a-button type="danger" icon="delete" @click="showDeleteOption(index)">Xoá</a-button>
      </span>

    </a-table>

    <a-modal v-model="visible" title="Sửa Phân Loại" ok-text="Cập Nhật" cancel-text="Huỷ" :width="800" @ok="handleOk">
    <a-form-model :model="category" layout="vertical">
      <a-row>
        <a-col :span="13">
          <a-form-model-item label="Tên" prop="name">
            <a-input v-model="category.name" placeholder="Tên phân loại"/>
          </a-form-model-item>
          <a-form-model-item label="Mô tả" prop="content">
            <a-textarea v-model="category.content" placeholder="Tên phân loại" :rows="5"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="10" :offset="1">
          <a-form-model-item label="Ảnh Đại Diện" prop="avatar">
            <a-spin :spinning="isUploadingAvatar">
              <div class="category-avatar" style="width: 300px; height: 160px" @click="$refs.inputAvatar.click()">
                <img v-if="category.avatar" width="300" height="160" style="object-fit: cover" :src=" previewImage || $CDN(category.avatar)" alt=""/>
              </div>
            </a-spin>
            <input ref="inputAvatar" type="file" accept='image/*' style="display: none" @change="uploadAvatar($event)" />
            <div style="margin-top: 10px">
              <a-button type="primary" icon="upload" :disabled="isUploadingAvatar" @click="$refs.inputAvatar.click()">
                Tải Lên
              </a-button>

              <a-button type="danger" icon="delete" :disabled="isUploadingAvatar" @click="category.avatar = ''">
                Xoá
              </a-button>
            </div>
            <template slot="extra">
              <small>
                - Nhấn để thêm ảnh mới.
              </small>
            </template>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>

    <a-modal v-model="visible2" title="Tuỳ Chọn Xoá" ok-text="Xoá" cancel-text="Huỷ" @ok="deleteCategory">
      <a-form-model-item ref="newCategory" help="Hãy chọn phân loại mới">
        <a-select v-model="newCategory" style="width: 100%" @change="validateNewcategory()">
          <a-select-option
            v-for="(category2, index) in categories.filter((e) => e.slug !== category.slug)"
            :key="index"
            :value="category2.slug"
          >{{ category2.name }}</a-select-option>
        </a-select>

        <template slot="extra">
          <small>
            - Các món ăn sẽ cần phân loại mới.
            <br />
            - Hãy chọn phân loại mới!
          </small>
        </template>

      </a-form-model-item>
    </a-modal>

  </div>
</template>

<script>

const columns = [
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  {
    title: 'Ảnh Đại Diện',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 180,
    scopedSlots: {customRender: 'avatar'},
  },
  {
    title: 'Nội Dung',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: 'Hành Động',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    width: 200,
    align: 'right'
  },
];


export default {
  name: "CategoriesPage",
  middleware: 'mod',
  data() {
    return {
      categories: [],
      isLoading: false,
      columns,
      visible: false,
      visible2: false,
      category: {},
      currentIndex: '',
      isUploadingAvatar: false,
      previewImage: '',
      newCategory: ''
    }
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    showModal(index) {
      this.currentIndex = index
      this.category = Object.assign({}, this.categories[index])
      this.visible = true;
    },
    async getCategories() {
      this.isLoading = true
      try {
        const {data} = await this.$axios.$get('/admin/category')
        this.categories = data
      } catch (e) {
      }
      this.isLoading = false
    },

    showDeleteOption(index) {
      if(this.categories.length <= 1) {
        return this.$message.warn('Phải có ít nhất 1 phân loại')
      }
      this.currentIndex = index
      this.category = Object.assign({}, this.categories[index])
      this.visible2 = true;
    },
    async handleOk() {

      this.visible = false
      this.isLoading = true
      try {
        const { data } = await this.$axios.$post(`/admin/category/${this.category.slug}`, this.category)
        this.$set(this.categories, this.currentIndex, data)
      } catch (e) {}
      this.category = {}
      this.currentIndex = ''
      this.isLoading = false

    },

    async uploadAvatar({ target }) {
      this.isUploadingAvatar = true
      const file = target.files[0]
      try {
        this.previewImage = URL.createObjectURL(file)
        const formData = new FormData()
        formData.append('image', file)
        formData.append('path', 'category')
        const { data } = await this.$axios.$post('/upload/single', formData)
        this.category.avatar = data
      } catch (e) {
        this.$message.error('Tải lên thất bại')
      }
      this.previewImage = ''
      this.isUploadingAvatar = false
    },

    validateNewcategory() {
      this.$refs.newCategory.validateState = this.newCategory ? 'success' : 'error'
    },

    async deleteCategory() {
      this.validateNewcategory()
      if(this.newCategory) {
        this.visible2 = false
        this.isLoading = true
        try {
          await this.$axios.$delete('/admin/category/' + this.category.slug, { params: { newCategory: this.newCategory } })
          this.$delete(this.categories, this.currentIndex)
          this.category = {}
          this.currentIndex = ''
          this.newCategory = ''
        } catch (e) {}
        this.isLoading = false
      }
    }
  }
}
</script>
<style>
.category-avatar {
  border-radius: 10px;
  overflow: hidden;
}
.category-avatar:hover {
  cursor: pointer;
}
</style>
