<!--
 * @Author: zxy
 * @Date: 2024-09-20 16:52:44
 * @LastEditTime: 2024-09-29 17:21:58
 * @FilePath: \MakeMemo\src\components\common\SkuTask\SkuTask.vue
-->
<template>
  <div class="sku-task">
    <transition-group name="slice" tag="div">
      <sku-task-item
        v-for="item in props.taskList"
        :key="item.id"
        :taskName="item.taskName"
        :taskStatus="item.taskStatus"
        :taskId="item.id"
        :taskPriority="item.taskPriority"
        @taskChange="handleChange"
      />
    </transition-group>
  </div>
</template>

<script setup>
import { checkHasAllProperties } from "../../../utils";
import SkuTaskItem from "./SkuTaskItem.vue";

const props = defineProps({
  taskList: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((item) => {
        const requiredKeys = ["id", "taskName", "taskStatus"];
        return checkHasAllProperties(requiredKeys, item);
      });
    },
  },
});

const emit = defineEmits(["taskChange"]);

const handleChange = (e) => {
  emit("taskChange", e);
};
</script>

<style lang="scss" scoped>
/* 组件增减动画样式 */
.slice-enter-active,
.slice-leave-active {
  overflow: hidden;
}

.slice-enter-from,
.slice-leave-to {
  transform: translateX(-100%);
}

.slice-enter-to,
.slice-leave-from {
  transform: translateX(0%);
}

.slice-enter-active {
  animation: sliceIn 0.3s forwards;
}

.slice-leave-active {
  animation: sliceOut 0.3s forwards;
}

@keyframes sliceIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
}

@keyframes sliceOut {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
