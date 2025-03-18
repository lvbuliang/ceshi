<template>
  <div class="total-page">
    <div class="base">
      <div class="base-left" :style="{ height: pageHeight + 'px' }">
        <basic-info />
      </div>

      <div class="base-right">
        <div class="base-right-top">
          <div class="base-message-right-top">
            <span class="base-message-right-top-title">里程碑节点</span>
            <span @click="showDialogJd" class="el-icon-edit" style="cursor: pointer"
              v-permission="['DSZ', 'ZJL', 'F_ZJL', 'XMGLB', 'BM_FZR']">维护节点</span>

          </div>
          <div class="base-message-line"></div>
          <!-- 里程碑步骤条 -->
          <div class="base-right-top-step">
            <div class="base-right-box">
              <!-- 首个 -->
              <div v-for="(item, index) in beginList" :key="index">
                <div class="base-right-top-step-box" :style="{ position: 'relative', left: index * -14 + 'px' }">
                  <div class="base-right-top-box1" @click="
                    changeSpanaActive(
                      item.stageId,
                      item.stageName,
                      item.projectId
                    )
                    ">
                    <!-- 里程碑图片 -->
                    <img v-if="
                      Math.ceil(
                        (new Date() - item.dueEndTime) / (1000 * 60 * 60 * 24)
                      ) > 0 && item.isEnd !== '已完成'
                    " style="width: 100%; height: 100%" :src="spanaActive == item.stageId
                          ? overdueFront
                          : overdueUnFront
                        " alt="" />
                    <img v-else-if="
                      item.isEnd == '进行中' || item.isEnd == '未开始'
                    " style="width: 100%; height: 100%" :src="spanaActive == item.stageId
                          ? incompleteFront
                          : incompleteUnFront
                        " alt="" />
                    <img v-else style="width: 100%; height: 100%" :src="spanaActive == item.stageId
                        ? completeFront
                        : completeUnFront
                      " alt="" />
                    <div style="position: absolute">
                      <p style="font-weight: 700">{{ item.stageName }}</p>
                      <p>状态:{{ item.isEnd }}</p>
                    </div>
                  </div>
                  <div style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: column;
                    ">
                    <!-- <p>预计:{{ formatDate(item.dueEndTime) }}</p> -->
                    <p v-show="item.isEnd == '已完成'">
                      实际:{{ formatDate(item.actualEndTime) }}
                    </p>
                    <!-- <p
                      style="color: red"
                      v-if="
                        Math.ceil(
                          (new Date() - item.dueEndTime) / (1000 * 60 * 60 * 24)
                        ) > 0
                      "
                    >
                      逾期:{{
                        Math.ceil(
                          (new Date() - item.dueEndTime) / (1000 * 60 * 60 * 24)
                        )
                      }}
                      天
                    </p> -->
                    <!-- <p
                      style="color: red"
                      v-if="item.isEnd != '已完成' && item.day !== null"
                    >
                      逾期:{{ item.day }}
                      天
                    </p> -->
                  </div>
                </div>
              </div>
              <!-- 中间 -->
              <div v-for="(item, index) in spanaActiveList2" :key="index" style="margin-left: -9px">
                <div class="base-right-top-step-box" :style="{ position: 'relative', right: index * -2 + 'px' }">
                  <div class="base-right-top-box1" @click="
                    changeSpanaActive(
                      item.stageId,
                      item.stageName,
                      item.projectId
                    )
                    ">
                    <!-- 里程碑图片 -->

                    <img v-if="
                      Math.ceil(
                        (new Date() - item.dueEndTime) / (1000 * 60 * 60 * 24)
                      ) > 0 && item.isEnd !== '已完成'
                    " style="width: 100%; height: 100%" :src="spanaActive == item.stageId
                          ? overdueCenter
                          : overdueUnCenter
                        " alt="" />
                    <img v-else-if="
                      item.isEnd == '进行中' || item.isEnd == '未开始'
                    " style="width: 100%; height: 100%" :src="spanaActive == item.stageId
                          ? incompleteCenter
                          : incompleteUnCenter
                        " alt="" />
                    <img v-else style="width: 100%; height: 100%" :src="spanaActive == item.stageId
                        ? completeCenter
                        : completeUnCenter
                      " alt="" />
                    <div style="position: absolute">
                      <p style="font-weight: 700">{{ item.stageName }}</p>
                      <p>状态:{{ item.isEnd }}</p>
                    </div>
                  </div>
                  <div style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: column;
                    ">
                    <!-- <p>预计:{{ formatDate(item.dueEndTime) }}</p> -->
                    <p v-show="item.isEnd == '未开始'">
                      {{
                        item.actualEndTime == null
                          ? ""
                          : `实际:${formatDate(item.actualEndTime)}`
                      }}
                    </p>
                    <p v-show="item.isEnd !== '未开始'">
                      {{
                        item.actualEndTime == null
                          ? ""
                          : `实际:${formatDate(item.actualEndTime)}`
                      }}
                    </p>
                    <!-- <p
                      style="color: red"
                      v-if="
                        Math.ceil(
                          (new Date() - item.dueEndTime) / (1000 * 60 * 60 * 24)
                        ) > 0
                      "
                    >
                      逾期:{{
                        Math.ceil(
                          (new Date() - item.dueEndTime) / (1000 * 60 * 60 * 24)
                        )
                      }}
                      天
                    </p> -->
                    <!-- <p
                      style="color: red"
                      v-if="item.isEnd != '已完成' && item.day !== null"
                    >
                      逾期:{{ item.day }}
                      天
                    </p> -->
                  </div>
                </div>
              </div>
              <!-- 中间 -->
              <div v-for="(item, index) in endList" :key="index" style="position: relative">
                <div class="base-right-top-step-box" :style="{ position: 'absolute', left: index * -100 + 'px' }">
                  <div class="base-right-top-box1" @click="
                    changeSpanaActive(
                      item.stageId,
                      item.stageName,
                      item.projectId
                    )
                    ">
                    <!-- 里程碑图片 -->
                    <img v-if="
                      Math.ceil(
                        (new Date() - item.dueEndTime) / (1000 * 60 * 60 * 24)
                      ) > 0 && item.isEnd !== '已完成'
                    " style="width: 100%; height: 100%" :src="spanaActive == item.stageId
                          ? overdueAfter
                          : overdueUnAfter
                        " alt="" />
                    <img v-else-if="
                      item.isEnd == '进行中' || item.isEnd == '未开始'
                    " style="width: 100%; height: 100%" :src="spanaActive == item.stageId
                          ? incompleteAfter
                          : incompleteUnAfter
                        " alt="" />
                    <img v-else style="width: 100%; height: 100%" :src="spanaActive == item.stageId
                        ? completeAfter
                        : completeUnAfter
                      " alt="" />
                    <div style="position: absolute">
                      <p style="font-weight: 700">{{ item.stageName }}</p>
                      <p>状态:{{ item.isEnd }}</p>
                    </div>
                  </div>
                  <div style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: column;
                    ">
                    <!-- <p>预计:{{ formatDate(item.dueEndTime) }}</p> -->
                    <p v-show="item.isEnd !== '未开始'">
                      实际{{ formatDate(item.actualEndTime) }}
                    </p>
                    <!-- <p
                      style="color: red"
                      v-if="
                        Math.ceil(
                          (new Date() - item.dueEndTime) / (1000 * 60 * 60 * 24)
                        ) > 0
                      "
                    >
                      逾期:{{
                        Math.ceil(
                          (new Date() - item.dueEndTime) / (1000 * 60 * 60 * 24)
                        )
                      }}
                      天
                    </p> -->
                    <!-- <p
                      style="color: red"
                      v-if="item.isEnd != '已完成' && item.day !== null"
                    >
                      逾期:{{ item.day }}
                      天
                    </p> -->
                  </div>
                </div>
              </div>
              <!-- 末尾 -->
            </div>
          </div>
        </div>

        <div class="base-right-bottom" style="position: relative">
          <!-- 单标段 -->
          <div v-if="
            ['内部立项', '项目交底', '项目实施', '项目结项'].includes(
              stageName
            ) || isHaveData
          " style="position: absolute; width: 97%">
            <!-- 表格组件 -->
            <el-tabs v-model="activeName2">
              <!-- 原来组件 -->
              <el-tab-pane label="项目交付物" name="first1">
                <SrTable @pageChanged="pageChanged" :data="table.data" @sizeChanged="sizeChanged"
                  @sortChange="sortChange" :config="table.tableConfig" :page="table.page" @selected="selected"
                  :status="selectStatus" ref="selectTable" @clickRow="clickRow">
                  <template slot="cellSlot"> 上传....</template>

                  <template slot="name" slot-scope="scope">
                    <span v-if="scope.scope.row.isMustUpload == 1" style="color: red">*</span>
                    {{ scope.scope.row.name }}
                  </template>
                </SrTable>
                <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                  <div class="btns">
                    <div class="back-btn">
                      <el-button v-if="testjfw" type="primary" size="medium" round @click="submit">保存
                      </el-button>
                      <el-button plain size="medium" round @click="goback">返回列表</el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="补充信息" name="second2">
                <div class="buchong-box">
                  <!-- 方案环节显示的盒子 -->
                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '实施方案确认'">
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">预算评审完成日期:</span>
                      <span class="buchong-box-single-span2">
                        <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" v-model="result.fanganOne"
                          placeholder="选择日期">
                        </el-date-picker>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">实施方案确认日期:</span>

                      <span class="buchong-box-single-span2">
                        <!-- :disabled="testId2 > 0 ? true : false" -->
                        <!-- <el-input
                      :disabled="true"
                        @blur="supInfo(index)"
                        placeholder="请输入"
                        v-model="result.fanganTwo"
                      ></el-input> -->
                        <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" v-model="result.fanganTwo"
                          placeholder="选择日期">
                        </el-date-picker>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">概算核定完成日期:</span>

                      <span class="buchong-box-single-span2">
                        <!-- :disabled="testId2 > 0 ? true : false" -->
                        <!-- <el-input
                      :disabled="true"
                        @blur="supInfo(index)"
                        placeholder="请输入"
                        v-model="result.fanganThree"
                      ></el-input> -->
                        <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" v-model="result.fanganThree"
                          placeholder="选择日期">
                        </el-date-picker>
                      </span>
                    </div>
                  </div>
                  <!-- 内部立项显示的盒子 -->
                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '内部立项'">
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">初审完成时间:</span>

                      <span class="buchong-box-single-span2">
                        <!-- :disabled="testId2 > 0 ? true : false" -->
                        <!-- <el-input
                        :disabled="true"
                        @blur="supInfo(index)"
                        placeholder=""
                        v-model="result2.neibulixiangOne"
                      ></el-input> -->
                        <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" type="date" style="width: 200px" v-model="result2.neibulixiangOne"
                          placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">集团决策时间:</span>

                      <span class="buchong-box-single-span2">
                        <!-- <el-input
                        :disabled="true"
                        @blur="supInfo(index)"
                        placeholder=""
                        v-model="result2.neibulixiangTwo"
                      ></el-input> -->
                        <!-- :disabled="testId2 > 0 ? true : false" -->
                        <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" type="date" style="width: 200px" v-model="result2.neibulixiangTwo"
                          placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">科研项目名称:</span>

                      <span class="buchong-box-single-span2">
                        <el-input :disabled="true" @blur="supInfo(index)" placeholder=""
                          v-model="result2.neibulixiangThree"></el-input>
                      </span>
                    </div>

                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">公司决策会召开日期:</span>

                      <span class="buchong-box-single-span2">
                        <!-- <el-input
                        :disabled="true"
                        @blur="supInfo(index)"
                        placeholder=""
                        v-model="result2.neibulixiangThree"
                      ></el-input> -->
                        <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" type="date" style="width: 200px" v-model="result2.neibulixiangFour"
                          placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                  </div>
                  <!-- 项目采购 -->
                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '项目采购'">
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">中标单位:</span>

                      <span class="buchong-box-single-span2">
                        <el-input :disabled="testId2 > 0 ? true : false" @blur="supInfo(index)" placeholder="请输入"
                          v-model="result3.xiangmucaigouOne"></el-input>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">合同名称:</span>

                      <span class="buchong-box-single-span2">
                        <el-input :disabled="testId2 > 0 ? true : false" @blur="supInfo(index)" placeholder="请输入"
                          v-model="result3.xiangmucaigouTwo"></el-input>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">合同金额(万元):</span>

                      <span class="buchong-box-single-span2">
                        <el-input :disabled="testId2 > 0 ? true : false" @input="handleInput5" placeholder="请输入"
                          v-model="result3.xiangmucaigouThree"></el-input>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">合同开始日期:</span>

                      <span class="buchong-box-single-span2">
                        <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" v-model="result3.xiangmucaigouFour"
                          placeholder="选择日期">
                        </el-date-picker>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">合同结束日期:</span>

                      <span class="buchong-box-single-span2">
                        <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" v-model="result3.xiangmucaigouFive"
                          placeholder="选择日期">
                        </el-date-picker>
                      </span>
                    </div>
                  </div>

                  <!-- 项目交底 -->
                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '项目交底'">
                    <div class="buchong-box-single">
                      <!-- <span class="buchong-box-single-span1">交底日期:</span> -->
                      <span class="buchong-box-single-span1_1">交底日期:</span>

                      <span class="buchong-box-single-span2">
                        <!-- :disabled="testId2 > 0 ? true : false" -->
                        <!-- <el-input
                        :disabled="true"
                        placeholder="请输入"
                        @input="handleInput"
                        v-model="result4.xiangmujiaodiOne"
                      >
                      </el-input> -->
                        <!-- :disabled="testId2 > 0 ? true : false" -->
                        <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" type="date" v-model="result4.xiangmujiaodiOne" placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                  </div>

                  <!-- 启动 -->
                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '项目启动'">
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1_1">开工日期:</span>
                      <span class="buchong-box-single-span2">
                        <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" type="date" v-model="result5.xiangmuqidongOne" placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                  </div>
                  <!-- 初验 -->
                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '项目初验'">
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1_1">初验日期:</span>

                      <span class="buchong-box-single-span2">
                        <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" type="date" v-model="result6.chuyanOne" placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                  </div>
                  <!-- 试运行 -->
                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '试运行'">
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">试运行开始时间:</span>
                      <span class="buchong-box-single-span2">
                        <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width: 200px"
                          v-model="result7.shiyunxingOne" placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">试运行周期(月):</span>
                      <span class="buchong-box-single-span2">
                        <el-input :disabled="testId2 > 0 ? true : false" placeholder="请输入时长" @input="handleInput3"
                          v-model="result7.shiyunxingTwo" maxlength="10">
                        </el-input>
                      </span>
                    </div>

                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">试运行结束时间:</span>
                      <span class="buchong-box-single-span2">
                        <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width: 200px"
                          v-model="result7.shiyunxingThree" placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                  </div>
                  <!-- 终验 -->
                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '项目终验'">
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1_1">终验日期:</span>

                      <span class="buchong-box-single-span2">
                        <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" type="date" v-model="result8.zhongyanOne" placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                  </div>
                  <!-- 项目结项 1-->

                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '项目结项'">
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1_1">结项日期:</span>

                      <span class="buchong-box-single-span2">
                        <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" type="date" v-model="result9.pingjiaOne" placeholder="">
                        </el-date-picker>
                      </span>
                    </div>
                  </div>
                  <!-- 运维  -->
                  <div style="display: flex; flex-wrap: wrap" v-if="stageName == '运维'">
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">考核得分:</span>

                      <span class="buchong-box-single-span2">
                        <el-input :disabled="testId2 > 0 ? true : false" @blur="supInfo(index)" @input="handleInput2"
                          placeholder="请输入" v-model="result9.pingjiaTwo"></el-input>
                      </span>
                    </div>
                    <div class="buchong-box-single">
                      <span class="buchong-box-single-span1">运维评价周期:</span>

                      <span class="buchong-box-single-span2">
                        <el-input type="text" placeholder="请输入" :autosize="{ minRows: 4, maxRows: 12 }"
                          v-model="result9.pingjiaOne"></el-input>
                      </span>
                    </div>
                  </div>
                  <div style="width: 100%" v-if="stageName === '项目采购'">
                    <SrTable @pageChanged="pageChanged" :data="table2.data" @sizeChanged="sizeChanged"
                      @sortChange="sortChange" :config="table2.tableConfig" :page="table2.page" @selected="selected"
                      :status="selectStatus" ref="selectTable">
                      <template slot="name1" slot-scope="scope">
                        <span v-if="scope.scope.row.scale">{{ scope.scope.row.scale }}%</span>
                      </template>
                      <template slot="name2" slot-scope="scope">
                        <span v-if="scope.scope.row.amount">{{ scope.scope.row.amount }}万元</span>
                      </template>
                      <template slot="name3" slot-scope="scope">
                        <span v-if="scope.scope.row.actualAmount">{{ scope.scope.row.actualAmount }}万元</span>
                      </template>
                    </SrTable>
                    <div v-show="testId2 > 0
                        ? false
                        : stageName == '项目采购'
                          ? false
                          : true
                      " class="addbtns" @click="addFkjd">
                      <i class="el-icon-plus"></i>
                      添加付款节点
                    </div>
                  </div>
                </div>
                <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                  <div class="btns">
                    <div class="back-btn">
                      <el-button type="primary" size="medium" round @click="buchongSubmit" v-if="testjfw">保存</el-button>
                      <el-button plain size="medium" round @click="goback">返回列表</el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- 多标段 -->
          <div v-else>
            <!-- 项目采购模块 多标段 -->
            <div v-if="stageName == '项目采购'">
              <el-tabs v-if="sectionList.length >= 2" v-model="sectionSort" @tab-click="sectionClick(sectionSort)">
                <el-tab-pane v-for="(item, index) in sectionList" :key="index"
                  :label="sectionList.length > 1 ? `标段${item}` : ''" :name="item">
                  <el-tabs v-model="activeCG">
                    <el-tab-pane label="项目交付物" name="first1">
                      <SrTable @pageChanged="pageChanged" :data="table.data" @sizeChanged="sizeChanged"
                        @sortChange="sortChange" :config="table.tableConfig" :page="table.page" @selected="selected"
                        :status="selectStatus" ref="selectTable" @clickRow="clickRow">
                        <template slot="cellSlot"> 上传....</template>
                        <template slot="name" slot-scope="scope">
                          <span v-if="scope.scope.row.isMustUpload == 1" style="color: red">*</span>
                          {{ scope.scope.row.name }}
                        </template>
                      </SrTable>
                      <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                        <div class="btns">
                          <div class="back-btn">
                            <el-button v-if="testjfw" type="primary" size="medium" round @click="submit">保存
                            </el-button>
                            <el-button plain size="medium" round @click="goback">返回列表</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="补充信息" name="second2">
                      <div class="buchong-box">
                        <div style="display: flex; flex-wrap: wrap">
                          <div class="buchong-box-single">
                            <span class="buchong-box-single-span1">中标单位:</span>

                            <span class="buchong-box-single-span2">
                              <el-input :disabled="testId2 > 0 ? true : false" @blur="supInfo(index)" placeholder="请输入"
                                v-model="result3.xiangmucaigouOne"></el-input>
                            </span>
                          </div>
                          <div class="buchong-box-single">
                            <span class="buchong-box-single-span1">合同名称:</span>

                            <span class="buchong-box-single-span2">
                              <el-input :disabled="testId2 > 0 ? true : false" @blur="supInfo(index)" placeholder="请输入"
                                v-model="result3.xiangmucaigouTwo"></el-input>
                            </span>
                          </div>
                          <div class="buchong-box-single">
                            <span class="buchong-box-single-span1">合同金额(万元):</span>

                            <span class="buchong-box-single-span2">
                              <el-input :disabled="testId2 > 0 ? true : false" @input="handleInput5" placeholder="请输入"
                                v-model="result3.xiangmucaigouThree"></el-input>
                            </span>
                          </div>
                          <div class="buchong-box-single">
                            <span class="buchong-box-single-span1">合同开始日期:</span>
                            <span class="buchong-box-single-span2">
                              <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date"
                                v-model="result3.xiangmucaigouFour" placeholder="选择日期">
                              </el-date-picker>
                            </span>
                          </div>
                          <div class="buchong-box-single">
                            <span class="buchong-box-single-span1">合同结束日期:</span>
                            <span class="buchong-box-single-span2">
                              <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date"
                                v-model="result3.xiangmucaigouFive" placeholder="选择日期">
                              </el-date-picker>
                            </span>
                          </div>
                        </div>
                        <div style="width: 100%" v-if="stageName === '项目采购'">
                          <SrTable @pageChanged="pageChanged" :data="table2.data" @sizeChanged="sizeChanged"
                            @sortChange="sortChange" :config="table2.tableConfig" :page="table2.page"
                            @selected="selected" :status="selectStatus" ref="selectTable">
                            <template slot="name1" slot-scope="scope">
                              <span v-if="scope.scope.row.scale">{{ scope.scope.row.scale }}%</span>
                            </template>
                            <template slot="name2" slot-scope="scope">
                              <span v-if="scope.scope.row.amount">{{ scope.scope.row.amount }}万元</span>
                            </template>
                            <template slot="name3" slot-scope="scope">
                              <span v-if="scope.scope.row.actualAmount">{{
                                scope.scope.row.actualAmount + ""
                              }}万元</span>
                            </template>
                            <template slot="name4" slot-scope="scope">
                              <span v-if="scope.scope.row.status">{{
                                scope.scope.row.status == "0"
                                  ? "已支付"
                                  : "未支付"
                              }}</span>
                            </template>
                          </SrTable>
                        </div>
                      </div>
                      <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                        <div class="btns">
                          <div class="back-btn">
                            <el-button type="primary" size="medium" round @click="buchongSubmit"
                              v-if="testjfw">保存</el-button>
                            <el-button plain size="medium" round @click="goback">返回列表</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-tab-pane>
              </el-tabs>

              <el-tabs v-else v-model="activeCG">
                <el-tab-pane label="项目交付物" name="first1">
                  <SrTable @pageChanged="pageChanged" :data="table.data" @sizeChanged="sizeChanged"
                    @sortChange="sortChange" :config="table.tableConfig" :page="table.page" @selected="selected"
                    :status="selectStatus" ref="selectTable" @clickRow="clickRow">
                    <template slot="cellSlot"> 上传....</template>
                    <template slot="name" slot-scope="scope">
                      <span v-if="scope.scope.row.isMustUpload == 1" style="color: red">*</span>
                      {{ scope.scope.row.name }}
                    </template>
                  </SrTable>
                  <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                    <div class="btns">
                      <div class="back-btn">
                        <el-button v-if="testjfw" type="primary" size="medium" round @click="submit">保存
                        </el-button>
                        <el-button plain size="medium" round @click="goback">返回列表</el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="补充信息" name="second2">
                  <div class="buchong-box">
                    <div style="display: flex; flex-wrap: wrap">
                      <div class="buchong-box-single">
                        <span class="buchong-box-single-span1">中标单位:</span>
                        <span class="buchong-box-single-span2">
                          <el-input :disabled="testId2 > 0 ? true : false" @blur="supInfo(index)" placeholder="请输入"
                            v-model="result3.xiangmucaigouOne"></el-input>
                        </span>
                      </div>
                      <div class="buchong-box-single">
                        <span class="buchong-box-single-span1">合同名称:</span>
                        <span class="buchong-box-single-span2">
                          <el-input :disabled="testId2 > 0 ? true : false" @blur="supInfo(index)" placeholder="请输入"
                            v-model="result3.xiangmucaigouTwo"></el-input>
                        </span>
                      </div>
                      <div class="buchong-box-single">
                        <span class="buchong-box-single-span1">合同金额(万元):</span>
                        <span class="buchong-box-single-span2">
                          <el-input :disabled="testId2 > 0 ? true : false" @input="handleInput5" placeholder="请输入"
                            v-model="result3.xiangmucaigouThree"></el-input>
                        </span>
                      </div>
                      <div class="buchong-box-single">
                        <span class="buchong-box-single-span1">合同开始日期:</span>
                        <span class="buchong-box-single-span2">
                          <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date"
                            v-model="result3.xiangmucaigouFour" placeholder="选择日期">
                          </el-date-picker>
                        </span>
                      </div>
                      <div class="buchong-box-single">
                        <span class="buchong-box-single-span1">合同结束日期:</span>
                        <span class="buchong-box-single-span2">
                          <el-date-picker :disabled="testId2 > 0 ? true : false" @change="supInfo(index)"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date"
                            v-model="result3.xiangmucaigouFive" placeholder="选择日期">
                          </el-date-picker>
                        </span>
                      </div>
                    </div>
                    <div style="width: 100%" v-if="stageName === '项目采购'">
                      <SrTable @pageChanged="pageChanged" :data="table2.data" @sizeChanged="sizeChanged"
                        @sortChange="sortChange" :config="table2.tableConfig" :page="table2.page" @selected="selected"
                        :status="selectStatus" ref="selectTable">
                        <template slot="name1" slot-scope="scope">
                          <span v-if="scope.scope.row.scale">{{ scope.scope.row.scale }}%</span>
                        </template>
                        <template slot="name2" slot-scope="scope">
                          <span v-if="scope.scope.row.amount">{{ scope.scope.row.amount }}万元</span>
                        </template>
                        <template slot="name3" slot-scope="scope">
                          <span v-if="scope.scope.row.actualAmount">{{ scope.scope.row.actualAmount + "" }}万元</span>
                        </template>
                        <template slot="name4" slot-scope="scope">
                          <span v-if="scope.scope.row.status">{{
                            scope.scope.row.status == "0" ? "已支付" : "未支付"
                          }}</span>
                        </template>
                      </SrTable>
                    </div>
                  </div>
                  <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                    <div class="btns">
                      <div class="back-btn">
                        <el-button type="primary" size="medium" round @click="buchongSubmit"
                          v-if="testjfw">保存</el-button>
                        <el-button plain size="medium" round @click="goback">返回列表</el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>

            <!-- 项目启动 多标段-->
            <div v-if="stageName == '项目启动'">
              <el-tabs v-model="sectionSort1" v-if="sectionList1.length >= 2" @tab-click="sectionClick1(sectionSort1)">
                <el-tab-pane v-for="(item, index) in sectionList1" :key="index" :label="'标段' + item" :name="item">
                  <!-- {{item}} ---{{ index }} -->
                  <el-tabs v-model="activeQD">
                    <el-tab-pane label="项目交付物" name="first1">
                      <SrTable @pageChanged="pageChanged" :data="table.data" @sizeChanged="sizeChanged"
                        @sortChange="sortChange" :config="table.tableConfig" :page="table.page" @selected="selected"
                        :status="selectStatus" ref="selectTable" @clickRow="clickRow">
                        <template slot="cellSlot"> 上传....</template>
                        <template slot="name" slot-scope="scope">
                          <span v-if="scope.scope.row.isMustUpload == 1" style="color: red">*</span>
                          {{ scope.scope.row.name }}
                        </template>
                      </SrTable>
                      <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                        <div class="btns">
                          <div class="back-btn">
                            <el-button v-if="testjfw" type="primary" size="medium" round @click="submit">保存
                            </el-button>
                            <el-button plain size="medium" round @click="goback">返回列表</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="补充信息" name="second2">
                      <div class="buchong-box-single1">
                        <span class="buchong-box-single-span1_1">开工日期:</span>
                        <span class="buchong-box-single-span2">
                          <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" type="date" v-model="result5.xiangmuqidongOne" placeholder="">
                          </el-date-picker>
                        </span>
                      </div>
                      <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                        <div class="btns">
                          <div class="back-btn">
                            <el-button type="primary" size="medium" round @click="buchongSubmit"
                              v-if="testjfw">保存</el-button>
                            <el-button plain size="medium" round @click="goback">返回列表</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-tab-pane>
              </el-tabs>
              <el-tabs v-else v-model="activeQD">
                <el-tab-pane label="项目交付物" name="first1">
                  <SrTable @pageChanged="pageChanged" :data="table.data" @sizeChanged="sizeChanged"
                    @sortChange="sortChange" :config="table.tableConfig" :page="table.page" @selected="selected"
                    :status="selectStatus" ref="selectTable" @clickRow="clickRow">
                    <template slot="cellSlot"> 上传....</template>
                    <template slot="name" slot-scope="scope">
                      <span v-if="scope.scope.row.isMustUpload == 1" style="color: red">*</span>
                      {{ scope.scope.row.name }}
                    </template>
                  </SrTable>
                  <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                    <div class="btns">
                      <div class="back-btn">
                        <el-button v-if="testjfw" type="primary" size="medium" round @click="submit">保存
                        </el-button>
                        <el-button plain size="medium" round @click="goback">返回列表</el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="补充信息" name="second2">
                  <div class="buchong-box-single1">
                    <span class="buchong-box-single-span1_1">开工日期:</span>
                    <span class="buchong-box-single-span2">
                      <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd" type="date" v-model="result5.xiangmuqidongOne" placeholder="">
                      </el-date-picker>
                    </span>
                  </div>
                  <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                    <div class="btns">
                      <div class="back-btn">
                        <el-button type="primary" size="medium" round @click="buchongSubmit"
                          v-if="testjfw">保存</el-button>
                        <el-button plain size="medium" round @click="goback">返回列表</el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>

            <!-- 项目初验模块 多标段 -->
            <div v-if="stageName == '项目初验'">
              <el-tabs v-model="sectionSort3" v-if="sectionList3.length >= 2" @tab-click="sectionClick2(sectionSort3)">
                <el-tab-pane v-for="(item, index) in sectionList3" :key="index" :label="'标段' + item" :name="item">
                  <el-tabs v-model="activeCY">
                    <el-tab-pane label="项目交付物" name="first1">
                      <SrTable :data="table.data" :config="table.tableConfig" :page="table.page" ref="selectTable"
                        @clickRow="clickRow">
                        <template slot="cellSlot"> 上传....</template>
                        <template slot="name" slot-scope="scope">
                          <span v-if="scope.scope.row.isMustUpload == 1" style="color: red">*</span>
                          {{ scope.scope.row.name }}
                        </template>
                      </SrTable>

                      <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                        <div class="btns">
                          <div class="back-btn">
                            <el-button v-if="testjfw" type="primary" size="medium" round @click="submit">保存
                            </el-button>
                            <el-button plain size="medium" round @click="goback">返回列表</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="补充信息" name="second2">
                      <div class="buchong-box">
                        <div style="display: flex; flex-wrap: wrap">
                          <div class="buchong-box-single">
                            <span class="buchong-box-single-span1_1">初验日期:</span>
                            <span class="buchong-box-single-span2">
                              <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" type="date" v-model="result6.chuyanOne" placeholder="">
                              </el-date-picker>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                        <div class="btns">
                          <div class="back-btn">
                            <el-button type="primary" size="medium" round @click="buchongSubmit"
                              v-if="testjfw">保存</el-button>
                            <el-button plain size="medium" round @click="goback">返回列表</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-tab-pane>
              </el-tabs>
              <el-tabs v-else v-model="activeCY">
                <el-tab-pane label="项目交付物" name="first1">
                  <SrTable :data="table.data" :config="table.tableConfig" :page="table.page" ref="selectTable"
                    @clickRow="clickRow">
                    <template slot="cellSlot"> 上传....</template>
                    <template slot="name" slot-scope="scope">
                      <span v-if="scope.scope.row.isMustUpload == 1" style="color: red">*</span>
                      {{ scope.scope.row.name }}
                    </template>
                  </SrTable>
                  <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                    <div class="btns">
                      <div class="back-btn">
                        <el-button v-if="testjfw" type="primary" size="medium" round @click="submit">保存
                        </el-button>
                        <el-button plain size="medium" round @click="goback">返回列表</el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="补充信息" name="second2">
                  <div class="buchong-box">
                    <div style="display: flex; flex-wrap: wrap">
                      <div class="buchong-box-single">
                        <span class="buchong-box-single-span1_1">初验日期:</span>
                        <span class="buchong-box-single-span2">
                          <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" type="date" v-model="result6.chuyanOne" placeholder="">
                          </el-date-picker>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                    <div class="btns">
                      <div class="back-btn">
                        <el-button type="primary" size="medium" round @click="buchongSubmit"
                          v-if="testjfw">保存</el-button>
                        <el-button plain size="medium" round @click="goback">返回列表</el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>

            <!-- 项目终验模块 多标段 -->
            <div v-if="stageName == '项目终验'">
              <el-tabs v-if="sectionList4.length >= 2" v-model="sectionSort4" @tab-click="sectionClick3(sectionSort4)">
                <el-tab-pane v-for="(item, index) in sectionList4" :key="index" :label="'标段' + item" :name="item">
                  <el-tabs v-model="activeZY">
                    <el-tab-pane label="项目交付物" name="first1">
                      <SrTable @pageChanged="pageChanged3" :data="table.data" @sizeChanged="sizeChanged3"
                        :config="table.tableConfig" :page="table.page" ref="selectTable" @clickRow="clickRow">
                        <template slot="cellSlot"> 上传....</template>

                        <template slot="name" slot-scope="scope">
                          <span v-if="scope.scope.row.isMustUpload == 1" style="color: red">*</span>
                          {{ scope.scope.row.name }}
                        </template>
                      </SrTable>
                      <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                        <div class="btns">
                          <div class="back-btn">
                            <el-button v-if="testjfw" type="primary" size="medium" round @click="submit">保存
                            </el-button>
                            <el-button plain size="medium" round @click="goback">返回列表</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="补充信息" name="second2">
                      <div class="buchong-box">
                        <div style="display: flex; flex-wrap: wrap">
                          <div class="buchong-box-single">
                            <span class="buchong-box-single-span1_1">终验日期:</span>
                            <span class="buchong-box-single-span2">
                              <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" type="date" v-model="result8.zhongyanOne" placeholder="">
                              </el-date-picker>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                        <div class="btns">
                          <div class="back-btn">
                            <el-button type="primary" size="medium" round @click="buchongSubmit"
                              v-if="testjfw">保存</el-button>
                            <el-button plain size="medium" round @click="goback">返回列表</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-tab-pane>
              </el-tabs>
              <el-tabs v-else v-model="activeZY">
                <el-tab-pane label="项目交付物" name="first1">
                  <SrTable @pageChanged="pageChanged3" :data="table.data" @sizeChanged="sizeChanged3"
                    :config="table.tableConfig" :page="table.page" ref="selectTable" @clickRow="clickRow">
                    <template slot="cellSlot"> 上传....</template>
                    <template slot="name" slot-scope="scope">
                      <span v-if="scope.scope.row.isMustUpload == 1" style="color: red">*</span>
                      {{ scope.scope.row.name }}
                    </template>
                  </SrTable>
                  <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                    <div class="btns">
                      <div class="back-btn">
                        <el-button v-if="testjfw" type="primary" size="medium" round @click="submit">保存
                        </el-button>
                        <el-button plain size="medium" round @click="goback">返回列表</el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="补充信息" name="second2">
                  <div class="buchong-box">
                    <div style="display: flex; flex-wrap: wrap">
                      <div class="buchong-box-single">
                        <span class="buchong-box-single-span1_1">终验日期:</span>
                        <span class="buchong-box-single-span2">
                          <el-date-picker :disabled="true" @change="supInfo(index)" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" type="date" v-model="result8.zhongyanOne" placeholder="">
                          </el-date-picker>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="bottom-btns workflow" :style="{ width: `calc(100% - ${widthB})` }">
                    <div class="btns">
                      <div class="back-btn">
                        <el-button type="primary" size="medium" round @click="buchongSubmit"
                          v-if="testjfw">保存</el-button>
                        <el-button plain size="medium" round @click="goback">返回列表</el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>

      <!-- 维护节点弹框 -->
      <div style="z-index: 5000">
        <el-dialog title="维护节点" :visible.sync="centerDialogVisible2" width="650px" center ref="dialogA"
          :close-on-click-modal="false" :modal-append-to-body="false">
          <span>
            <SrTable @pageChanged="pageChanged" :data="table3.data" @sizeChanged="sizeChanged" @sortChange="sortChange"
              :config="table3.tableConfig" :page="table3.page" @selected="selected" :status="selectStatus"
              ref="selectTable" @clickRow="clickRow">
              <template slot="name1" slot-scope="scope">
                {{ formatDate(scope.scope.row.dueEndTime) }}
              </template>
              <template slot="name2" slot-scope="scope">
                {{
                  formatDate(scope.scope.row.actualEndTime) == "1970-01-01"
                    ? ""
                    : formatDate(scope.scope.row.actualEndTime)
                }}
              </template>
            </SrTable>
          </span>
        </el-dialog>
      </div>
      <!-- 编辑弹框 -->
      <el-dialog title="编辑" :visible.sync="centerDialogVisible3" width="650px" left z-index="9999" append-to-body>
        <p>
          节点名称 :
          <el-input v-model="JdName"></el-input>
        </p>

        <p style="margin: 10px 0">
          预计时间 :
          <el-date-picker v-model="value211" type="date" placeholder="预计时间" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </p>

        <p>
          实际时间 :
          <el-date-picker v-model="value222" type="date" placeholder="实际" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </p>

        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="weihu">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 交付物上传弹框组件 -->
      <el-dialog title="上传交付物" :visible.sync="centerDialogVisible" width="650px" center>
        <span>
          <SrAdd :config="form3.config" :form="form3.data" :enums="form3.enums" :otherConfig="form3.otherConfig"
            ref="add" class="add"></SrAdd>
          <span>仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg,
            jpe, png, rar, zip格式文件</span>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveJfw">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 付款信息弹框 -->
      <el-dialog title="付款信息" :visible.sync="centerDialogVisible4" width="800px" left>
        <SrAdd class="sradd" :config="form.config" :enums="form.enums" :form="form.data" :otherConfig="form.otherConfig"
          ref="add2">
          <!-- 付款状态 -->
          <template slot="status">
            <el-select v-model="form.data.status" :disabled="isSee" placeholder="请选择付款状态">
              <el-option v-for="item in form.enums.statusList" :key="item.dataValue" :label="item.dataName"
                :value="item.dataValue">
              </el-option>
            </el-select>
          </template>

          <!-- 实际付款金额 -->
          <template slot="actualAmount">
            <el-input placeholder="请输入实际付款金额" class="mr-10 w80" v-model="form.data.actualAmount"
              @input="amountValid2(form.data.actualAmount)" :disabled="isSee"></el-input>
          </template>
        </SrAdd>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="fksubmit">保存</el-button>
          <el-button @click="centerDialogVisible4 = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 添加付款信息弹框 -->
      <el-dialog title="添加付款节点" :visible.sync="centerDialogVisible5" width="800px" left>
        <SrAdd class="sradd" :config="form11.config" :enums="form11.enums" :form="form11.data"
          :otherConfig="form11.otherConfig" ref="add3">
          <!-- 付款点金额 -->
          <template slot="amount">
            <el-input placeholder="请输入付款金额" class="mr-10 w80" v-model="form11.data.amount"
              @input="amountValid1(form11.data.amount)"></el-input>
            <i slot="suffix">万元</i>
          </template>

          <!-- 实际付款金额 -->
          <template slot="actualAmount">
            <el-input placeholder="请输入实际付款金额" class="mr-10 w80" v-model="form11.data.actualAmount"
              @input="amountValid11(form11.data.actualAmount)"></el-input>
            <i slot="suffix">万元</i>
          </template>
        </SrAdd>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="fkjdsubmit">保存</el-button>
          <el-button @click="centerDialogVisible5 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import basicInfo from "../components/basicInfo.vue"; // 左侧基本信息迁移
