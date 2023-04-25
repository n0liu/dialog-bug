<template>
  <div class="nav" ref="nav">
    <el-dialog v-model="centerDialogVisible" title="Warning" width="300px" center style="color: red;" id="dialog">
      <template #header>
        <div class="my-header" ref="headerRef"> This is a custom header! </div>
      </template>
      <span>
        It should be noted that the content will not be aligned in center by
        default
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="centerDialogVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <el-button type="primary" @click="changeVisible">按钮</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const centerDialogVisible = ref(false)
import { useDraggable } from './index'

const headerRef = ref()
const nav = ref()
const changeVisible = () => {
  centerDialogVisible.value = true
}

useDraggable('#dialog', headerRef, true, nav)

</script>

<style scoped>
.nav {
  width: 700px;
  height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid #ccc;
  transform: translate(-50%, -50%);
}
</style>
<style>
body {
  width: 100vw;
  height: 100vh;
}
.el-overlay {
  position: absolute;
}
.el-overlay-dialog {
  position: absolute;
}
.el-dialog__header {
  padding: 0;
  cursor: move;
}
.my-header {
  padding: 20px 20px 0 10px;
}
</style>