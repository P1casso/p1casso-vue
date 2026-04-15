<template>
  <a-card>
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="npsso">
        <a-input v-model:value="ps.npsso" style="width: 600px" />
        <a-popconfirm title="确认更新npsso？此参数关系到数据获取" ok-text="是" cancel-text="否" @confirm="updateNpsso">
         <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </a-form-item>
      <a-form-item label="account_id">
        <a-input v-model:value="ps.accountId" style="width: 200px" />
        <a-button type="primary">更新</a-button>
      </a-form-item>
      <a-form-item v-if="ps.syncTime !== null" label="sync_time">
        <div>{{ ps.syncTime }}</div>
        <a-button type="primary">解除限制</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import { getSetting, updateNpsso } from '@/api/psn'

export default {
  name: 'setting',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      ps: {
        accountId: '',
        npsso: '',
        syncTime: '',
      },
    }
  },
  methods: {
    getPsSetting() {
      getSetting().then((res) => {
        this.ps.accountId = res.data.accountId
        this.ps.npsso = res.data.npsso
        console.log(res.data.syncTime)
        this.ps.syncTime = res.data.syncTime
      })
    },
    updateNpsso() {
      updateNpsso(this.ps.npsso).then((res) => {
        if (res.code === 200) {
          this.$message.success('更新成功')
        } else {
          this.$message.error('更新失败')
        }
      })
    },
  },
  created() {
    this.getPsSetting()
  },
}
</script>

<style scoped lang="less"></style>
