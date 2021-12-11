<template>

  <div>
    <portal to="title">
      {{ title }}
    </portal>

    <portal to="action">
      <a-button
        type="primary"
        icon="plus"
        size="large"
        :loading="isLoading"
        @click="onSubmit()"
      >
        {{ $route.query.id ? 'Cập Nhật' : 'Đăng Ngay' }}
      </a-button>
    </portal>

    <div class="edit-body">
      <a-spin :spinning="isLoading">
        <a-form-model
          id="addRecipe"
          ref="ruleForm"
          :model="form"
          :rules="rules"
          layout="vertical"
        >
          <a-form-model-item ref="avatar" label="Ảnh Bìa" prop="avatar">
            <a-spin :spinning="isUploadImage">
              <label class="recipe-avatar">
                <input ref="avatarInput" class="input-recipe-avatar" type="file" @change="buildCropper($event, 'avatar')" />
                <img v-if="form.avatar" width="300" height="160" :src="$CDN(form.avatar)"  alt=""/>
              </label>
              <div style="margin-top: 10px">
                <a-button type="primary" icon="upload" @click="$refs.avatarInput.click()">
                  Tải Lên
                </a-button>

                <a-button type="danger" icon="delete" @click="form.avatar = ''">
                  Xoá
                </a-button>
              </div>
            </a-spin>
            <template slot="extra">
              <small>
                - Nhấn để thêm ảnh mới.
                <br />
                - Có công cụ hỗ trợ cắt ảnh trực tiếp!
              </small>
            </template>
          </a-form-model-item>
          <a-form-model-item ref="name" label="Tên Món Ăn" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>

          <a-row>
            <a-col :span="5">
              <a-form-model-item label="Thời Gian Chuẩn Bị">
                <a-time-picker v-model="form.preparation" format="HH:mm" />
                <template slot="extra">
                  <small>
                    Định dạng: Giờ:Phút
                  </small>
                </template>
              </a-form-model-item>
            </a-col>
            <a-col :span="5" :offset="1">
              <a-form-model-item label="Thời Gian Nấu">
                <a-time-picker v-model="form.time" format="HH:mm" />
                <template slot="extra">
                  <small>
                    Định dạng: Giờ:Phút
                  </small>
                </template>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" :offset="1">
              <a-form-model-item label="Phân Loại Món Ăn" prop="category">
                <a-select v-model="form.category" placeholder="Chọn loại món ăn của bạn">
                  <a-select-option v-for="(category, index) in categories" :key="index" :value="category._id">
                    {{ category.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-form-model-item label="Mô tả" prop="content">
            <a-input v-model="form.content" type="textarea" />
          </a-form-model-item>

          <a-divider orientation="left">
            Thành Phần Món Ăn ({{ form.ingredients.length }})
          </a-divider>
          <a-form-model-item>
            <a-row>
              <a-col :span="12">
                Tên Nguyên Liệu
              </a-col>
              <a-col :span="5" :offset="1">
                Số Lượng
              </a-col>
              <a-col :span="4">
                Đơn Vị
              </a-col>
              <a-col :span="1" :offset="1"></a-col>
            </a-row>
          </a-form-model-item>

          <div v-for="(item , index) in form.ingredients" :key="index">
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  :prop="'ingredients[' + index + '].name'"
                  :rules="{
                  required: true,
                  message: 'Tên nguyên liệu là bắt buộc',
                  trigger: 'blur',
                }"
                >
                  <a-input v-model="item.name" placeholder="Tên" />
                </a-form-model-item>
              </a-col>
              <a-col :span="5" :offset="1">
                <a-form-model-item>
                  <a-input-number v-model.number="item.count" placeholder="1" :min="1" />
                </a-form-model-item>
              </a-col>
              <a-col :span="4">
                <a-form-model-item
                  :prop="'ingredients[' + index + '].unit'"
                  :rules="{
                  required: true,
                  message: 'Đơn vị là bắt buộc',
                  trigger: 'blur',
                }"
                >
                  <a-input v-model="item.unit" placeholder="Đơn vị" />
                </a-form-model-item>
              </a-col>
              <a-col :span="1" :offset="1">
                <a-button
                  v-if="form.ingredients.length > 1"
                  shape="circle"
                  type="danger"
                  icon="delete"
                  @click="removeIngredient(index)"
                ></a-button>
              </a-col>
            </a-row>
          </div>

          <a-form-model-item prop="ingredients">
            <a-row>
              <a-col :span="12">
                <a-button type="dashed" style="width: 100%" @click="addIngredient">
                  <a-icon type="plus" /> Thêm Thành Phần
                </a-button>
              </a-col>
            </a-row>
          </a-form-model-item>

          <a-divider orientation="left">
            Các Bước Làm
          </a-divider>

          <a-timeline>
            <a-timeline-item v-for="(step, index) in form.stepper" :key="index">
              <a-row>
                <a-col :span="21" :offset="1">
                  <a-form-model-item
                    style="margin-bottom: 0"
                    :prop="'stepper[' + index + '].content'"
                    :rules="{
                  required: true,
                  message: 'Nội dung bước làm là bắt buộc',
                  trigger: 'blur',
                }"
                  >
                    <a-input v-model="step.content" type="textarea" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="1" :offset="1">
                  <a-button
                    v-if="form.stepper.length > 1"
                    shape="circle"
                    type="danger"
                    icon="delete"
                    style="margin-top: 10px"
                    @click="removeStep(index)"
                  ></a-button>
                </a-col>
                <a-col :span="23" :offset="1">
                  <a-spin ref="stepperSpin" style="width: 200px;" :spinning="false">
                    <label class="recipe-stepper">
                      <input ref="avatarInput" class="input-recipe-avatar" type="file" @change="buildCropper($event, index)" />
                      <img v-if="step.image" width="200" height="106" :src="$CDN(step.image)"  alt=""/>
                    </label>
                    <div style="margin-top: 10px">
                      <a-button type="primary" icon="upload" @click="$refs.avatarInput[index].click()">
                        Tải Lên
                      </a-button>

                      <a-button type="danger" icon="delete" @click="step.image = ''">
                        Xoá
                      </a-button>
                    </div>
                  </a-spin>
                </a-col>
              </a-row>
            </a-timeline-item>
          </a-timeline>

          <a-form-model-item prop="stepper">
            <a-row>
              <a-col :span="12" :offset="1">
                <a-button type="dashed" style="width: 100%" @click="addStep()">
                  <a-icon type="plus" /> Thêm Bước Làm
                </a-button>
              </a-col>
            </a-row>
          </a-form-model-item>

        </a-form-model>
      </a-spin>
    </div>

    <a-modal v-model="visible" title="Di Chuyển Vào Cắt Hình">
      <div>
        <vue-cropper
          id="cropImage"
            ref="cropAvatar"
            class="j_avatar_img cropper-area"
            alt="Source Image"
            :auto-crop-area="1"
            :crop-box-resizable="false"
            :toggle-drag-mode-on-dblclick="false"
            :aspect-ratio="300/160"
            :drag-mode="'move'"
            :view-mode="1"
            :crop-box-movable="false"
            :min-container-height="400"
            :min-crop-box-width="400"
          ></vue-cropper>
      </div>
      <template slot="footer">
        <a-button key="back" @click="visible = false">
          Huỷ
        </a-button>
        <a-button key="submit" type="primary" :loading="isUploadImage" @click="cropAction">
          Cắt Ảnh
        </a-button>
      </template>
    </a-modal>


  </div>

