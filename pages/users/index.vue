<template>
  <div>
    <portal to="title">
      {{ title }}
    </portal>

    <a-table
      :columns="columns"
      :data-source="showSearch ? searchResults : users"
      :loading="isLoading"
      row-key="_id"
      :pagination="showSearch ? false : {
        current: page + 1,
        total: count
      }"
      @change="getUsers($event.current - 1)"
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
        <div class="row-avatar user">
          <img width="45" height="45" :src="$CDN(record.avatar)"  alt=""/>
          <p>{{ text }}</p>
        </div>
      </nuxt-link>
      <span slot="action" slot-scope="text, record, index">
        <a-button type="primary" icon="edit" @click="openEditUser(record, index)">Sửa</a-button>
        <a-popconfirm
          title="Các công thức sẽ thuộc về Super Admin?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteUser(record, index)"
        >
          <a-button type="danger" icon="delete">Xoá</a-button>
        </a-popconfirm>
      </span>

      <template slot="role" slot-scope="text">
        <a-tag v-if="text === 'user'" color="#87d068">
          User
        </a-tag>
        <a-tag v-else-if="text === 'mod'" color="#2db7f5">
          Mod
        </a-tag>
        <a-tag v-else-if="text === 'admin'" color="#108ee9">
          Admin
        </a-tag>
        <a-tag v-else-if="text === 'sp_admin'" color="#f50">
          Super Admin
        </a-tag>
      </template>

      <span slot="createdAt" slot-scope="text">
        {{ $moment(text).format('DD/MM/YYYY') }}
      </span>

      <a-dropdown slot="customTitle" v-model="searchDropDown" :trigger="['click']">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <a-icon type="search" />
        </a>
        <a-menu slot="overlay" @click="() => {}">
          <a-menu-item>
            <a-input-group compact>
              <a-select v-model="searchForm.field" style="width: 40%">
                <a-select-option value="email">
                  Email
                </a-select-option>
                <a-select-option value="name">
                  Name
                </a-select-option>
              </a-select>
              <a-input v-model="searchForm.keyword" style="width: 60%" placeholder="Nhập từ khoá..." @pressEnter="searchAction()">
                <a-icon slot="prefix" type="search" />
              </a-input>
            </a-input-group>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item>
            <a-button style="width: 50%" type="primary" size="small" icon="search" @click="searchAction()">Tìm</a-button>
            <a-button style="width: 50%"  type="danger" size="small" @click="cancelSearch()">Huỷ</a-button>
          </a-menu-item>
        </a-menu>
      </a-dropdown>


    </a-table>

    <a-modal v-model="visible" title="Sửa Thành Viên" :width="800" @ok="onSubmit()">
      <a-form-model ref="ruleForm" :rules="rules" :model="currentUser" layout="vertical">
        <a-row>
          <a-col :span="11">
            <a-form-model-item label="Avatar" prop="avatar">
              <div class="form-user-avatar">
                <a-spin :spinning="isLoadingAvatar">
                  <div class="user-avatar" @click="$refs.avatarInput.click()">
                    <img :src="$CDN(currentUser.avatar)" alt="" />
                    <input ref="avatarInput" style="display: none" type="file" @change="buildCropper($event)" />
                  </div>
                </a-spin>
                <a-button :disabled="isLoadingAvatar" size="small" type="primary" icon="upload" @click="$refs.avatarInput.click()">Tải Lên</a-button>
              </div>
            </a-form-model-item>
            <a-form-model-item label="Tên" prop="name">
              <a-input v-model="currentUser.name" placeholder="Tên Người Dùng" />
            </a-form-model-item>
            <a-form-model-item label="Email" prop="email">
              <a-input v-model="currentUser.email" placeholder="Email ID" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :offset="1">
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="Quê Quán" prop="province">
                  <a-select v-model="currentUser.province" placeholder="please select your zone">
                    <a-select-option v-for="(item, index) in listProvinces" :key="index" :value="item.name">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="11" :offset="1">
                <a-form-model-item label="Phân Quyền" prop="role">
                  <a-select v-model="currentUser.role" placeholder="Quyền truy cập" :disabled="!verifyRole(currentUser.role)">
                    <a-select-option value="user">User</a-select-option>
                    <a-select-option :disabled="!verifyRole('mod')"  value="mod">Mod</a-select-option>
                    <a-select-option :disabled="!verifyRole('admin')" value="admin">Admin</a-select-option>
                    <a-select-option :disabled="!verifyRole('sp_admin')" value="sp_admin">Super Admin</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item label="Giới Thiệu" prop="about">
              <a-textarea v-model="currentUser.about" :rows="6" placeholder="Giới Thiệu" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <a-modal v-model="visible2" title="Di Chuyển Và Cắt Hình Của Bạn" ok-text="Cắt Ảnh" @ok="cropAction()">
      <vue-cropper
        id="cropAvatar"
        ref="cropAvatar"
        class="j_avatar_img cropper-area"
        alt="Source Image"
        :auto-crop-area="1"
        :crop-box-resizable="false"
        :toggle-drag-mode-on-dblclick="false"
        :aspect-ratio="1"
        :drag-mode="'move'"
        :view-mode="3"
        :crop-box-movable="false"
      ></vue-cropper>
    </a-modal>

  </div>
</template>

<script>

