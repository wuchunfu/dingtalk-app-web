<template>
  <el-timeline-item :timestamp="card.fileTypeZHCN" placement="top">
    <el-card>
      <h3 v-if="card.fileName == null">文件未上传！</h3>
      <h3 v-else>{{ card.fileName }}</h3>
      <div v-show="card.fileName != null" style="font-weight: bold; font-size: 12px; float: left">文件路径： {{ getPath }} </div>
      <div>
        <span class="rightFooter">
          <el-tooltip
            class="item"
            effect="dark"
            :content="tipContent"
            placement="right"
          >
            <span style="align-self: center; margin-right: 20px"> <svg-icon icon-class="hint" /></span>
          </el-tooltip>
          <el-upload
            class="uploadFIle"
            :on-change="handleFileChange"
            :show-file-list="false"
            action=""
            :auto-upload="false"
            :accept="acceptType"
          >
            <el-button icon="el-icon-upload2" type="success" style="margin-right: 20px" round>上 传</el-button>
          </el-upload>
          <el-button icon="el-icon-download" type="primary" style="margin-right: 10px" round disabled @click="downloadFile">下 载</el-button>
          <el-button icon="el-icon-delete" type="danger" style="margin-right: 15px" round @click="deleteFile">删 除</el-button>
        </span>
      </div>
    </el-card>
  </el-timeline-item>
</template>

<script>
import { addPaperFile, addExternalPaperFile, getPaperFileDownloadInfo, deletePaperFile, deleteExternalPaperFile } from '@/api/paperFile'
export default {
  name: 'FileCard',
  props: {
    card: {
      type: Object,
      default: function() {
        return null
      }
    },
    paperId: {
      type: String,
      default: ''
    },
    paperType: {
      type: Number,
      default: -1 // -1为默认值，0为内部评审论文，1为外部论文，2为非学生一作论文
    },
    paperPath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tipContent: '',
      acceptType: ''
    }
  },
  computed: {
    getPath() {
      return this.paperPath + '/' + this.card.fileType.substring(0, 1).toUpperCase() + this.card.fileType.substring(1, this.card.fileType.length - 4)
    }
  },
  created() {
    // console.log(this.paperType)
    if (this.card.fileType === 'publishedLatexFile') {
      this.tipContent = '仅支持LaTeX格式文件'
      this.acceptType = '.tex'
    } else {
      this.tipContent = '仅支持Word/PDF格式文件'
      this.acceptType = '.pdf,.doc,.docx'
    }
    console.log(this.card)
  },
  methods: {
    handleFileChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      const formData = new FormData()
      formData.append('file', file.raw)
      formData.append('fileType', this.card.fileType)
      if (this.paperType === 0 || this.paperType === 2) {
        addPaperFile(sessionStorage.getItem('uid'), this.paperId, formData).then(() => {
          this.$notify({
            title: '成功',
            message: '论文文件上传成功',
            type: 'success'
          })
          this.$emit('init')
        }).catch(() => {
          this.$message.error('上传失败')
        })
      } else if (this.paperType === 1) {
        addExternalPaperFile(sessionStorage.getItem('uid'), this.paperId, formData).then(() => {
          this.$notify({
            title: '成功',
            message: '论文文件上传成功',
            type: 'success'
          })
          this.$emit('init')
        }).catch(() => {
          this.$message.error('上传失败')
        })
      }
    },
    downloadFile() {
      getPaperFileDownloadInfo(sessionStorage.getItem('uid'), this.card.fileId).then(res => {
        // console.log(res)
        const fs = require('fs')
        const Axios = require('axios')
        const url = res.url
        const path = 'C:\\'
        const writer = fs.createWriteStream(path)
        Axios({
          url,
          method: 'GET',
          responseType: 'stream',
          headers: {
            '<headerKey1>': res.headerKey1,
            '<headerKey2>': res.headerKey2
          }
        }).then(function(response) {
          response.data.pipe(writer)
        })
      })
    },
    deleteFile() {
      const formData = new FormData()
      formData.append('fileType', this.card.fileType)
      if (this.card.fileName !== undefined && this.card.fileName !== null) {
        console.log(this.card.fileName)
        if (this.paperType === 0 || this.paperType === 2) {
          deletePaperFile(sessionStorage.getItem('uid'), this.paperId, this.card.fileId, formData).then(() => {
            this.$notify({
              title: '成功',
              message: '论文文件删除成功',
              type: 'success'
            })
            this.$emit('init')
          }).catch(() => {
            this.$message.error('删除失败')
          })
        } else if (this.paperType === 1) {
          deleteExternalPaperFile(sessionStorage.getItem('uid'), this.paperId, this.card.fileId, formData).then(() => {
            this.$notify({
              title: '成功',
              message: '论文文件删除成功',
              type: 'success'
            })
            this.$emit('init')
          }).catch(() => {
            this.$message.error('删除失败')
          })
        } else {
          this.$message.error('未知的论文类型！')
        }
      } else {
        this.$message.error('未上传文件！')
      }
    }
  }
}
</script>

<style scoped>
  .rightFooter {
    display: flex;
    justify-content: flex-end;
  }
</style>