import store from "@/store";
import completeFront from "@/assets/images/completeFront.png";
import completeCenter from "@/assets/images/completeCenter.png";
import completeAfter from "@/assets/images/completeAfter.png";
import completeUnFront from "@/assets/images/completeUnFront.png";
import completeUnCenter from "@/assets/images/completeUnCenter.png";
import completeUnAfter from "@/assets/images/completeUnAfter.png";
import incompleteFront from "@/assets/images/incompleteFront.png";
import incompleteCenter from "@/assets/images/incompleteCenter.png";
import incompleteAfter from "@/assets/images/incompleteAfter.png";
import incompleteUnFront from "@/assets/images/incompleteUnFront.png";
import incompleteUnCenter from "@/assets/images/incompleteUnCenter.png";
import incompleteUnAfter from "@/assets/images/incompleteUnAfter.png";
import overdueFront from "@/assets/images/overdueFront.png";
import overdueCenter from "@/assets/images/overdueCenter.png";
import overdueAfter from "@/assets/images/overdueAfter.png";
import overdueUnFront from "@/assets/images/overdueUnFront.png";
import overdueUnCenter from "@/assets/images/overdueUnCenter.png";
import overdueUnAfter from "@/assets/images/overdueUnAfter.png";
import DialogJd from "@/components/DialogJd.vue";
import SrUploadFile from "../components/SrUploadFile.vue";
import ModalComponent from "../components/DialogiVisible.vue";
import ModalTable from "../components/DialogTable.vue";