import { mapGetters } from "vuex";
import listProvinces from '~/assets/provinces.json'

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
          title: 'Phân Quyền',
          dataIndex: 'role',
          key: 'role',
          align: 'center',
          scopedSlots: {
            customRender: 'role',
          }
        },
        {
          title: 'Email',
          key: 'email',
          dataIndex: 'email'
        },
        {
          title: 'Số Công Thức',
          dataIndex: 'countRecipe',
          key: 'countRecipe',
          align: 'center'
        },
        {
          title: 'Ngày Tham Gia',
          key: 'createdAt',
          dataIndex: 'createdAt',
          align: 'right',
          scopedSlots: {
            customRender: 'createdAt',
          }
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
      users: [],
      searchResults: [],
      count: 0,
      showSearch: false,
      page: 0,
      searchDropDown: false,
      searchForm: {
        keyword: '',
        field: 'email'
      },
      title: 'Quản Lý Thành Viên',
      roles: ['user', 'mod', 'admin', 'sp_admin'],
      visible: false,
      currentUser: {},
      currentIndex: '',
      rules: {
        avatar: [
          { required: true, message: 'Tên là bắt buộc', trigger: 'blur' }
        ],
        name: [
          { required: true, message: 'Tên là bắt buộc', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Tên là bắt buộc', trigger: 'blur' }
        ],
        province: [
          { required: true, message: 'Tên là bắt buộc', trigger: 'blur' }
        ],
        role: [
          { required: true, message: 'Tên là bắt buộc', trigger: 'blur' }
        ],
      },
      listProvinces,
      visible2: false,
      isLoadingAvatar: false
    }
  },
  computed: {
    ...mapGetters('pref', ['user'])
  },
  mounted() {
    this.getCount()
    this.getUsers(0)
  },
  methods: {

    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.visible = false
          this.updateUser()
        } else {
          return false;
        }
      });
    },

    async updateUser() {
      this.isLoading = true
      try {
        const { data } = await this.$axios.$patch('/admin/user/' + this.currentUser.slug, this.currentUser)
        this.$set(this.users, this.currentIndex, data)
      } catch (e) {}
      this.currentIndex = ''
      this.currentUser = {}
      this.isLoading = false
    },

    async getCount() {
      try {
        const { data } = await this.$axios.$get('/admin/users/count')
        this.count = data
      } catch (e) {
        this.$message.warn('Lấy số lượng thất bại')
      }
    },

    async getUsers(page) {
      this.isLoading = true
      try {
        const { data } = await this.$axios.$get('/admin/user', { params: { order: 'createdAt', page, limit: 10 } })
        this.users = data
        this.page = page
      } catch (e) {}
      this.isLoading = false
    },


    verifyRole (role) {
      const index1 = this.roles.indexOf(this.user.role)
      const index2 = this.roles.indexOf(role)
      return index1 > index2
    },


    async deleteUser({ slug, role }, index) {
      if(!this.verifyRole(role)) {
        this.$message.error('Bạn không có quyền')
        return
      }
      this.isLoading = true
      try {
        await this.$axios.$delete('/admin/user/' + slug)
        this.$delete(this.users, index)
      } catch (e) {}
      this.isLoading = false
    },

    async searchAction() {
      if(!this.searchForm.keyword) {
        return
      }
      this.title = `Tìm Kiếm "${this.searchForm.keyword}"`
      this.searchDropDown = false
      this.showSearch = true
      this.isLoading = true
      try {
        const { data } = await this.$axios.$get('/admin/users/search', { params: Object.assign({}, this.searchForm, { limit: 10 }) })
        this.searchResults = data
      } catch (e) {}
      this.isLoading = false
    },

    cancelSearch() {
      if(this.showSearch) {
        this.title = 'Quản Lý Thành Viên'
        this.searchDropDown = false
        this.showSearch = false
        this.searchResults = []
      }
    },

    openEditUser({role}, index) {
      if(!this.verifyRole(role)) {
        return this.$message.error('Bạn không có quyền')
      }
      this.currentIndex = index
      this.currentUser = Object.assign({}, this.users[index])
      this.visible = true
    },

    buildCropper({ target }) {
      const file = target.files[0]
      if (!file.type.includes('image/')) {
        this.$message.error( 'Hãy chọn ảnh')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.visible2 = true
          this.$nextTick(()=> {
            this.$refs.cropAvatar.replace(event.target.result)
          })
        }
        reader.readAsDataURL(file)
      } else {
        this.$message.error( 'Sorry, FileReader API not supported')
      }
    },

    cropAction() {
      this.$refs.cropAvatar.getCroppedCanvas().toBlob((blob) => {
        this.visible2 = false
        this.uploadAvatar(blob)
      })
    },
    async uploadAvatar(image) {
      this.isLoadingAvatar = true
      try {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('path', 'avatar')
        const { data } = await this.$axios.$post('/upload/single', formData)
        this.currentUser.avatar = data
      } catch (e) {}
      this.isLoadingAvatar = false
    }
  }
}
</script>
<style>
.row-avatar.user img {
  border-radius: 50%;
}

.user-avatar {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 12px;
}
.form-user-avatar {
  display: flex;
  align-items: center;
}
.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.user-avatar:hover {
  cursor: pointer;
}
#cropAvatar {
  margin: 0 auto;
  width: 280px;
  height: 280px;
  overflow: hidden;
  position: relative;
  border-radius: 100%;
}
</style>
