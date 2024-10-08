<!--
 * @Author: zxy
 * @Date: 2024-09-20 16:52:44
 * @LastEditTime: 2024-09-29 19:21:58
 * @FilePath: \MakeMemo\src\views\SkuMemoHome.vue
-->
<template>
  <sku-context-swipe>
    <template #left>
      <div class="sku-home-page-left">
        <div class="sku-task-list">
          <sku-task :taskList="state.todoList" @taskChange="handleTaskChange" />
        </div>
      </div>
    </template>
    <template #right>
      <div class="sku-task-list">
        <sku-task :taskList="state.doneList" @taskChange="handleTaskChange" />
      </div>
    </template>
  </sku-context-swipe>

  <sku-add-task
    @submit="handleAddTaskSubmit"
    @editSubmit="handleEditTaskSubmit"
  />
</template>

<script setup>
import { computed, onBeforeMount, reactive, watch } from "vue";
import { useStore } from "../stores";
import SkuTask from "../components/common/SkuTask/SkuTask.vue";
import SkuContextSwipe from "../components/layout/SkuContextSwipe.vue";
import SkuAddTask from "../components/common/SkuAddTask/SkuAddTask.vue";
import {
  httpTaskAdd,
  httpTaskChange,
  httpTaskGetAll,
} from "../mockApiForIndexDB/task";
import {
  ApiType,
  sortType,
  TaskPriority,
  TaskStatus,
} from "../assets/data/status";

// Pinia store
const store = useStore();

const state = reactive({
  // 任务列表
  taskList: [],
  // 未完成任务列表
  todoList: computed(() =>
    state.taskList.filter((item) => item.taskStatus === TaskStatus["未完成"])
  ),
  // 已完成任务列表
  doneList: computed(() =>
    state.taskList.filter((item) => item.taskStatus === TaskStatus["已完成"])
  ),
  // 当前使用的DB
  nowUseDBName: ApiType[store.activeIndexInSidebar],
  // 当前排序方式
  nowSortType: sortType["优先级升序"],
});

/**
 * 根据返回的任务id与任务状态，更新任务状态
 * @param e 返回的任务id与任务状态
 */
const handleTaskChange = (e) => {
  const { taskId, taskStatus } = e;
  const index = state.taskList.findIndex((item) => item.id === taskId);
  state.taskList[index].taskStatus = taskStatus;

  updateTaskList(e, state.nowUseDBName);
};

/**
 * 添加任务
 * @param e 任务对象
 */
const handleAddTaskSubmit = async (e) => {
  await httpTaskAdd(e, state.nowUseDBName);

  getAllTaskList(state.nowUseDBName);
};

/**
 * 编辑任务
 * @param e 任务对象
 */
const handleEditTaskSubmit = async (e) => {
  await updateTaskList(e, state.nowUseDBName);

  getAllTaskList(state.nowUseDBName);
};

/**
 * 获取任务列表
 */
const getAllTaskList = async (dbName) => {
  // 获取任务列表
  const res = await httpTaskGetAll(dbName);
  state.taskList = res.data ?? [];

  const sortStrategies = {
    [sortType["优先级升序"]]: (a, b) => a.taskPriority - b.taskPriority,
    [sortType["优先级降序"]]: (a, b) => b.taskPriority - a.taskPriority,
  };

  // 根据排序方式排序
  state.taskList.sort((a, b) => {
    a.taskPriority = a.taskPriority ?? TaskPriority["无优先级"];
    b.taskPriority = b.taskPriority ?? TaskPriority["无优先级"];
    return sortStrategies[state.nowSortType](a, b);
  });
};

/**
 * 更新单个任务
 */
const updateTaskList = async (e) => {
  const updateObj = {
    ...e,
    taskStatus: e.taskStatus,
    taskName: e.taskName,
    taskPriority: e.taskPriority ?? TaskPriority["无优先级"],
  };
  await httpTaskChange(e.taskId, updateObj, state.nowUseDBName);
};

// 监听侧边栏变化，切换请求类型
watch(
  () => store.activeIndexInSidebar,
  (newVal) => {
    state.nowUseDBName = ApiType[newVal];
    getAllTaskList(ApiType[newVal]);
  }
);

onBeforeMount(() => {
  // 获取任务列表
  getAllTaskList(state.nowUseDBName);
});
</script>

<style lang="scss" scoped></style>
