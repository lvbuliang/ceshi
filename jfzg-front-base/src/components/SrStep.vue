<template>
  <div class="sr-step">
    <ul :class="{ 'sr-step-box': true, 'sr-step-white': mode === 'white' }">
      <li
        v-for="(item, index) in value"
        @click="handleClick(item)"
        :key="index"
        :class="{
          'sr-step-item': true,
          checked_node: item.status == '2',
          wait_node: item.status == '1',
        }"
      >
        <div class="node-name" v-if="item.time">
          {{ item.time }}
          <el-popover
            placement="bottom"
            width="136"
            popper-class="step_popover"
            trigger="hover"
            v-if="Array.isArray(item) && item.length"
          >
            <el-table :show-header="false" :data="item" style="width: 100%">
              <el-table-column prop="time"></el-table-column>
            </el-table>
            <i class="el-icon-more" slot="reference"></i>
          </el-popover>
          <i
            class="el-icon-more"
            slot="reference"
            v-if="Array.isArray(item) && !item.length"
          ></i>
        </div>
        <div class="sr-step-head">
          <div class="line"></div>
          <el-popover
            placement="top-start"
            width="300"
            trigger="hover"
            v-if="item.operator && item.operator.length"
          >
            <p>该节点下一操作人：{{ item.operator }}</p>
            <div slot="reference" class="node"></div>
          </el-popover>
          <div class="node" v-else></div>

          <slot name="blue" v-if="mode === 'blue' && item.status == '1'">
            <img :src="current_node1" class="current_node" />
          </slot>
          <slot name="white" v-if="mode === 'white' && item.status == '1'">
            <img :src="current_node2" class="current_node" />
          </slot>
        </div>
        <div class="node-name">
          {{ item.nodeName }}
          <el-popover
            placement="bottom"
            width="136"
            popper-class="step_popover"
            trigger="hover"
            v-if="Array.isArray(item) && item.length"
          >
            <el-table :show-header="false" :data="item" style="width: 100%">
              <el-table-column prop="nodeName"></el-table-column>
            </el-table>
            <i class="el-icon-more" slot="reference"></i>
          </el-popover>
          <i
            class="el-icon-more"
            slot="reference"
            v-if="Array.isArray(item) && !item.length"
          ></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import current_node1 from "./current_node1.png";
import current_node2 from "./current_node2.png";

export default {
  name: "SrStep",
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      current_node1,
      current_node2,
    };
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    mode: {
      type: String,
      default: () => {
        return "blue";
      },
    },
  },
  mounted() {
  },
  methods: {
    handleClick(item) {
      this.$emit("handleClick", item);
    },
  },
};
</script>