</template>
<script>

export default {
  name: "NewRecipe",
  data() {

    /**
     * @param rule
     * @param value { Array }
     * @param callback { Function }
     */
    const validateIngredients = (rule, value, callback) => {
      if(!Array.isArray(value)) {
        callback(new Error('Thành phần không hợp lệ'))
      } else if(!value.length) {
        callback(new Error('Món ăn phải có ít nhất 1 nguyên liệu'))
      } else {
        callback()
      }
    }

    /**
     * @param rule
     * @param value { Array }
     * @param callback { Function }
     */
    const validateStepper = (rule, value, callback) => {
      if(!Array.isArray(value)) {
        callback(new Error('Các bước làm không hợp lệ'))
      } else if(!value.length) {
        callback(new Error('Món ăn phải có ít nhất 1 bước làm'))
      } else {
        callback()
      }
    }

    return {
      form: {
        name: '',
        avatar: '',
        content: '',
        category: '',
        ingredients: [],
        stepper: [],
        preparation: this.$moment('00:10', 'HH:mm'),
        time: this.$moment('00:10', 'HH:mm')
      },
      visible: false,
      isUploadImage: false,
      isLoading: false,
      rules: {
        name: [
          { required: true, message: 'Tên món ăn là bắt buộc', trigger: 'blur' }
        ],
        content: [
          { required: true, message: 'Mô tả món ăn là bắt buộc', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: 'Ảhh món ăn là bắt buộc', trigger: 'blur' }
        ],
        category: [
          { required: true, message: 'Phân loại món ăn là bắt buộc', trigger: 'blur' }
        ],
        ingredients: [{ validator: validateIngredients, trigger: 'blur' }],
        stepper: [{ validator: validateStepper, trigger: 'blur' }],
      },
      categories: [],
      currentIndex: '',
      title: ''
    };
  },
  created() {
    this.getCategories()
    this.configView()
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitRecipe()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },

    async submitRecipe() {
      this.isLoading = true
      try {
        const formData = Object.assign({}, this.form, { preparation: this.form.preparation.format('HH:mm'), time: this.form.time.format('HH:mm') });
        const { data } = await this.$axios.$post(`/admin/recipe/${this.$route.query.id || ''}`, formData)
        await this.$router.replace({query: {id: data.slug}})
      } catch (e) {}
      this.isLoading = false
    },

    addIngredient() {
      this.form.ingredients.push({ name: '', count: 1, unit: 'gam' })
    },

    addStep() {
      this.form.stepper.push({ content: '', image: '' })
    },

    removeIngredient(index) {
      this.$delete(this.form.ingredients, index)
    },

    removeStep(index) {
      this.$delete(this.form.stepper, index)
    },

    async getCategories() {
      try {
        const { data } = await this.$axios.$get('/categories')
        this.categories = data

      } catch (e) {}
    },

    buildCropper({ target }, index) {

      this.currentIndex = index

      const file = target.files[0]
      if (!file.type.includes('image/')) {
        this.$message.error( 'Hãy chọn ảnh')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.visible = true
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
        this.visible = false
        this.currentIndex === 'avatar' ? this.uploadAvatar(blob) : this.uploadImageStepper(blob)
      })
    },

    async uploadAvatar(image) {
      this.isUploadImage = true
      const result = await this.uploadImage(image, 'recipe')
      if(result) {
        this.form.avatar = result
      }
      this.isUploadImage = false
    },

    async uploadImageStepper(image) {
      if(typeof this.form.stepper[this.currentIndex] === 'undefined') {
        return
      }

      this.$refs.stepperSpin[this.currentIndex].spinning = true

      this.form.stepper[this.currentIndex].image = await this.uploadImage(image, 'recipe')

      this.$refs.stepperSpin[this.currentIndex].spinning = false
    },

    async uploadImage(image, path) {

      try {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('path', path)
        const { data } = await this.$axios.$post('/upload/single', formData)

        return data

      } catch (e) {
        console.log(e)
      }

    },

    async configView() {
      if (!this.$route.query.id) {
        this.title = 'Công Thức Mới'
        return
      }
      this.isLoading = true
      try {

        const { data } = await this.$axios.$get('/admin/recipe/' + this.$route.query.id)
        this.form = Object.assign(
          {},
          data,
          {
            preparation: this.$moment(data.preparation, 'HH:mm'),
            time: this.$moment(data.time, 'HH:mm'),
            category: data.category._id
          }
        )
        this.title = this.form.name

      } catch (e) {}
      this.isLoading = false
    }
  },
}
</script>

<style>
#addRecipe {
  width: 600px;
}
.recipe-avatar {
  width: 300px;
  height: 160px;
  background: #00000014;
  border-radius: 8px;
  position: relative;
  display: block;
}

.recipe-stepper {
  width: 200px;
  height: 106px;
  background: #00000014;
  border-radius: 8px;
  position: relative;
  display: block;
}
.input-recipe-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
}
#cropImage {
  height: 400px;
}
</style>