import {
  api_queryList,
  queryRemove,
  api_fileAway,
  api_getLibraryNumber,
  api_getServiceTypeList,
  addProjectTags,
  getProjectTags,
  getStatusListWithNodeInfo,
  getYearPlanListWithProjectInfo,
  getBuPropertyWithNodeInfo,
  getBuBaseInfoByConditions,
  getPlfpshxz,
  exprotByCondition,
  getBuAndUserInfoByBuPorperty,
  api_fpshr,
  getProjectDetail,
  UpdateProjectDetail,
  getMilestoneNode,
  getQueryDeliveryList,
  getQueryReplenishmentInfoList,
  putAddDelivery,
  updateInfo,
  uploadTemporarily,
  updateDeliveryInfo,
  getIsUpload,
  getDetailById,
  getUserByRoleCode,
  getQueryBizunitsByProperty,
  updateDate,
  getQueryList,
  queryDetailById,
  delById,
  updatePaymentInfo,
  savePaymentInfo,
  getQueryCondition,
  getQueryMilestone,
  getQueryMilestoneSupplemental,
} from "@/api/planProject";
// 上传工具包
import config from "@/settings.js";
import upload from "@/utils/upload";
import { queryBizunitsByProperty } from "@/api/index.js";
import {
  api_userSetQuery,
  api_userSetSave,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
} from "@/api/index.js";
import {
  updateMemberManagement,
  searchDataBysection1,
  searchDataBysection2,
  searchSectionPaymentInfo,
  searchSectionInfo,
} from "@/api/planProject/index.js";
export default {
  components: {
    SrUploadFile,
    DialogJd,
    ModalComponent,
    ModalTable,
    basicInfo,
  },
  data() {
    return {
      isMounted: false,
      pageHeight: window.innerHeight - 180,
      dialogVisible11: false,
      isVisible: true,
      testjfw: false,
      config,
      fanganjl: "FZGHC_JBRBF",
      baseUrl: config.uploadBaseUrl,
      userInfo: store.getters.userInfo,
      deliveryId: "", //交付物id
      centerDialogVisible: false,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false,
      centerDialogVisible5: false,
      centerDialogVisible9: false,

      isEdit: false,
      isEdit2: false,
      isEdit3: false,
      isEdit4: false,
      isEdit5: false,

      pjtilsj: false,

      pjtis: false,
      pjlis: false,
      cmnis: false,
      pmis: false,
      pcmis: false,
      cuis: false,
      cmis: false,
      bfis: false,
      smis: false,
      dialogTitle: "建设详情",
      hhhJd: false,
      completeFront,
      completeCenter,
      completeAfter,
      completeUnFront,
      completeUnCenter,
      completeUnAfter,
      incompleteFront,
      incompleteCenter,
      incompleteAfter,
      incompleteUnFront,
      incompleteUnCenter,
      incompleteUnAfter,
      overdueFront,
      overdueCenter,
      overdueAfter,
      overdueUnFront,
      overdueUnCenter,

      overdueUnAfter,
      activeName2: "first1", // 单标段

      //多标段
      activeCG: "first1", // 项目采购
      activeQD: "first1", //项目启动
      activeCY: "first1", //项目初验
      activeZY: "first1", //项目终验

      spanaActive: 1, //节点高亮

      sectionSort: 1, // 项目采购标段
      sectionSort1: 1, // 项目启动标段
      sectionSort3: 1, // 项目初验标段
      sectionSort4: 1, // 项目终验标段

      sectionList: [], // 项目采购标段数组
      sectionList1: [], // 项目启动标段数组
      sectionList3: [], // 项目初验标段数组
      sectionList4: [], // 项目终验标段数组

      isSection: "", // 项目采购是否为多标段
      isSection3: "", // 项目初验是否为多标段

      pid: "", //点击里程碑拿到当前的项目项目id
      value211: "",
      value222: "",
      // 里程碑节点ist
      spanaActiveList2: [],
      spanaActiveList3: [],
      spanaActiveList4: [],
      beginList: [],
      endList: [],
      // 项目交付物list
      deliveryList: [],

      // 补充信息listdatabtn
      replenishmentInfoList: [],
      // 实施方案确认补充信息的表单
      result: {
        fanganOne: "",
        fanganTwo: "",
        fanganThree: "",
      },
      // 内部立项补充信息的表单
      result2: {
        neibulixiangOne: "",
        neibulixiangTwo: "",
        neibulixiangThree: "",
        neibulixiangFour: "",
      },
      // 项目采购补充信息的表单
      result3: {
        xiangmucaigouThree: "", //中标单位
        xiangmucaigouFour: "", //合同日期
        xiangmucaigouFive: "", //合同金额
        xiangmucaigouSix: "", // 合同开始日期
        xiangmucaigouSeven: "", //合同结束日期
      },
      // 项目交底补充信息的表单
      result4: {
        xiangmujiaodiOne: "",
      },
      // 启动补充信息的表单
      result5: {
        xiangmuqidongOne: "",
        xiangmuqidongTwo: "",
      },
      // 初验补充信息的表单
      result6: {
        chuyanOne: "",
        // chuyanTwo: "",
      },
      // 试运行补充信息的表单
      result7: {
        shiyunxingOne: "", // 开始时间
        shiyunxingTwo: "", // 周期
        shiyunxingThree: "", // 结束日期
      },
      // 终验信息的表单
      result8: {
        zhongyanOne: "",
        zhongyanTwo: "",
      },
      // 运维补充信息的表单
      result9: {
        pingjiaOne: "", // 运维周期 项目结项
        pingjiaTwo: "", // 考核得分
      },
      // 表格数据
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // export: this.exprotByCondition,

            exportPermissionCode: "M015_M003_M003", //导出
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "预览", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "openPicture", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },

            {
              name: "上传",
              method: "setLabel",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "下载",
              method: "onDownload",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "删除",
              method: "deleteRow",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      table2: {
        data: [
          // {
          //   description: "付款点描述",
          //   scale: "30%",
          //   amount: "3000万",
          //   status: "已支付",
          //   actualAmount: "3000万元",
          // },
        ], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            // {
            //   name: "删除", // 按钮名称，优先显示icon
            //   type: "text",
            //   size: "small",
            //   method: "fkdel", // 点击执行该页面methods中对应的方法
            //   icon: "iconbianji", // 按钮显示的图标,不传显示中文
            // },
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "fkedit", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.paymentBtnValidate,
            },
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      table3: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList_AA,
            // export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
            hideHeaderSetting: true,
            // hideHeaderSetting: true,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            // {
            //   name: "删除", // 按钮名称，优先显示icon
            //   type: "text",
            //   size: "small",
            //   method: "see", // 点击执行该页面methods中对应的方法
            //   icon: "iconbianji", // 按钮显示的图标,不传显示中文
            // },
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "edit", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
            // {
            //   name: "子项目",
            //   method: "addChildProject",
            //   type: "text",
            //   size: "small",
            //   icon: "el-icon-document",
            //   validate: this.btnValidate, //自定义判断是否展示按钮权限
            // },
            // {
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      value: "",
      // 基本信息传递的参数demo
      // params: {
      //   id: 6948,
      // },
      testId: 6948,
      testId2: 0,
      // 里程碑节点的值
      liId: 936,
      liIds: 936,
      // 基本信息的字段
      baseMessage: {
        systemName: "系统名称",
        projectName: "项目名称",
        projectCode: "项目编号",
        applicationUnit: "需求单位",
        projectType: "项目类型",
        contactName: "项目负责人",
        clientManagerName: "客户经理",
        programManagerName: "方案经理",
        procurementManagerName: "采购经理",
        contractUnitFullName: "承建单位",
        contractorName: "承建单位负责人",
        controlUnitFullName: "监理单位",
        controlName: "监理单位负责人",
        projectMaturity: "所属阶段",
        needDeliveryTime: "需交付时间",
        projectOverview: "主要建设内容",
        businessNeeds: "业务应用需求",
        // --------------------------
      },
      baseMessage3: {
        specialClassFile: "专班文件",
        needDepartmentPersonName: "需求部门负责人",
        centerDepartment: "中心部门负责人",
        centerPersonName: "中心负责人",
      },
      // 项目详情右边内容

      systemName: "",
      projectName: "",
      projectCode: "",
      projectleader: "",
      ProgramManager: "",
      purchasingManager: "",
      ConstructionUnit: "",
      ConstructionManager: "",
      BelongingField: "",
      SupervisionManager: "",
      applicationUnit: "",
      projectType: "",
      planYear: "",
      contactNameValue: "",
      clientManagerName: "",
      programManagerName: "",
      procurementManagerName: "",
      contractUnitFullName: "",
      contractorName: "",
      controlUnitFullName: "",
      controlName: "",
      baseMessage33: {
        Phase: "",
        RequirementTime: "",
        MainContent: "",
        BusinessRequirements: "",
      },
      // 日期选择器
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() > Date.now()
      //   },
      // },
      inputValue: "",
      form3: {
        otherConfig: {
          labelNum: 120,
        },
        config: [
          {
            type: "upload",
            name: "交付物附件",
            bind: "accessoryList",
            fileList: [],
            fileSize: 500,
            limit: 0,
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        enums: {},
        data: {
          accessoryList: [],
        },
      },
      form4: {},
      form: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "input",
            name: "付款点描述",

            bind: "description",

            col: 24,
            required: "付款节点描述不能为空",
            disabled: true,
          },
          {
            type: "input",
            name: "付款点比例",
            disabled: true,
            bind: "scale",

            col: 12,
            trigger: "blur",
            rules: {
              regular_Number3: "只能输入数字",
            },
            // required: "付款点比例不能为空",
          },
          {
            type: "input",
            name: "付款点金额(万元)",
            disabled: true,
            bind: "amount",
            col: 12,
            trigger: "blur",
            rules: {
              regular_Number3: "只能输入数字",
            },
            // required: "付款点金额不能为空",
          },
          {
            type: "slot",
            slotName: "status",
            name: "付款状态",
            placeholder: "请选择",
            bind: "status",
            dataList: "statusList",
            maxLength: 12,
            disabled: false,
            required: "付款状态不能为空",
            class: "gg",
            col: 12,
          },
          {
            type: "slot",
            slotName: "actualAmount",
            name: "实际付款金额(万元)",
            disabled: false,
            bind: "actualAmount",
            maxLength: 12,
            trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            // required: "实际付款金额不能为空",
            class: "gg",
            col: 12,
          },
        ],
        data: {
          description: "",
          scale: "",
          amount: "",
          status: null,
          actualAmount: "",
          id: "",
          projectId: "",
        },
        enums: {
          statusList: [
            { dataValue: "0", dataName: "已支付" },
            { dataValue: "1", dataName: "未支付" },
          ],
        },
      },
      form11: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "input",
            name: "付款点描述",

            bind: "description",

            col: 24,
            required: "付款节点描述不能为空",
          },
          {
            type: "input",
            name: "付款点比例",

            bind: "scale",
            trigger: "blur",
            rules: {
              regular_Number3: "只能输入数字",
            },
            col: 12,
            // required: "付款点比例不能为空",
          },
          {
            type: "input",
            name: "付款点金额",

            bind: "amount",

            col: 12,
            trigger: "blur",
            rules: {
              regular_Number3: "只能输入数字",
            },
            // required: "付款点金额不能为空",
          },
          {
            type: "select",
            name: "付款状态",
            placeholder: "请选择",
            bind: "status",
            dataList: "statusList",
            maxLength: 12,
            trigger: "change",
            required: "付款状态不能为空",
            class: "gg",
            col: 12,
          },
          {
            type: "slot",
            slotName: "actualAmount",
            name: "实际付款金额",
            bind: "actualAmount",
            maxLength: 12,
            trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            // required: "实际付款金额不能为空",
            class: "gg",
            col: 12,
          },
        ],
        data: {
          description: "",
          scale: "",
          amount: "",
          status: "",
          actualAmount: "",
          id: null,
          projectId: this.testId,
        },
        enums: {
          statusList: [
            { dataValue: "已支付", dataName: "已支付" },
            { dataValue: "未支付", dataName: "未支付" },
          ],
        },
      },
      isSee: false,
      isHaveData: false, //是否有数据
      fanganOne: "",
      // 里程碑节点名称
      stageName: "",
      // 补充信息23字段
      JdName: "",
      // 文本域text
      areatext: "",
      widthB: "",
    };
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      // srtracetrackRequest: srtracetrack,
    };
  },

  computed: {
    testid() {
      // 使用 this.$route.params 获取路由参数
      return this.$route.query.id;
    },

    userInfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  methods: {
    handleResize() {
      this.pageHeight = window.innerHeight - 185;
    },
    // 输入框限制数字
    handleInput(value) {
      // 正则表达式判断正整数
      const pattern = /^[1-9]\d*$/g;
      if (pattern.test(value)) {
        // 双向绑定
        this.result5.xiangmuqidongOne = value;
      } else {
        // 输入值不为正整数，则从中提取出数字并拼接为字符串，赋值给model.time
        const num = value.match(/\d+/g);
        this.result5.xiangmuqidongOne = num ? num.join("") : "";
      }
    },
    handleInput2(value) {
      // 正则表达式判断正整数
      const pattern = /^[1-9]\d*$/g;
      if (pattern.test(value)) {
        // 双向绑定
        this.result9.pingjiaTwo = value;
      } else {
        // 输入值不为正整数，则从中提取出数字并拼接为字符串，赋值给model.time
        const num = value.match(/\d+/g);
        this.result9.pingjiaTwo = num ? num.join("") : "";
      }
    },
    handleInput3(value) {
      // 正则表达式判断正整数
      const pattern = /^[1-9]\d*$/g;
      if (pattern.test(value)) {
        // 双向绑定
        this.result7.shiyunxingTwo = value;
      } else {
        // 输入值不为正整数，则从中提取出数字并拼接为字符串，赋值给model.time
        const num = value.match(/\d+/g);
        this.result7.shiyunxingTwo = num ? num.join("") : "";
      }
    },
    handleInput4(value) {
      // 正则表达式判断正整数
      const pattern = /^[1-9]\d*$/g;
      if (pattern.test(value)) {
        // 双向绑定
        this.result7.shiyunxingTwo = value;
      } else {
        // 输入值不为正整数，则从中提取出数字并拼接为字符串，赋值给model.time
        const num = value.match(/\d+/g);
        this.result7.shiyunxingTwo = num ? num.join("") : "";
      }
    },
    handleInput5(value) {
      // 正则表达式判断正整数
      const pattern = /^[1-9]\d*$/g;
      if (pattern.test(value)) {
        // 双向绑定
        this.result3.xiangmucaigouThree = value;
      } else {
        // 输入值不为正整数，则从中提取出数字并拼接为字符串，赋值给model.time
        const num = value.match(/\d+/g);
        this.result3.xiangmucaigouThree = num ? num.join("") : "";
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份从0开始，所以要加1
      const day = ("0" + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    // 维护节点逻辑
    showDialogJd(val) {
      this.centerDialogVisible2 = !this.centerDialogVisible2;
      // this.title = val
    },
    ceshiJD(val) {
      this.centerDialogVisible9 = !this.centerDialogVisible9;
      // this.title = val
    },
    openModal() {
      this.isVisible = true;
    },
    closeModal() {
      this.isVisible = false;
    },

    edit(row) {
      this.value222 =
        this.formatDate(row.actualEndTime) === "1970-01-01"
          ? ""
          : this.formatDate(row.actualEndTime);
      this.value211 = this.formatDate(row.dueEndTime);
      // 当前节点名称

      this.JdName = row.stageName;
      this.liIds = row.stageId;
      this.centerDialogVisible3 = !this.centerDialogVisible3;
    },
    // 付款信息编辑
    fkedit(row) {
      this.isSee = false;
      this.centerDialogVisible4 = true;
      if (row.id) {
        queryDetailById({ id: row.id }).then((res) => {
          this.form.data = res.data;
        });
      } else {
        this.form.data = row;
      }
    },
    // 付款信息删除
    fkdel(row) {
      let find = (ele) => ele == row;
      const index = this.table2.data.findIndex(find);
      if (row.id) {
        this.$confirm("是否删除该条数据", "提示", {
          iconClass: "el-icon-question", //自定义图标样式
          confirmButtonText: "确认", //确认按钮文字更换
          cancelButtonText: "取消", //取消按钮文字更换
          showClose: true, //是否显示右上角关闭按钮
          type: "warning", //提示类型  success/info/warning/error
        })
          .then(() => {
            delById({ id: row.id }).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("删除成功");
                this.getTbDataA();
              }
            });
            //确认操作
          })
          .catch(() => {
            //取消操作
          });

        // this.$message.success("删除成功")
      } else {
        this.table2.data.splice(index, 1);
        this.$message.success("删除成功");
      }
    },
    // 付款信息保存
    fksubmit() {
      if (this.form.data.id) {
        updatePaymentInfo({
          id: this.form.data.id,
          actualAmount: this.form.data.actualAmount,
          status: this.form.data.status,
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("保存成功");
            this.stageName = "项目采购";
            this.getPaymentTableData();
            this.centerDialogVisible4 = false;
          }
        });
      } else {
        this.$message.warning("请先保存再编辑");
      }
    },
    // 付款节点添加
    fkjdsubmit() {
      let data = this.$refs["add3"].validate();
      if (data.status) {
        this.form11.data.projectId = this.testId;
        this.table2.data.push(this.form11.data);
        // this.form11.data = {};
        this.centerDialogVisible5 = false;
      }
    },

    // 项目采购 根据标段查询交付物和补充信息
    sectionClick(tab, event) {
      // this.sectionSort = Number(tab.index) + 1;
      this.sectionSort = Number(tab);
      // 交付物
      searchDataBysection1({
        isSection: this.isSection,
        milestoneId: this.spanaActive || "", // 里程碑id
        projectId: this.pid || "", // 项目id
        sectionSort: this.sectionSort, //标段序号
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data && res.data?.length > 0) {
            this.table.data = res.data;
          } else {
            this.table.data = [];
            this.getTbData();
          }
        } else {
          this.$message.error(res.msg.message);
        }
      });
      searchDataBysection2({
        isSection: this.isSection,
        milestoneId: this.spanaActive, // 里程碑id
        projectId: this.pid, // 项目id
        sectionSort: this.sectionSort, //标段序号
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data[0] && res.data?.length > 0) {
            this.result3.xiangmucaigouOne = res.data[0].xiangmucaigouOne;
            this.result3.xiangmucaigouTwo = res.data[1].xiangmucaigouTwo;
            this.result3.xiangmucaigouThree = res.data[2].xiangmucaigouThree;
            this.result3.xiangmucaigouFour = res.data[3].xiangmucaigouFour;
            this.result3.xiangmucaigouFive = res.data[4].xiangmucaigouFive;
          } else {
            this.result3.xiangmucaigouOne = "";
            this.result3.xiangmucaigouTwo = "";
            this.result3.xiangmucaigouThree = "";
            this.result3.xiangmucaigouFour = "";
            this.result3.xiangmucaigouFive = "";
          }
        } else {
          this.$message.error(res.msg.message);
        }
      });
      this.getPaymentTableData();
    },

    // 项目启动 根据标段查询交付物和补充信息
    sectionClick1(tab, event) {
      console.log(tab, event, '当前点击的')
      this.sectionSort1 = Number(tab)
      console.log(this.sectionSort1, '1111-----')
      getQueryMilestone({
        milestoneId: this.spanaActive, // 里程碑id
        projectId: this.pid || "", // 项目id
        sectionSort: this.sectionSort1, //标段序号
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data && res.data.length > 0) {
            this.table.data = res.data;
          } else {
            this.table.data = [];
            this.getTbData();
          }
        } else {
          this.$message.error(res.msg.message);
        }
      });
      getQueryMilestoneSupplemental({
        milestoneId: this.spanaActive || "", // 里程碑id
        projectId: this.pid || "", // 项目id
        sectionSort: this.sectionSort1, //标段序号
      }).then((res) => {
        if (res.data.length > 0) {
          this.result5.xiangmuqidongOne = res.data[0].xiangmuqidongOne;
        } else {
          this.result5.xiangmuqidongOne = "";
        }
      });
    },

    // 项目初验 多标段交付物补充信息查询
    sectionClick2(tab, event) {
      // this.sectionSort3 = Number(tab.index) + 1;

      this.sectionSort3 = Number(tab)
      // 交付物
      getQueryMilestone({
        milestoneId: this.spanaActive || "", // 里程碑id
        projectId: this.pid || "", // 项目id
        sectionSort: this.sectionSort3, //标段序号
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data && res.data.length > 0) {
            this.table.data = res.data;
          } else {
            this.table.data = [];
            this.getTbData();
          }
        } else {
          this.$message.error(res.msg.message);
        }
      });

      // 补充信息
      getQueryMilestoneSupplemental({
        milestoneId: this.spanaActive || "", // 里程碑id
        projectId: this.pid || "", // 项目id
        sectionSort: this.sectionSort3, //标段序号
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data.length > 0) {
            this.result6.chuyanOne = res.data[0].xiangmucaigouOne;
          } else {
            this.result6.chuyanOne = "";
          }
        } else {
          this.$message.error(res.msg.message);
        }
      });
    },

    // 项目终验 多标段交付物补充信息查询
    sectionClick3(tab, event) {
      // this.sectionSort4 = Number(tab.index) + 1;
      this.sectionSort4 = Number(tab);
      // 交付物
      getQueryMilestone({
        milestoneId: this.spanaActive || "", // 里程碑id
        projectId: this.pid || "", // 项目id
        sectionSort: this.sectionSort4, //标段序号
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.msg.code == "0000") {
            if (res.data && res.data.length > 0) {
              this.table.data = res.data;
            } else {
              this.table.data = [];
              this.getTbData();
            }
          } else {
            this.$message.error(res.msg.message);
          }
        }
      });

      // 补充信息
      getQueryMilestoneSupplemental({
        milestoneId: this.spanaActive || "", // 里程碑id
        projectId: this.pid || "", // 项目id
        sectionSort: this.sectionSort4, //标段序号
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data.length > 0) {
            this.result8.zhongyanOne =
              res.data.length >= 1 ? res.data[0].zhongyanOne : "";
          } else {
            this.result8.zhongyanOne = "";
          }
        } else {
          this.$message.error(res.msg.message);
        }
      });
    },

    // 查询补充信息
    getPaymentTableData() {
      searchSectionPaymentInfo({
        isSection: this.isSection,
        milestoneId: this.spanaActive, // 里程碑id
        projectId: this.pid, // 项目id
        sectionSort: this.sectionSort, //标段序号
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data && res.data?.length > 0) {
            this.table2.data = res.data;
          } else {
            this.table2.data = [];
          }
        } else {
          this.$message.error(res.msg.message);
        }
      });
    },

    // 切换里程碑事件
    changeSpanaActive(id, name, pid) {
      this.spanaActive = id; // 里程碑id
      this.pid = pid; // 项目id
      this.liId = id;
      this.stageName = name;
      if (this.stageName == "项目采购") {
        this.CG_searchSection(); // 根据里程碑查询标段信息
        this.$forceUpdate();
      } else if (this.stageName == "项目启动") {
        this.QD_searchSection(); // 根据里程碑查询标段信息
        this.activeQD = "first1";
        this.$forceUpdate();
      } else if (this.stageName == "项目初验") {
        this.activeCY = "first1";
        this.CY_searchSection(); // 根据里程碑查询标段信息
        this.$forceUpdate();
      } else if (this.stageName == "项目终验") {
        this.ZY_searchSection(); // 根据里程碑查询标段信息
        this.activeZY = "first1";
        this.$forceUpdate();
      } else {
        this.getTbData();
        this.getQueryReplenishmentInfoListA(this.stageName);
      }

      this.addJFWRule();
    },

    QD_searchSection() {
      getQueryCondition({
        sort: 5,
        projectId: this.pid,
      }).then((res) => {
        // 要判断是否是多标段  标段数组
        if (
          res.data.milestoneId != null ||
          res.data.projectId != null ||
          res.data.sectionSorts != null
        ) {

          console.log(res.data.sectionSorts, 'res.data.sectionSorts')
          let arr = res.data.sectionSorts.sort((a, b) => {
            return a - b;
          });


          console.log(arr, '111--------------')
          this.sectionList1 = arr;
          this.sectionSort1 =
            res.data.sectionSorts !== null ? res.data.sectionSorts[0] : 1;
        } else {
          this.sectionList1 = [];
          this.sectionSort1 = 1;
        }
        // 根据交付物项目id获取交付物
        getQueryMilestone({
          milestoneId: res.data.milestoneId || this.spanaActive, // 里程碑id
          projectId: res.data.projectId || this.pid, // 项目id
          sectionSort: this.sectionSort1, //标段序号
        }).then((res) => {
          if (res.msg.code == "0000") {
            if (res.data && res.data.length > 0) {
              this.table.data = res.data;
            } else {
              this.table.data = [];
              this.getTbData();
            }

            this.activeQD = "first1";
          } else {
            this.$message.error(res.msg.message);
          }
        });
        getQueryMilestoneSupplemental({
          milestoneId: res.data.milestoneId || "", // 里程碑id
          projectId: res.data.projectId || "", // 项目id
          sectionSort: this.sectionSort1, //标段序号
        }).then((res) => {
          if (res.data) {
            this.result5.xiangmuqidongOne = res.data[0]?.xiangmuqidongOne;
          } else {
            this.result5.xiangmuqidongOne = "";
          }
        });
      });
    },

    // 根据里程碑查询标段
    CG_searchSection() {
      searchSectionInfo({
        isSection: this.isSection,
        milestoneId: this.spanaActive, // 里程碑id
        projectId: this.pid, // 项目id
        sectionSort: this.sectionSort, //标段序号
        sectionSorts: this.sectionList,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.isSection = res.data.isSection;
          this.sectionList =
            res.data.sectionSorts == null ? [] : res.data.sectionSorts;
          this.sectionSort =
            res.data.sectionSorts == null ? 1 : res.data.sectionSorts[0];

          // 交付物
          searchDataBysection1({
            isSection: this.isSection,
            milestoneId: res.data.milestoneId || "", // 里程碑id
            projectId: res.data.projectId || "", // 项目id
            sectionSort: this.sectionSort, //标段序号
          }).then((res) => {
            if (res.msg.code == "0000") {
              if (res.data && res.data.length > 0) {
                this.table.data = res.data;
              } else {
                this.table.data = [];
                this.getTbData();
              }
              this.activeCG = "first1";
            } else {
              this.$message.error(res.msg.message);
            }
          });
          //补充信息
          searchDataBysection2({
            isSection: this.isSection,
            milestoneId: res.data.milestoneId || "", // 里程碑id
            projectId: res.data.projectId || "", // 项目id
            sectionSort: this.sectionSort, //标段序号
          }).then((res) => {
            if (res.msg.code == "0000") {
              if (res.data.length > 0) {
                this.result3.xiangmucaigouOne = res.data[0].xiangmucaigouOne;
                this.result3.xiangmucaigouTwo = res.data[1].xiangmucaigouTwo;
                this.result3.xiangmucaigouThree =
                  res.data[2].xiangmucaigouThree;
                this.result3.xiangmucaigouFour = res.data[3].xiangmucaigouFour;
                this.result3.xiangmucaigouFive = res.data[4].xiangmucaigouFive;
              } else {
                this.result3.xiangmucaigouOne = "";
                this.result3.xiangmucaigouTwo = "";
                this.result3.xiangmucaigouThree = "";
                this.result3.xiangmucaigouFour = "";
                this.result3.xiangmucaigouFive = "";
              }
            } else {
              this.$message.error(res.msg.message);
            }
          });
          searchSectionPaymentInfo({
            isSection: this.isSection,
            milestoneId: res.data.milestoneId || "", // 里程碑id
            projectId: res.data.projectId || "", // 项目id
            sectionSort: this.sectionSort, //标段序号
          }).then((res) => {
            if (res.msg.code == "0000") {
              if (res.data.length > 0) {
                this.table2.data = res.data;
              } else {
                this.table2.data = [];
              }
            } else {
              this.$message.error(res.msg.message);
            }
          });
        }
      });
    },

    // 项目初验-根据里程碑查询标段
    CY_searchSection() {
      getQueryCondition({
        projectId: this.pid, //项目id
        sort: 7,
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (
            res.data.milestoneId != null ||
            res.data.projectId != null ||
            res.data.sectionSorts != null
          ) {
            let arr = res.data.sectionSorts.sort((a, b) => {
              return a - b;
            });
            this.sectionList3 =
              res.data.sectionSorts == null || res.data.sectionSorts == []
                ? []
                : Array.from(new Set(arr));
            this.sectionSort3 = res.data.sectionSorts
              ? res.data.sectionSorts[0]
              : 1;
          }
          // 交付物
          getQueryMilestone({
            milestoneId: res.data.milestoneId || this.spanaActive, // 里程碑id
            projectId: res.data.projectId || this.pid, // 项目id
            sectionSort: this.sectionSort3, //标段序号
          }).then((res) => {
            if (res.msg.code == "0000") {
              if (res.data && res.data.length > 0) {
                this.table.data = res.data;
              } else {
                this.table.data = [];
                this.getTbData();
              }

              this.activeCY = "first1";
            } else {
              this.$message.error(res.msg.message);
            }
          });

          // 补充信息
          getQueryMilestoneSupplemental({
            milestoneId: res.data.milestoneId || "", // 里程碑id
            projectId: res.data.projectId || "", // 项目id
            sectionSort: this.sectionSort3, //标段序号
          }).then((res) => {
            if (res.msg.code == "0000") {
              if (res.data && res.data.length > 0) {
                this.result6.chuyanOne = res.data[0].chuyanOne;
              } else {
                this.result6.chuyanOne = "";
              }
            } else {
              this.$message.error(res.msg.message);
            }
          });
        }
      });
    },
    // 项目终验-根据里程碑查询标段
    ZY_searchSection() {
      getQueryCondition({
        projectId: this.pid, //项目id
        sort: 8,
      }).then((res) => {
        if (res.msg.code == "0000") {
          if (
            res.data.milestoneId != null ||
            res.data.projectId != null ||
            res.data.sectionSorts != null
          ) {
            let arr = res.data.sectionSorts.sort((a, b) => {
              return a - b;
            });
            this.sectionList4 =
              res.data.sectionSorts == null || res.data.sectionSorts == []
                ? []
                : Array.from(new Set(arr));
            this.sectionSort4 = res.data.sectionSorts
              ? res.data.sectionSorts[0]
              : 1;
          }
          // 交付物
          getQueryMilestone({
            milestoneId: res.data.milestoneId || this.spanaActive, // 里程碑id
            projectId: res.data.projectId || this.pid, // 项目id
            sectionSort: this.sectionSort4, //标段序号
          }).then((res) => {
            if (res.msg.code == "0000") {
              if (res.data && res.data.length > 0) {
                this.table.data = res.data;
              } else {
                this.getTbData();
              }
              this.activeZY = "first1";
            } else {
              this.$message.error(res.msg.message);
            }
          });

          // 补充信息
          getQueryMilestoneSupplemental({
            milestoneId: res.data.milestoneId || "", // 里程碑id
            projectId: res.data.projectId || "", // 项目id
            sectionSort: this.sectionSort4, //标段序号
          }).then((res) => {
            if (res.msg.code == "0000") {
              if (res.data.length > 0) {
                this.result8.zhongyanOne = res.data[0].zhongyanOne;
              } else {
                this.result8.zhongyanOne = "";
              }
            } else {
              this.$message.error(res.msg.message);
            }
          });
        }
      });
    },
    // 交付物表格
    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        node: this.spanaActive, //节点
        isSubproject: 0,
        // ...this.search.formData,
      };
      if (param.orderByColumn == "") {
        delete param.orderByColumn;
      }
      if (param.orderBy == "") {
        delete param.orderBy;
      }
      getQueryDeliveryList({
        projectId: this.testId,
        milestoneId: this.liId,
      }).then((res) => {
        if (res.msg.code === "0000") {
          if (res.data.length > 0) {
            this.table.data = res.data;
          } else {
            // this.isHaveData = false;
            this.table.data = [];
          }

          this.$forceUpdate();
        }
      });
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M005_003" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "beginDate") {
            // item.sortable = 'custom'
            // 上下翻转箭头
            item.width = "110px";
          }
          if (item.prop == "totalInvestmentAmount") {
            // item.sortable = 'custom'
            item.width = "160px";
          }
          return item.isShow;
        });
      });
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_003",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    // M005_011
    // saveHeaderList_AA
    saveHeaderList_AA(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_011",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
          this.getTbHeaderAA();
        }
      });
    },
    // 付款信息表格
    getTbDataA() {
      let param = {
        pageNum: this.table2.page.pageNum,
        pageSize: this.table2.page.pageSize,
        node: this.spanaActive, //节点
        isSubproject: 0,
        // ...this.search.formData,
      };
      if (param.orderByColumn == "") {
        delete param.orderByColumn;
      }
      if (param.orderBy == "") {
        delete param.orderBy;
      }
      getQueryList({
        projectId: this.testId,
      }).then((res) => {
        this.table2.data = res.data;
      });
    },
    getTbHeaderA() {
      api_userSetQuery({ permissionCode: "M005_005" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table2.tableConfig.operateConfig.allTableHeader = headerData;
        this.table2.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "beginDate") {
            // item.sortable = 'custom'
            // 上下翻转箭头
            item.width = "110px";
          }
          if (item.prop == "totalInvestmentAmount") {
            // item.sortable = 'custom'
            item.width = "160px";
          }
          return item.isShow;
        });
      });
    },
    saveHeaderListA(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_005",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbDataA();
          this.getTbHeaderA();
        }
      });
    },
    // 维护节点盒子
    getTbDataAA() {
      let param = {
        pageNum: this.table3.page.pageNum,
        pageSize: this.table3.page.pageSize,
        node: this.spanaActive, //节点
        isSubproject: 0,
        // ...this.search.formData,
      };
      if (param.orderByColumn == "") {
        delete param.orderByColumn;
      }
      if (param.orderBy == "") {
        delete param.orderBy;
      }
    },
    getTbHeaderAA() {
      api_userSetQuery({ permissionCode: "M005_011" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table3.tableConfig.operateConfig.allTableHeader = headerData;
        this.table3.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "beginDate") {
            // item.sortable = 'custom'
            // 上下翻转箭头
            item.width = "110px";
          }
          if (item.prop == "totalInvestmentAmount") {
            // item.sortable = 'custom'
            item.width = "160px";
          }
          return item.isShow;
        });
      });
    },
    saveHeaderListA(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_005",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbDataA();
          this.getTbHeaderA();
        }
      });
    },
    paymentBtnValidate(row) {
      if (
        this.userInfo.currentRole.roleCode == "FZGHC_JBRBF" ||
        this.userInfo.currentRole.roleCode == "XMFZR"
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 付款点金额输入限制
    amountValid1(value) {
      var reg = /^(\d{1,8}(\.\d{0,2})?)?$/;
      if (reg.test(value) == false) {
        this.form11.data.amount = "";
      } else {
        this.form11.data.amount = value;
      }
    },

    // 付款点金额输入限制
    amountValid2(value) {
      var reg = /^(\d{1,8}(\.\d{0,6})?)?$/;
      if (reg.test(value) == false) {
        this.form.data.actualAmount = "";
      } else {
        // 实际付款点金额 不能大于 付款点金额
        if (value > this.form.data.amount) {
          this.$message.warning("实际付款金额不能大于付款点金额");
          return false;
        }
        this.form.data.actualAmount = value;
      }
    },
    // 付款点金额输入限制
    amountValid11(value) {
      var reg = /^(\d{1,8}(\.\d{0,6})?)?$/;
      if (reg.test(value) == false) {
        this.form11.data.actualAmount = "";
      } else {
        // 实际付款点金额 不能大于 付款点金额
        if (value > this.form11.data.amount) {
          this.$message.warning("实际付款金额不能大于付款点金额");
          return false;
        }
        this.form11.data.actualAmount = value;
      }
    },

    btnValidate(row, item) {
      /* if (row.name == "上传" && this.testId2 < 0) {
        if(){}
        return true;
      } else */
      // 管理员
      if (
        this.testId2 < 0 &&
        row.name == "上传" &&
        item.id &&
        this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
      ) {
        if (this.stageName === "项目交底") {
          return false;
        }
        return true;
      }
      // 项目负责人
      if (
        this.testId2 < 0 &&
        row.name == "上传" &&
        item.id &&
        this.userInfo.currentRole.roleCode == "XMFZR" &&
        (this.stageName == "项目规划" || this.stageName == "运维")
      ) {
        return true;
      }
      if (
        this.testId2 < 0 &&
        row.name == "上传" &&
        item.id &&
        this.userInfo.currentRole.roleCode == "XMFZR" &&
        (this.stageName == "项目规划" || this.stageName == "项目结项")
      ) {
        return true;
      }
      // 方案经理
      if (
        this.testId2 < 0 &&
        row.name == "上传" &&
        item.id &&
        this.userInfo.currentRole.roleCode == "FAJL" &&
        (this.stageName == "实施方案确认" || this.stageName == "内部立项")
      ) {
        return true;
      }
      // 采购经理
      if (
        this.testId2 < 0 &&
        row.name == "上传" &&
        item.id &&
        this.userInfo.currentRole.roleCode == "CGJL" &&
        this.stageName == "项目采购"
      ) {
        return true;
      }
      // 客户经理
      if (
        this.testId2 < 0 &&
        row.name == "上传" &&
        item.id &&
        this.userInfo.currentRole.roleCode == "KHJL" &&
        (this.stageName == "集团审议" || this.stageName == "项目交底")
      ) {
        return true;
      }
      // 监理工程师
      if (
        this.testId2 < 0 &&
        row.name == "上传" &&
        item.id &&
        this.userInfo.currentRole.roleCode == "JLGCS" &&
        ["项目启动", "项目初验", "试运行", "项目终验"].includes(this.stageName)
      ) {
        return true;
      }
      if (row.name == "预览" && item.fileName) {
        return true;
      }
      if (row.name == "下载" && item.fileName) {
        return true;
      }
      if (
        row.name == "删除" &&
        item.name == "其他交付物" &&
        item.isMustUpload == 0
      ) {
        return true;
      }
      return false;
    },
    // 获取项目详情基本信息方法
    getProjectDetailA() {
      // let params = {
      //   id: 6948,
      // }

      getProjectDetail({ id: this.testId }).then((res) => {
        this.value11 = res.data.systemName;
        this.value10 = res.data.projectName;
        this.value9 = res.data.projectCode;
        this.value8 = res.data.applicationUnit;
        this.value7 = res.data.planYear; //年度计划
        this.value6 = res.data.projectTypeCode; // 项目类型
        // 流程信息
        var newObj = {};
        for (var key in this.processData) {
          newObj[key] = res.data[key];
        }
        this.processData = newObj;
        this.contactNameValue = res.data.contactName;
        this.clientManagerName = res.data.clientManagerName;
        this.programManagerName = res.data.programManagerName;
        this.purchasingManager = res.data.procurementManagerName;
        this.ConstructionUnit = res.data.contractUnitFullName;
        this.ConstructionManager = res.data.contractorName;
        this.BelongingField = res.data.controlUnitFullName;
        this.SupervisionManager = res.data.controlName;

        this.value1 = res.data.projectMaturity;
        this.value2 = res.data.needDeliveryTime;
        this.value3 = res.data.needDepartmentPersonName;
        this.value4 = res.data.centerPersonName;
        this.value5 = res.data.centerDepartmentName;
      });
    },
    api_getServiceTypeListA() {
      api_getServiceTypeList({ topic: "projectType" }).then((res) => {
        res.data.map((item) => {
          if (item.itemCode == this.projectType) {
            this.projectType = item.chName;
          }
        });
      });
    }, // 获取里程碑节点信息
    getMilestoneNodeA() {
      getMilestoneNode({ projectId: this.testId }).then((res) => {
        this.table3.data = res.data;
        // res.data = res.data.filter(item => item.stageName != "实施方案确认");
        console.log(res.data, "res.data.filter(item => item.stageName");
        this.liId = res.data[0].stageId;
        //里程碑节点名称
        this.stageName = res.data[0].stageName;

        this.beginList.push(res.data[0]);

        this.spanaActive = this.beginList[0].stageId;
        this.endList.push(res.data[res.data.length - 1]);
        this.spanaActiveList2 = res.data.slice(1, -1);
        this.getTbData();
        this.getQueryReplenishmentInfoListA(this.stageName);
      });
    },
    // 补充信息列表
    getQueryReplenishmentInfoListA(step) {
      getQueryReplenishmentInfoList({
        projectId: this.testId,
        milestoneId: this.liId,
      }).then((res) => {
        if (res.data && res.msg.code === "0000") {
          this.replenishmentInfoList = res.data;
          switch (step) {
            case "实施方案确认":
              this.result.fanganOne = res.data[0].fanganOne;
              this.result.fanganTwo = res.data[1].fanganTwo;
              this.result.fanganThree = res.data[2].fanganThree;

              break;
            case "内部立项":
              this.result2.neibulixiangOne = res.data[0].neibulixiangOne;
              this.result2.neibulixiangTwo = res.data[1].neibulixiangTwo;
              this.result2.neibulixiangThree = res.data[2].neibulixiangThree;

              this.result2.neibulixiangFour = res.data[3].neibulixiangFour;
              break;
            case "项目采购":
              // this.result3.xiangmucaigouThree =
              //   res.data[0].xiangmucaigouThree;
              // this.result3.xiangmucaigouFour = res.data[1].xiangmucaigouFour;
              // this.result3.xiangmucaigouFive = res.data[2].xiangmucaigouFive;
              // this.result3.xiangmucaigouSix = res.data[3].xiangmucaigouSix;
              // this.result3.xiangmucaigouSeven =
              //   res.data[4].xiangmucaigouSeven;

              break;
            case "项目交底":
              this.result4.xiangmujiaodiOne = res.data[0].xiangmujiaodiOne;
              break;
            case "项目启动":
              this.result5.xiangmuqidongOne = res.data[0].xiangmuqidongOne;
              this.result5.xiangmuqidongTwo = res.data[1].xiangmuqidongTwo;
              break;
            case "项目初验":
              this.result6.chuyanOne = res.data[0] ? res.data[0].chuyanOne : "";
              break;
            case "试运行":
              this.result7.shiyunxingOne = res.data[0].shiyunxingOne;
              this.result7.shiyunxingTwo = res.data[1].shiyunxingTwo;
              this.result7.shiyunxingThree = res.data[2].shiyunxingThree;
              break;
            case "项目终验":
              this.result8.zhongyanOne = res.data[0]
                ? res.data[0].zhongyanOne
                : "";
              break;
            case "运维":
              this.result9.pingjiaOne = res.data[0].pingjiaOne;
              this.result9.pingjiaTwo = res.data[1].pingjiaTwo;
              break;
            case "项目结项":
              this.result9.pingjiaOne = res.data[0].pingjiaOne;
              this.result9.pingjiaTwo = res.data[1].pingjiaTwo;
              break;
          }
        }
      });
    },
    // 交付物保存
    submit() {
      const tables = this.table.data.map((item) => {
        const { btns, ...rest } = item;
        return rest;
      });
      const isUpload = tables.filter(
        (item) => item.isMustUpload === 1 && item.fileName === null
      );

      if (isUpload.length > 0) {
        const arr = [];
        isUpload.forEach((item) => {
          arr.push(item.name);
        });
        this.$message({
          message: `【${arr.join(",")}】不能为空，请上传文件`,
          type: "warning",
        });
      } else {
        this.$confirm("是否保存", "提示", {
          iconClass: "el-icon-question", //自定义图标样式
          confirmButtonText: "确认", //确认按钮文字更换
          cancelButtonText: "取消", //取消按钮文字更换
          showClose: true, //是否显示右上角关闭按钮
          type: "warning", //提示类型  success/info/warning/error
        })
          .then(() => {
            //确认操作
            updateDeliveryInfo({ deliverys: tables }).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("保存成功");
                // this.$router.push({
                //   name: 'planProject',
                //   // query: {
                //   //   id: row.id,
                //   //   processId: row.processId,
                //   //   templateId: row.templateId,
                //   //   spanaActive: this.spanaActive,
                //   // },
                //   // 查看相关逻辑
                // })
                this.getTbData();

                this.getQueryReplenishmentInfoListA(this.stageName);
                // location.reload();
              }
            });
          })
          .catch(() => {
            //取消操作
          });
      }
    },
    // 补充信息提交
    buchongSubmit() {
      this.$confirm("是否保存", "提示", {
        iconClass: "el-icon-question", //自定义图标样式
        confirmButtonText: "确认", //确认按钮文字更换
        cancelButtonText: "取消", //取消按钮文字更换
        showClose: true, //是否显示右上角关闭按钮
        type: "warning", //提示类型  success/info/warning/error
      })
        .then(() => {
          //确认操作
          switch (this.stageName) {
            case "实施方案确认":
              this.replenishmentInfoList[0].fanganOne = this.result.fanganOne;
              this.replenishmentInfoList[1].fanganTwo = this.result.fanganTwo;
              this.replenishmentInfoList[2].fanganThree =
                this.result.fanganThree;
              break;
            case "内部立项":
              this.replenishmentInfoList[0].neibulixiangOne =
                this.result2.neibulixiangOne;
              this.replenishmentInfoList[1].neibulixiangTwo =
                this.result2.neibulixiangTwo;
              this.replenishmentInfoList[2].neibulixiangThree =
                this.result2.neibulixiangThree;
              break;
            case "项目采购":
              this.replenishmentInfoList[0].xiangmucaigouThree =
                this.result3.xiangmucaigouThree;
              this.replenishmentInfoList[1].xiangmucaigouFour =
                this.result3.xiangmucaigouFour;
              this.replenishmentInfoList[2].xiangmucaigouFive =
                this.result3.xiangmucaigouFive;
              this.replenishmentInfoList[3].xiangmucaigouSix =
                this.result3.xiangmucaigouSix;
              this.replenishmentInfoList[4].xiangmucaigouSeven =
                this.result3.xiangmucaigouSeven;
              break;
            case "项目交底":
              this.replenishmentInfoList[0].xiangmujiaodiOne =
                this.result4.xiangmujiaodiOne;
              break;
            case "项目启动":
              this.replenishmentInfoList[0].xiangmuqidongOne =
                this.result5.xiangmuqidongOne;
              this.replenishmentInfoList[1].xiangmuqidongTwo =
                this.result5.xiangmuqidongTwo;
              break;
            case "项目初验":
              this.replenishmentInfoList[0].chuyanOne = this.result6.chuyanOne;
              // this.replenishmentInfoList[1].chuyanTwo = this.result6.chuyanTwo;
              break;
            case "试运行":
              this.replenishmentInfoList[0].shiyunxingOne =
                this.result7.shiyunxingOne;
              this.replenishmentInfoList[1].shiyunxingTwo =
                this.result7.shiyunxingTwo;
              this.replenishmentInfoList[2].shiyunxingThree =
                this.result7.shiyunxingThree;
              break;
            case "项目终验":
              this.replenishmentInfoList[0].zhongyanOne =
                this.result8.zhongyanOne;
              this.replenishmentInfoList[1].zhongyanTwo =
                this.result8.zhongyanTwo;
              break;
            case "运维":
              this.replenishmentInfoList[0].pingjiaOne =
                this.result9.pingjiaOne;
              this.replenishmentInfoList[1].pingjiaTwo =
                this.result9.pingjiaTwo;
              break;
            case "项目结项":
              this.replenishmentInfoList[0].pingjiaOne =
                this.result9.pingjiaOne;
              this.replenishmentInfoList[1].pingjiaTwo =
                this.result9.pingjiaTwo;
              break;
          }
          updateInfo({ replenishments: this.replenishmentInfoList }).then(
            (res) => {
              this.$message.success("补充信息保存成功");
              // this.getMilestoneNodeA()
              this.getQueryReplenishmentInfoListA(this.stageName);
              // this.$router.go(0)
              window.location.reload();

              // this.isEdit2 = false
            }
          );
          savePaymentInfo(this.form11.data).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("保存成功");
              this.getTbDataA();
              this.form11.data = {};
              this.centerDialogVisible5 = false;
            }
          });
        })
        .catch(() => {
          //取消操作
        });
    },
    // 添加交付物方法
    addDevily() {
      this.getTbData();
    },

    // 所属阶段方法
    // ---------------------------
    weihu() {
      updateDate({
        dueEndTime: this.value211,
        actualEndTime: this.value222,
        id: this.liIds,
      }).then((res) => {
        if ((res.msg.code = "0000")) {
          this.$message.success("保存成功");

          this.centerDialogVisible3 = false;
          this.getTbDataAA();
          location.reload();
        }
      });
    },
    // ------------------
    /* handleBlur11(e) {
      //确认操作
      // 输入框失去焦点时的处理函数
      UpdateProjectDetail({
        centerPersonName: this.value4,
        projectId: this.testId,
      }).then((res) => {

        this.isEdit4 = false;
      });
    },
    handleBlur111(e) {
      //确认操作
      // 输入框失去焦点时的处理函数
      UpdateProjectDetail({
        planYear: this.value7,
        projectId: this.testId,
      }).then((res) => {
        this.isEdit4 = false;
      });
    },
    handleBlur1111(e) {
      //确认操作 需求部门
      // 输入框失去焦点时的处理函数
      UpdateProjectDetail({
        applicationUnit: this.value8,
        projectId: this.testId,
      }).then((res) => {
        this.isEdit4 = false;
      });
    },
    handleBlur11111(e) {
      //确认操作 需求部门
      // 输入框失去焦点时的处理函数
      UpdateProjectDetail({
        projectCode: this.value9,
        projectId: this.testId,
      }).then((res) => {
        this.isEdit4 = false;
      });
    },
    handleBlur111111(e) {
      //确认操作 需求部门
      // 输入框失去焦点时的处理函数
      UpdateProjectDetail({
        projectName: this.value10,
        projectId: this.testId,
      }).then((res) => {
        this.isEdit4 = false;
      });
    }, */
    supInfo(index) {
      // const e = this.replenishmentInfoList[index].colVal
      // const id = this.replenishmentInfoList[index].id
      // let list = []
      // list.push
      // updateInfo({
      //   colVal: e,
      //   replenishmentId: id,
      // }).then((res) => {
      //   this.getQueryReplenishmentInfoListA()
      //   // this.isEdit2 = false
      // })
    },
    // 表格上传方法
    setLabel(row) {
      this.form3 = JSON.parse(JSON.stringify(this.form4));
      this.deliveryId = row.id;
      this.centerDialogVisible = true;
    },
    see(row) {
      this.isSee = true;
      this.form.data = row;
      this.centerDialogVisible4 = true;
    },
    deleteRow(row) {
      let find = (ele) => ele == row;
      const index = this.table.data.findIndex(find);
      if (row.isMustUpload == 0) {
        if (row.id) {
          // this.$message.success("删除成功")
          this.table.data.splice(index, 1);
          this.$message.success("删除成功");
        } else {
          this.table.data.splice(index, 1);
          this.$message.success("删除成功");
        }
      } else if (row.isMustUpload == 1) {
        this.$message.error("不可删除");
      } else if (row.isMustUpload == null) {
        this.table.data.splice(index, 1);
        this.$message.success("删除成功");
      }
    },
    // 保存提交
    saveJfw() {
      let { name, id, size, createTime, beforeUrl } =
        this.form3.data.accessoryList[0];
      size = (size / 1024 / 1024).toFixed(2);
      this.table.data.map((item) => {
        if (item.id == this.deliveryId) {
          item.uploadTime = createTime;
          item.fileContext = id;
          // item.beforeUrl
          item.beforeUrl = beforeUrl;
          // id: fileData.id,
          // item.name = '交付物'
          item.fileName = name;
          item.fileSize = size + "mb";

          item.uploadPerson = this.userInfo.fullname;
          this.centerDialogVisible = false;
        }
      });

      // this.table.data[]
      uploadTemporarily({
        name,
        id,
        size,
        deliveryId: this.deliveryId,
        fileContext,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("保存成功");
          this.centerDialogVisible = false;
          this.form3.data.accessoryList = [];
        }
      });
    },
    // 添加交付物
    addJfw() {
      this.table.data.push({
        name: "其他交付物",
        fileContext: null,
        fileName: null,
        fileSize: null,
        // id: 5,
        isMustUpload: 0,
        isUpload: null,
        milestoneId: null,
        projectId: null,
        uploadPerson: null,
        uploadTime: null,
        projectId: this.$route.query.id,
        milestoneId: this.liId,
      });
    },
    // 添加付款节点
    addFkjd() {
      this.centerDialogVisible5 = true;
      // this.table2.data.push({
      //   description: "付款点",
      //   scale: null,
      //   amount: null,
      //   status: null,
      //   actualAmount: null,
      //   id: null,
      //   projectId: this.testId,
      // });
    },
    clickRow(row) { },

    goback() {
      this.$router.push({
        name: "planProject",
        // query: {
        //   id: row.id,
        //   processId: row.processId,
        //   templateId: row.templateId,
        //   spanaActive: this.spanaActive,
        // },
        // 查看相关逻辑
      });
      // this.$router.go(-1);
    },
    fileUpload(fileData, scope) {
      this.table.data.push({
        uploadTime: fileData.createTime,
        id: fileData.id,
        name: "交付物",
        fileName: fileData.name,
        fileSize: fileData.size,
        uploadPerson: this.userInfo.fullname,
      });
      /* scope.reviewAppendix = JSON.stringify(scope.reviewAppendix); */
    },
    // 开始上传
    BigFileStartUpload(file, item) { },
    // 上传过程
    fileProgress(rootFile, file, chunk, item) { },
    // 上传成功
    BigFileUploadSuccess(fileList, item) { },

    // 预览
    openPicture(row) {
      let token = sessionStorage.getItem("token");
      if (
        //12.27
        [
          "doc",
          "docx",
          "txt",
          "html",
          "pdf",
          "ppt",
          "pptx",
          "html",
          "ofd",
        ].includes(row.fileName.split(".").pop())
      ) {
        window.open(`${this.baseUrl}/viewPdf?id=${row.fileContext}`);
      } else if (
        [
          "bmp",
          "jpg",
          "jpeg",
          "gif",
          "png",
          "zip",
          "rar",
          "xls",
          "xlsx",
        ].includes(row.fileName.split(".").pop())
      ) {
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${row.fileContext}&access_token=${token}`
        );
      }
      // window.open(`${this.baseUrl}/viewPdf?id=${row.fileContext}`);
      // window.open("https://vw.usdoc.cn/?src=https://usdoc.cn/vw/文件模板.docx")
    },
    onDownload(row) {
      this.baseUrl = "";
      let token = sessionStorage.getItem("token");
      window.open(
        `${this.baseUrl}/jfzg/file/api/file/download?key=${row.fileContext}&access_token=${token}`
      );
    },
    exportFile(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },

    // 交付物保存  添加交付物显示方法
    addJFWRule() {
      // 管理员
      if (
        this.userInfo.currentRole.roleCode == "FZGHC_JBRBF" &&
        this.testId2 < 0
      ) {
        this.testjfw = true;
      }
      // 项目负责人
      else if (
        this.userInfo.currentRole.roleCode == "XMFZR" &&
        this.testId2 < 0 &&
        ["项目规划", "运维"].includes(this.stageName)
      ) {
        this.testjfw = true;
      } else if (
        this.userInfo.currentRole.roleCode == "XMFZR" &&
        this.testId2 < 0 &&
        ["项目规划", "项目结项"].includes(this.stageName)
      ) {
        this.testjfw = true;
      }
      // 方案经理
      else if (
        this.userInfo.currentRole.roleCode == "FAJL" &&
        this.testId2 < 0 &&
        ["实施方案确认", "内部立项"].includes(this.stageName)
      ) {
        this.testjfw = true;
      }
      // 客户经理
      else if (
        this.userInfo.currentRole.roleCode == "KHJL" &&
        this.testId2 < 0 &&
        ["集团审议", "项目交底"].includes(this.stageName)
      ) {
        this.testjfw = true;
      }
      // 采购经理
      else if (
        this.userInfo.currentRole.roleCode == "CGJL" &&
        this.testId2 < 0 &&
        ["项目采购"].includes(this.stageName)
      ) {
        this.testjfw = true;
      }
      // 监理工程师
      else if (
        this.userInfo.currentRole.roleCode == "JLGCS" &&
        this.testId2 < 0 &&
        ["项目启动", "项目初验", "试运行", "项目终验"].includes(this.stageName)
      ) {
        this.testjfw = true;
      } else {
        this.testjfw = false;
      }
    },
    returnFa() {
      if (this.testId2 > 0) {
        this.pjtilsj = false;
      } else if (
        this.testId2 < 0 &&
        this.userInfo.currentRole.roleCode == this.fanganjl
      ) {
        this.pjtilsj = false;
      } else {
        // this.pjtilsj = true;
      }
    },
    returnFa2() {
      if (this.testId2 > 0) {
        this.pjlis = false;
      } else if (
        this.testId2 < 0 &&
        !["XMFZR", "FZGHC_JBRBF"].includes(this.userInfo.currentRole.roleCode)
      ) {
        this.pjlis = false;
      } else {
        // this.pjlis = true;
      }
    },
    initResizeObserver() {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.widthB = entry.contentRect.width + "px";
        });
      });
      this.resizeObserver.observe(document.querySelector(".main-menu-box"));
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    },
  },
  watch: {
    "search.formData.status": {
      handler(v) {
        this.getTbData();
      },
    },
    /* "form2.data.specialClassFile": {
      handler(newVal, old) {
        // specialClassFile
        // 调用update方法
        if (newVal != old) {
          newVal = JSON.stringify(newVal);
          UpdateProjectDetail({
            specialClassFile: newVal,
            projectId: this.testId,
          }).then((res) => {
            if (res.msg.code == "0000") {
            }
          });
        }
      },
      deep: true,
    }, */
    "userInfo.currentRole.roleCode": {
      handler(newVal, old) {
        if (newVal !== old) {
          this.addJFWRule();
          this.returnFa();
          this.returnFa2();
        }
      },
    },
  },
  created() {
    this.testId = this.$route.query.id;
    this.testId2 = this.$route.query.testId2;
    this.addJFWRule();
    this.returnFa();
    this.returnFa2();
  },
  mounted() {
    this.getTbData();
    this.getTbHeader();
    this.getTbHeaderA();
    this.getTbDataAA();
    this.getTbHeaderAA();
    this.getProjectDetailA();
    this.getMilestoneNodeA();

    this.getQueryReplenishmentInfoListA();

    this.api_getServiceTypeListA();
    this.form4 = JSON.parse(JSON.stringify(this.form3));
    this.initResizeObserver();
    // 里程碑下的补充信息 POST
    // getQueryMilestoneSupplemental({}).then(()=>{
    // // })

    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    this.destroyResizeObserver();
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style lang="scss" scpoed>
.base {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;

  .base-left {
    min-width: 24%;
    overflow: auto;
    opacity: 1;
    padding: 0px 20px 10px 20px;
    background: rgba(255, 255, 255, 1);
  }

  .base-right {
    width: calc(100% - 380px);
    margin-left: 16px;
    // overflow-y: scroll;
    background: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;

    // 里程碑节点样式
    .base-right-top {
      width: 100%;
      padding: 16px 20px;
      padding-bottom: 10px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 1);
      flex-shrink: 0;

      .base-message-right-top {
        display: flex;
        justify-content: space-between;

        .base-message-right-top-title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0px;
          line-height: 22px;
          color: rgba(29, 33, 41, 1);
          text-align: left;
          vertical-align: top;
          margin-bottom: 3px;
        }

        span {
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0px;
          line-height: 18px;
          color: rgba(78, 89, 105, 1);
          text-align: left;
          vertical-align: top;
        }
      }

      .base-right-top-step {
        display: flex;
        // flex-wrap: nowrap;
        width: 100%;

        // height: 148px;
        // margin-top: 16px;
        // background-color: navajowhite;
        .base-right-box {
          display: flex;
          overflow-x: scroll;
          padding-bottom: 10px;
        }

        .base-right-top-step-box {
          // float: left;

          .base-right-top-box1 {
            width: 178px;
            box-sizing: border-box;
            // width: 20%;
            height: 56px;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
            border-radius: 8px, 0px, 0px, 8px;
            cursor: pointer;
            z-index: 999;
            // background: rgba(0, 186, 173, 1);
            // box-shadow: 0px 4px 8px rgba(0, 186, 173, 0.2);
            // background-image: url('../../../assets/images/step1.png');

            background-size: 100% 115%;
            background-repeat: no-repeat;

            p {
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0px;
              line-height: 18px;
              color: rgba(78, 89, 105, 1);
              // color: white;
            }
          }
        }

        // 节点样式
        .spanActive {
          // background-color: gray !important;
          // border-bottom: 2px solid rgb(14, 129, 206);
          border-bottom: 2px solid rgb(96, 170, 219);
          color: #bd1b1b;
        }
      }
    }

    .base-message-line {
      // left: 20px;
      // top: 686px;
      // width: 363px;
      width: 100%;
      height: 1px;
      opacity: 1;

      background: rgba(229, 230, 235, 1);
    }

  }
}







/* WebKit 浏览器 (如 Chrome、Safari) 的滚动条样式 */
.base-right-box::-webkit-scrollbar {
  width: 8px;
  /* 滚动条宽度 */
}

.base-right-box::-webkit-scrollbar-track {
  background: #f8f9fa;
  /* 轨道背景色 */
  height: 1px;
}

.base-right-box::-webkit-scrollbar-thumb {
  background: #888;
  /* 滑块背景色 */
  width: 1px;
  height: 1px;
  border-radius: 4px;
  /* 滑块圆角 */
}

.base-right-box::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* 滑块悬停时的背景色 */
  height: 1px;
}

.base-right-box {
  scrollbar-width: thin;
  /* 设置滚动条宽度为细 */
  scrollbar-color: #888 #f5f5f5;
  /* 设置滚动条滑块颜色和轨道颜色 */
}

/* 滚动条样式 */
.base-right-box::-webkit-scrollbar {
  width: 2px;
}

::-webkit-scrollbar {
  // display: none; /* Chrome Safari */
}

/* 滑块样式 */
::-webkit-scrollbar-thumb {
  // width: 5px !important;
  background-color: #9f9f9f;
  border-radius: 10px;
}

/* 滚动条轨道样式 */
::-webkit-scrollbar-track {
  background-color: #fcfcfc;
  // border-radius: 10px;
}

::-webkit-scrollbar-button {
  width: 2px;
}

.base-right-bottom {
  width: 100%;
  padding: 16px 20px;
  padding-top: 0;
  height: 100%;
  border-radius: 0 10px 10px 10px;
  background: rgba(255, 255, 255, 1);
  overflow-y: auto;
  flex-grow: 1;
}

// 补充信息盒子
.buchong-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border-radius: 4px;
  // background-color: indianred;
  background: rgba(247, 248, 250, 1);
  padding: 20px;
  margin-bottom: 16px;

  .buchong-box-single {
    // width: 50%;
    display: flex;
    flex-wrap: wrap;
    /* 允许换行 */
    // gap: 100px; /* 元素之间的间隔 */
    // justify-content: center;
    margin-left: 10px;

    // align-items: center;
    span {
      display: inline-block;
      margin-bottom: 9px;
    }

    .buchong-box-single-span1_1 {
      // min-width: 100px;
      font-weight: 500;
      // display: inline-block;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      flex-wrap: nowrap;
      overflow: hidden;
      white-space: nowrap;
      text-align: justify;
      text-overflow: ellipsis;
      color: rgba(29, 33, 41, 1);
    }

    .buchong-box-single-span2 {
      width: 240px;
      margin-left: 5px;
      display: flex;
      // background-color: red;
      align-items: center;
    }
  }
}

.el-button+.el-button {
  margin-left: 32px !important;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

// 表头样式
::v-deep .el-table th {
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 1);
  text-align: center;
}



.addbtns {
  // width: 112px;
  text-align: center;
  height: 48px;
  line-height: 48px;
  // border-radius: 4px;
  // background: rgba(66, 130, 255, 0.1);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  color: rgb(1, 118, 255);
  border: 1px solid rgb(239, 239, 239);
  border-top: none;
  margin-bottom: 20px;
}

.bottom-btns {
  position: fixed;
  bottom: 0;
  // width: calc(100% - 220px);
  background: #fff;
  z-index: 10;
  right: 0;

  .btns {
    height: 64px;
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #e6e6e6;
    position: relative;

    .btnList {
      display: inline-block;
    }

    .back-btn {
      display: inline-block;
      margin-left: 16px;

      .el-button {
        border-radius: 4px;
      }
    }               
  }
}
</style>
