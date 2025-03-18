<template>
  <div>
    <!-- 项目信息左侧 基本信息 流程信息 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <div style="display: flex">
          <div style="width: 100%; height: 100%">
            <div class="base-message-box">
              <span class="span1">系统名称:</span>
              <div class="span2">
                <el-tooltip
                  :content="processData.systemName"
                  placement="top-start"
                  effect="light"
                >
                  <el-input
                    v-model="processData.systemName"
                    v-if="
                      testId2 < 0 &&
                      userInfo.currentRole.roleCode == 'FZGHC_JBRBF'
                    "
                    placeholder="请输入系统名称"
                  ></el-input>

                  <div v-else>
                    {{ processData.systemName }}
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">项目名称:</span>
              <div class="span2">
                <el-tooltip
                  :content="processData.projectName"
                  placement="top-start"
                  effect="light"
                >
                  <el-input
                    v-model="processData.projectName"
                    v-if="
                      testId2 < 0 &&
                      userInfo.currentRole.roleCode == 'FZGHC_JBRBF'
                    "
                    placeholder="请输入项目名称"
                  ></el-input>
                  <div v-else>
                    {{ processData.projectName }}
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">项目编号:</span>

              <div class="span2">
                <el-tooltip
                  :content="processData.projectCode"
                  placement="top-start"
                  effect="light"
                >
                  <el-input
                    v-model="processData.projectCode"
                    v-if="
                      testId2 < 0 &&
                      userInfo.currentRole.roleCode == 'FZGHC_JBRBF'
                    "
                    placeholder="请输入项目编号"
                  ></el-input>

                  <div v-else>
                    {{ processData.projectCode }}
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">需求部门:</span>
              <div class="span2">
                <el-tooltip
                  :content="processData.applicationUnit"
                  placement="top-start"
                  effect="light"
                >
                  <el-input
                    v-model="processData.applicationUnit"
                    v-if="
                      testId2 < 0 &&
                      userInfo.currentRole.roleCode == 'FZGHC_JBRBF'
                    "
                    placeholder="请输入需求部门"
                  ></el-input>
                  <div v-else>
                    {{ processData.applicationUnit }}
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">所属年度计划:</span>
              <div class="span2">
                <el-tooltip
                  :content="processData.planYear"
                  placement="top-start"
                  effect="light"
                >
                  <el-select
                    clearable
                    v-if="
                      testId2 < 0 &&
                      userInfo.currentRole.roleCode == 'FZGHC_JBRBF'
                    "
                    v-model="processData.planYear"
                    placeholder="请选择所属年度计划"
                  >
                    <el-option
                      v-for="item in yearPlanList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <div v-else>
                    {{ processData.planYear ? processData.planYear : "-" }}
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">项目类型:</span>

              <div class="span2">
                <el-tooltip
                  :content="processData.projectTypeCode"
                  placement="top-start"
                  effect="light"
                >
                  <el-select
                    clearable
                    v-if="
                      testId2 < 0 &&
                      userInfo.currentRole.roleCode == 'FZGHC_JBRBF'
                    "
                    v-model="processData.projectTypeCode"
                    placeholder="请输入项目类型"
                  >
                    <el-option
                      v-for="item in projectTypeCodeOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <div v-else>
                    {{
                      processData.projectTypeCode
                        ? processData.projectTypeCode
                        : "-"
                    }}
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">项目负责人:</span>
              <div class="span2">
                <el-select
                  clearable
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.contactId"
                  placeholder="请选择项目负责人"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in xmfzrOptions"
                    :key="item.value"
                    :label="item.fullname"
                    :value="item.jfid"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{ processData.contactName ? processData.contactName : "-" }}
                </div>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">客户经理:</span>
              <div class="span2">
                <el-select
                  clearable
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.clientManagerId"
                  placeholder="请选择客户经理"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in khjlOptions"
                    :key="item.value"
                    :label="item.fullname"
                    :value="item.jfid"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{
                    processData.clientManagerName
                      ? processData.clientManagerName
                      : "-"
                  }}
                </div>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">方案经理:</span>
              <div class="span2">
                <el-select
                  clearable
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.programManagerId"
                  placeholder="请选择方案经理"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in fajlOptions"
                    :key="item.value"
                    :label="item.fullname"
                    :value="item.jfid"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{
                    processData.programManagerName
                      ? processData.programManagerName
                      : "-"
                  }}
                </div>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">采购经理:</span>
              <div class="span2">
                <el-select
                  clearable
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.procurementManagerId"
                  placeholder="请选择采购经理"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in cgjlOptions"
                    :key="item.value"
                    :label="item.fullname"
                    :value="item.jfid"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{
                    processData.procurementManagerName
                      ? processData.procurementManagerName
                      : "-"
                  }}
                </div>
              </div>
            </div>
            <div v-if="this.SortsData.length > 1">
              <div
                v-for="(item, index) in this.SortsData"
                class="base-message-box1"
              >
                <div>
                  <div style="display: flex" class="base_span">
                    <span class="span1"
                      >承建单位:
                      <i class="span_i">标段{{ index + 1 }}</i>
                    </span>

                    <el-tooltip
                      :content="item.contractUnitFullName"
                      placement="top-start"
                      effect="light"
                    >
                      <div
                        class="span2"
                        v-if="
                          testId2 < 0 &&
                          ['XMFZR', 'FZGHC_JBRBF'].includes(
                            userInfo.currentRole.roleCode
                          )
                        "
                      >
                        <el-select
                          clearable
                          v-model="item.contractUnitFullName"
                          placeholder="请选择承建单位"
                          @change="BaseCJ(item, index)"
                          :filterable="true"
                        >
                          <el-option
                            v-for="item in cjdwOptions"
                            :key="item.value"
                            :label="item.buName"
                            :value="item.buid"
                          >
                          </el-option>
                        </el-select>
                      </div>

                      <div v-else class="span2">
                        {{
                          item.contractUnitFullName
                            ? item.contractUnitFullName
                            : "-"
                        }}
                      </div>
                    </el-tooltip>
                  </div>

                  <div style="display: flex" class="base_span">
                    <span class="span1">承建单位项目经理:</span>
                    <div class="span2">
                      <el-select
                        clearable
                        v-if="
                          testId2 < 0 &&
                          ['XMFZR', 'FZGHC_JBRBF'].includes(
                            userInfo.currentRole.roleCode
                          )
                        "
                        @change="BaseXMJL(item, index)"
                        v-model="item.contractor"
                        placeholder="请选择承建单位项目经理"
                        :filterable="true"
                      >
                        <el-option
                          v-for="item in cjdwjlOptions"
                          :key="item.value"
                          :label="item.fullname"
                          :value="item.jfid"
                        >
                        </el-option>
                      </el-select>
                      <div v-else class="span2">
                        {{ item.contractorName ? item.contractorName : "-" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 单标段 -->
            <div class="base-message-box" v-if="this.SortsData.length == 1">
              <span class="span1">承建单位:</span>
              <div class="span2">
                <el-select
                  clearable
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.contractUnit"
                  placeholder="请选择承建单位"
                  @change="selectCJ"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in cjdwOptions"
                    :key="item.value"
                    :label="item.buName"
                    :value="item.buid"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{
                    processData.contractUnitFullName
                      ? processData.contractUnitFullName
                      : "-"
                  }}
                </div>
              </div>
            </div>
            <div class="base-message-box" v-if="this.SortsData.length == 1">
              <span class="span1">承建单位项目经理:</span>
              <div class="span2">
                <el-select
                  clearable
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.contractor"
                  placeholder="请选择承建单位项目经理"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in cjdwjlOptions"
                    :key="item.value"
                    :label="item.fullname"
                    :value="item.jfid"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{
                    processData.contractorName
                      ? processData.contractorName
                      : "-"
                  }}
                </div>
              </div>
            </div>

            <div class="base-message-box">
              <span class="span1">监理单位:</span>
              <!-- <span class="span2">{{
                  BelongingField ? BelongingField : ''
                }}</span> -->
              <div class="span2">
                <el-select
                  clearable
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.controlUnit"
                  placeholder="请选择监理单位"
                  @change="selectJL"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in options31"
                    :key="item.value"
                    :label="item.buName"
                    :value="item.buid"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{
                    processData.controlUnitFullName
                      ? processData.controlUnitFullName
                      : "-"
                  }}
                </div>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">监理单位工程师:</span>
              <div class="span2">
                <el-select
                  clearable
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.controlJfid"
                  placeholder="请选择监理单位工程师"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in jlgcsOptions"
                    :key="item.value"
                    :label="item.fullname"
                    :value="item.jfid"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{ processData.controlName ? processData.controlName : "-" }}
                </div>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">所属阶段:</span>

              <span class="span2">
                <el-select
                  clearable
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.projectMaturity"
                  placeholder="请选择"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in projectMaturityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{
                    processData.projectMaturity
                      ? processData.projectMaturity
                      : "-"
                  }}
                </div>
              </span>
            </div>
            <div class="base-message-box">
              <span class="span1">需交付使用时间:</span>

              <!-- 需交付时间 -->
              <div class="span2">
                <el-date-picker
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="processData.needDeliveryTime"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
                <div v-else>
                  {{
                    processData.needDeliveryTime
                      ? processData.needDeliveryTime
                      : "-"
                  }}
                </div>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">项目分类:</span>
              <div class="span2">
                <el-link type="primary" @click="openDiaLog('E')"
                  >查看详情
                </el-link>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">项目概述:</span>
              <div class="span2">
                <el-link type="primary" @click="openDiaLog('A')"
                  >查看详情
                </el-link>
              </div>
            </div>
            <!-- <div class="base-message-box">
              <el-tooltip
                content="业务应用需求"
                placement="top-start"
                effect="light"
              >
                <span class="span1">业务应用需求:</span>
              </el-tooltip>
              <div class="span2">
                <el-link type="primary" @click="openDiaLog('B')"
                  >查看详情
                </el-link>
              </div>
            </div> -->
          </div>
        </div>
        <div class="base-message-left-bottom-title">共性支撑信息</div>
        <div class="base-message-box">
          <span class="span3">政务大数据平台能力:</span>

          <div class="span2">
            <el-link type="primary" @click="openDiaLog('C')">查看详情 </el-link>
          </div>
        </div>
        <div class="base-message-box">
          <span class="span3">企业侧共性能力:</span>

          <div class="span2">
            <el-link type="primary" @click="openDiaLog('D')">查看详情 </el-link>
          </div>
        </div>
        <!-- 专班信息模块 -->
        <div class="base-message-line"></div>
        <div class="base-message-left-bottom-title">专班信息</div>

        <div style="display: flex">
          <div style="width: 100%; height: 100%">
            <div
              class="base-message-box"
              style="position: relative; margin-bottom: 24px; height: 50px"
            >
              <span class="span3">专班文件:</span>

              <div class="span">
                <SrAdd
                  style="padding-right: 20px"
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  :config="form2.config"
                  :form="form2.data"
                  :enums="form2.enums"
                  :otherConfig="form2.otherConfig"
                  ref="add"
                  class="add"
                ></SrAdd>
                <div
                  v-if="
                    form2.data.specialClassFile &&
                    form2.data.specialClassFile.length > 0
                  "
                  style="line-height: 32px"
                >
                  <el-link
                    style="
                      cursor: pointer;
                      position: relative;
                      text-align: center;
                    "
                    @click="zbDownload"
                    type="primary"
                  >
                    <div>
                      {{ form2.data.specialClassFile[0].name }}
                      <i class="el-icon-download"></i>
                    </div>
                  </el-link>
                </div>
                <div v-else>
                  <div
                    v-if="
                      testId2 > 0 && form2.data.specialClassFile.length == 0
                    "
                  >
                    暂无附件
                  </div>
                </div>
              </div>
            </div>

            <div class="base-message-box">
              <span class="span1">需求部门负责人:</span>

              <div class="span2">
                <el-input
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.needDepartmentPersonName"
                  placeholder="请输入"
                ></el-input>
                <div v-else>
                  {{
                    processData.needDepartmentPersonName
                      ? processData.needDepartmentPersonName
                      : "-"
                  }}
                </div>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">中心负责部门:</span>
              <div class="span2">
                <el-select
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.centerDepartmentName"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in centerDepartmentNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div v-else>
                  {{
                    processData.centerDepartmentName
                      ? processData.centerDepartmentName
                      : "-"
                  }}
                </div>
              </div>
            </div>
            <div class="base-message-box">
              <span class="span1">中心负责人:</span>
              <div class="span2">
                <el-input
                  v-if="
                    testId2 < 0 &&
                    ['XMFZR', 'FZGHC_JBRBF'].includes(
                      userInfo.currentRole.roleCode
                    )
                  "
                  v-model="processData.centerPersonName"
                  placeholder="请输入"
                ></el-input>
                <div v-else>
                  {{
                    processData.centerPersonName
                      ? processData.centerPersonName
                      : "-"
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 项目信息保存 -->
        <div class="projectZBtn">
          <el-button
            v-show="testId2 > 0 ? false : true"
            type="primary"
            size="medium"
            round
            v-if="this.SortsData.length == 1"
            @click="prijectsubmit2"
            >保存
          </el-button>
          <el-button
            v-show="testId2 > 0 ? false : true"
            type="primary"
            size="medium"
            round
            v-if="this.SortsData.length > 1"
            @click="prijectsubmit"
            >保存
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="流程信息" name="second">
        <div class="base-message-box">
          <span class="span1">实施方案进展:</span>
          <el-tooltip
            :content="processData.implementationProgress"
            placement="top-start"
            effect="light"
          >
            <span class="span2">{{ processData.implementationProgress }}</span>
          </el-tooltip>
        </div>
        <div class="base-message-box">
          <span class="span1">预授权协议:</span>
          <el-tooltip
            :content="processData.authorizationAgreement"
            placement="top-start"
            effect="light"
          >
            <span class="span2">{{ processData.authorizationAgreement }}</span>
          </el-tooltip>
        </div>
        <div class="base-message-box">
          <span class="span1">实施方案报送投资概算金额:</span>
          <el-tooltip
            :content="processData.implementationPlanAmount"
            placement="top-start"
            effect="light"
          >
            <span class="span2">{{
              processData.implementationPlanAmount
            }}</span>
          </el-tooltip>
        </div>
        <div class="base-message-box">
          <span class="span1">发改委概算核定金额:</span>
          <el-tooltip
            :content="processData.budgetEstimateAmount"
            placement="top-start"
            effect="light"
          >
            <span class="span2">{{ processData.budgetEstimateAmount }}</span>
          </el-tooltip>
        </div>
        <div class="base-message-box">
          <span class="span1">财政概算评审核定:</span>
          <el-tooltip
            :content="processData.financialEvaluationAmount"
            placement="top-start"
            effect="light"
          >
            <span class="span2">{{
              processData.financialEvaluationAmount
            }}</span>
          </el-tooltip>
        </div>
        <div class="base-message-box">
          <span class="span1">投资概算核定:</span>
          <el-tooltip
            :content="processData.approvalInvestmentBudget"
            placement="top-start"
            effect="light"
          >
            <span class="span2">{{
              processData.approvalInvestmentBudget
            }}</span>
          </el-tooltip>
        </div>
        <div class="base-message-box">
          <span class="span1">预算评审:</span>
          <el-tooltip
            :content="processData.budgetReview"
            placement="top-start"
            effect="light"
          >
            <span class="span2">{{ processData.budgetReview }}</span>
          </el-tooltip>
        </div>
        <div class="base-message-box">
          <span class="span1">开发建设进度:</span>
          <el-tooltip
            :content="processData.developmentConstructionProgress"
            placement="top-start"
            effect="light"
          >
            <span class="span2">{{
              processData.developmentConstructionProgress
            }}</span>
          </el-tooltip>
        </div>
        <div class="base-message-box">
          <span class="span1">试运行:</span>
          <el-tooltip
            :content="processData.testRun"
            placement="top-start"
            effect="light"
          >
            <span class="span2">{{ processData.testRun }}</span>
          </el-tooltip>
        </div>
      </el-tab-pane>
    </el-tabs>

    <DialogChen
      v-if="showDialog"
      :dialogVisible="showDialog"
      @closeDialog="closeDialogY"
      :dialogTitle="dialogTitle"
    ></DialogChen>
  </div>
</template>

<script>
import store from "@/store";
import DialogChen from "@/components/DialogChen.vue";
import {
  updateMemberManagement,
  UpdateProjectDetail,
  getUserByRoleCode,
  getQueryBizunitsByProperty,
  getProjectDetail,
} from "@/api/planProject/index.js";
import yearPlanManager from "@/utils/yearPlanUtils";
export default {
  name: "basic-info",
  components: { DialogChen },
  computed: {
    testId() {
      return this.$route.query.id || "";
    },
    testId2() {
      return this.$route.query.testId2 || "";
    },
  },
  data() {
    return {
      SortsData: [],
      yearPlanList: [],
      activeName: "first", // tab页签
      userInfo: store.getters.userInfo, // 用户信息
      planYearOptions: [
        // 年度计划
        {
          value: "2023-2024年度计划",
          // label: '黄金糕',
        },
        {
          value: "2025年度计划",
          // label: '双皮奶',
        },
        {
          value: "2026年度计划",
          // label: '蚵仔煎',
        },
      ],
      projectTypeCodeOptions: [
        // 年度计划
        {
          value: "整合融道",
          // label: '黄金糕',
        },
        {
          value: "新建(含升级扩建)",
          // label: '双皮奶',
        },
      ],
      // 所属阶段配置信息
      projectMaturityOptions: [
        {
          value: "建设实施阶段",
          // label: '黄金糕',
        },
        {
          value: "方案编制阶段",
          // label: '双皮奶',
        },
        {
          value: "初步上线",
          // label: '蚵仔煎',
        },
        {
          value: "未启动",
          // label: '龙须面',
        },
      ],
      xmfzrOptions: [], // 项目负责人下拉选数据
      fajlOptions: [], // 方案经理下拉选数据
      khjlOptions: [], // 客户经理下拉选数据
      cgjlOptions: [], // 采购经理下拉选数据
      cjdwOptions: [], // 承建单位下拉选数据
      cjdwjlOptions: [], // 承建单位项目经理下拉选数据
      options31: [], // 监理单位下拉选数据
      jlgcsOptions: [], // 监理工程师下拉选数据
      centerDepartmentNameOptions: [
        {
          value: "安全保障部",
          // label: '黄金糕',
        },
        {
          value: "项目统筹部",
          // label: '双皮奶',
        },
        {
          value: "技术一部",
          // label: '蚵仔煎',
        },
        {
          value: "技术二部",
          // label: '黄金糕',
        },
        {
          value: "技术三部",
          // label: '双皮奶',
        },
        {
          value: "技术四部",
          // label: '蚵仔煎',
        },
        {
          value: "技术五部",
          // label: '蚵仔煎',
        },
        {
          value: "技术六部",
          // label: '蚵仔煎',
        },
        {
          value: "技术七部",
          // label: '蚵仔煎',
        },
        {
          value: "技术八部",
          // label: '蚵仔煎',
        },
      ], // 中心负责部门下拉选数据
      showDialog: false, // 主要建设内容 | 业务应用需求 弹框打开
      dialogTitle: "", // 弹框title
      // 专班信息
      form2: {
        otherConfig: {
          labelNum: 0,
        },
        config: [
          {
            type: "upload",
            // name: '',
            bind: "specialClassFile",
            fileList: [],
            fileSize: 500,
            limit: 0,
            // fileTip: '仅支持上传pdf、ofd、doc、docx格式文件!',
            fileType: "pdf,ofd,doc,docx",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        enums: {},
        data: {
          specialClassFile: [],
          downName: "",
        },
      },
      // 流程信息
      processData: {
        systemName: "", // systemName
        projectName: "", // projectName
        projectCode: "", // projectCode
        applicationUnit: "", // applicationUnit
        planYear: "", // planYear
        projectTypeCode: "", // projectTypeCode
        // 实验方案进展
        implementationProgress: "",
        // 预授权协议
        authorizationAgreement: "",
        // 实施方案报送投资概算金额
        implementationPlanAmount: "",
        // 发改委概算核定金额
        budgetEstimateAmount: "",
        // 财政概算评审金额
        financialEvaluationAmount: "",
        // 投资概算核定
        approvalInvestmentBudget: "",
        // 预算评审
        budgetReview: "",
        // 开发建设进度
        developmentConstructionProgress: "",
        // 试运行
        testRun: "",
        projectIds: [],
        jfid: "",
        projectType: "",
        contactName: "",
        contactId: "",
        // 客户经理
        clientManagerName: "",
        clientManagerId: "",
        // 方案经理
        programManagerName: "",
        programManagerId: "",
        // 采购经理
        procurementManagerName: "",
        procurementManagerId: "",
        // 承建单位
        contractUnitFullName: "",
        contractUnit: "",
        // 承建单位项目经理
        contractorName: "",
        contractor: "",
        // 监理单位
        controlUnitFullName: "",
        controlUnit: "",
        // 监理单位工程师
        controlName: "",
        controlJfid: "",
        projectMaturity: "", // 所属阶段
        needDeliveryTime: "", // 需交付时间
        needDepartmentPersonName: "", // 需求部门负责人
        centerDepartmentName: "", // 中心负责部门
        centerPersonName: "", // 中心部门负责人
      },
    };
  },
  created() {
    this.yearPlanList = yearPlanManager.yearPlanList;
  },
  mounted() {
    this.getUserByRoleCode();
    this.getProjectDetail();
  },
  methods: {
    // 获取项目负责人
    getUserByRoleCode() {
      getUserByRoleCode({ roleCode: "XMFZR" }).then((res) => {
        // console.log("当前拿到的角色---", res.data);
        this.xmfzrOptions = res.data;
      });
      getUserByRoleCode({ roleCode: "FAJL" }).then((res) => {
        // console.log("方案经理", res.data);
        this.fajlOptions = res.data;
      });
      getUserByRoleCode({ roleCode: "KHJL" }).then((res) => {
        // console.log("客户经理", res.data);
        this.khjlOptions = res.data;
      });
      getUserByRoleCode({ roleCode: "CGJL" }).then((res) => {
        // console.log("采购经理", res.data);
        this.cgjlOptions = res.data;
      });
      getQueryBizunitsByProperty({ buPropertyEnum: "CJDW" }).then((res) => {
        this.cjdwOptions = res.data;
      });
      getQueryBizunitsByProperty({ buPropertyEnum: "JLDW" }).then((res) => {
        this.options31 = res.data;
      });
    },
    // 打开弹框
    openDiaLog(val) {
      if (val == "A") {
        this.dialogTitle = "项目概述";
      } else if (val == "B") {
        this.dialogTitle = "业务应用需求";
      } else if (val == "C") {
        this.dialogTitle = "政务大数据平台能力";
      } else if (val == "D") {
        this.dialogTitle = "企业侧共性能力";
      } else if (val == "E") {
        this.dialogTitle = "项目分类";
      }
      this.showDialog = true;
    },
    closeDialogY() {
      this.showDialog = false;
    },
    // 根据value 拿label
    getAllId(list, id) {
      let label = "";
      const element = list.find(
        (element) => element.jfid == id || element.buid == id
      );
      if (element) {
        label = element.fullname ? element.fullname : element.buName;
      }
      return label;
    },

    // 判断值是否为数字（兼容字符串和数值类型）
    isNumeric(value) {
      return !isNaN(value) && !isNaN(parseFloat(value));
    },
    // 基本信息保存
    prijectsubmit() {
      console.log(this.SortsData, "哈哈哈哈哈啊哈哈");

      this.$confirm("是否确认该操作", "提示", {
        iconClass: "el-icon-question", //自定义图标样式
        confirmButtonText: "确认", //确认按钮文字更换
        cancelButtonText: "取消", //取消按钮文字更换
        showClose: true, //是否显示右上角关闭按钮
        type: "warning", //提示类型  success/info/warning/error
      })
        .then(async () => {
          //确认操作
          // 输入框失去焦点时的处理函数
          this.processData.projectIds = [];
          // this.processData.jfid = "";
          this.processData.contactName = this.getAllId(
            this.xmfzrOptions,
            this.processData.contactId
          );
          this.processData.programManagerName = this.getAllId(
            this.fajlOptions,
            this.processData.programManagerId
          );
          this.processData.clientManagerName = this.getAllId(
            this.khjlOptions,
            this.processData.clientManagerId
          );
          this.processData.procurementManagerName = this.getAllId(
            this.cgjlOptions,
            this.processData.procurementManagerId
          );
          // contractUnitFullName
          // this.processData.contractUnitFullName = this.getAllId(
          //   this.cjdwOptions,
          //   this.processData.contractUnit
          // );
          // // contractorName
          // this.processData.contractorName = this.getAllId(
          //   this.cjdwjlOptions,
          //   this.processData.contractor
          // );
          this.processData.controlUnitFullName = this.getAllId(
            this.options31,
            this.processData.controlUnit
          );
          this.processData.controlName = this.getAllId(
            this.jlgcsOptions,
            this.processData.controlJfid
          );

          this.processData.projectIds.push(this.testId);
          // projectCJDWVos:newItem,

          let arr1 = [];

          let data = this.SortsData;

          console.log(data, "datadatadatadata");
          data.forEach((item) => {
            const newItem = { ...item };
            // console.log(newItem.contractUnitFullName, "contractUnitFullName");
            if (this.isNumeric(newItem.contractUnitFullName)) {
              newItem.contractUnitFullName = this.getAllId(
                this.cjdwOptions,
                newItem.contractUnitFullName
              );
            }
            // contractorName
            if (this.isNumeric(newItem.contractorName)) {
              newItem.contractorName = this.getAllId(
                this.cjdwjlOptions,
                newItem.contractorName
              );
            }
            arr1.push(newItem);
          });

          let projectCJDWVos = {
            projectCJDWVos: arr1,
          };

          let params = { ...projectCJDWVos, ...this.processData };
          console.log(params, "params");

          await updateMemberManagement(params);
          this.updateProjectDetail();
        })
        .catch(() => {
          //取消操作
        });
    },
    updateProjectDetail() {
      let specialClassFile = Array.isArray(this.form2.data.specialClassFile)
        ? this.form2.data.specialClassFile
        : [];
      let params = {
        systemName: this.processData.systemName,
        projectMaturity: this.processData.projectMaturity,
        centerDepartmentName: this.processData.centerDepartmentName,
        needDeliveryTime: this.processData.needDeliveryTime,
        needDepartmentPersonName: this.processData.needDepartmentPersonName,
        centerPersonName: this.processData.centerPersonName,
        planYear: this.processData.planYear,
        applicationUnit: this.processData.applicationUnit,
        projectCode: this.processData.projectCode,
        projectName: this.processData.projectName,
        specialClassFile: JSON.stringify(this.form2.data.specialClassFile),
        projectId: this.testId,
      };
      //确认操作 需求部门
      // 输入框失去焦点时的处理函数
      UpdateProjectDetail(params).then((res) => {
        if ((res.msg.code = "0000")) {
          this.getProjectDetail();
          this.$message.success("保存成功");
        }
        this.isEdit4 = false;
      });
    },
    // 基本信息保存
    prijectsubmit2() {
      console.log(this.SortsData, "哈哈哈哈哈啊哈哈");

      this.$confirm("是否确认该操作", "提示", {
        iconClass: "el-icon-question", //自定义图标样式
        confirmButtonText: "确认", //确认按钮文字更换
        cancelButtonText: "取消", //取消按钮文字更换
        showClose: true, //是否显示右上角关闭按钮
        type: "warning", //提示类型  success/info/warning/error
      })
        .then(async () => {
          //确认操作
          // 输入框失去焦点时的处理函数
          this.processData.projectIds = [];
          // this.processData.jfid = "";
          this.processData.contactName = this.getAllId(
            this.xmfzrOptions,
            this.processData.contactId
          );
          this.processData.programManagerName = this.getAllId(
            this.fajlOptions,
            this.processData.programManagerId
          );
          this.processData.clientManagerName = this.getAllId(
            this.khjlOptions,
            this.processData.clientManagerId
          );
          this.processData.procurementManagerName = this.getAllId(
            this.cgjlOptions,
            this.processData.procurementManagerId
          );
          this.processData.contractUnitFullName = this.getAllId(
            this.cjdwOptions,
            this.processData.contractUnit
          );
          this.processData.contractorName = this.getAllId(
            this.cjdwjlOptions,
            this.processData.contractor
          );
          this.processData.controlUnitFullName = this.getAllId(
            this.options31,
            this.processData.controlUnit
          );
          this.processData.controlName = this.getAllId(
            this.jlgcsOptions,
            this.processData.controlJfid
          );
          this.processData.projectIds.push(this.testId);
          await updateMemberManagement(this.processData);
          this.updateProjectDetail();
        })
        .catch(() => {
          //取消操作
        });
    },
    updateProjectDetail() {
      let specialClassFile = Array.isArray(this.form2.data.specialClassFile)
        ? this.form2.data.specialClassFile
        : [];
      let params = {
        systemName: this.processData.systemName,
        projectMaturity: this.processData.projectMaturity,
        centerDepartmentName: this.processData.centerDepartmentName,
        needDeliveryTime: this.processData.needDeliveryTime,
        needDepartmentPersonName: this.processData.needDepartmentPersonName,
        centerPersonName: this.processData.centerPersonName,
        planYear: this.processData.planYear,
        applicationUnit: this.processData.applicationUnit,
        projectCode: this.processData.projectCode,
        projectName: this.processData.projectName,
        specialClassFile: JSON.stringify(this.form2.data.specialClassFile),
        projectId: this.testId,
      };
      //确认操作 需求部门
      // 输入框失去焦点时的处理函数
      UpdateProjectDetail(params).then((res) => {
        if ((res.msg.code = "0000")) {
          this.getProjectDetail();
          this.$message.success("保存成功");
        }
        this.isEdit4 = false;
      });
    },
    // 专班文件下载
    zbDownload() {
      getDetailById({ id: this.testId }).then((res) => {
        let str1 = res.data.specialClassFile;
        let startIndex = str1.indexOf("mfrzh");
        let endIndex = str1.indexOf('","size"', startIndex);
        let field = str1.slice(startIndex, endIndex);

        let token = sessionStorage.getItem("token");
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${field}&access_token=${token}`
        );
      });
    },
    // 获取项目详情基本信息方法
    getProjectDetail() {
      getProjectDetail({ id: this.testId }).then((res) => {
        // projectCJDWVos
        this.SortsData = res.data.projectCJDWVos;

        console.log(this.SortsData, "sprintf");
        // 流程信息
        var newObj = {};
        for (var key in this.processData) {
          newObj[key] = res.data[key];
        }
        this.processData = newObj;
        console.log("流程信息", this.processData);
        this.getJlAndCjData();
        this.form2.data.specialClassFile = res.data.specialClassFile
          ? JSON.parse(res.data.specialClassFile)
          : [];
        if (!this.form2.data.specialClassFile) {
          this.form2.data.specialClassFile = [];
        }
        let nam = this.form2.data.specialClassFile.map((obj) => obj.name);
        if (nam.length > 0) {
          this.form2.data.downName = nam[0];
        }
      });
    },
    // 获取监理和承建单位下拉选
    getJlAndCjData() {
      getUserByRoleCode({
        roleCode: "CJDW_XMJL",
        buid: this.processData.contractUnit,
      }).then((res) => {
        this.cjdwjlOptions = res.data;
      });
      getUserByRoleCode({
        roleCode: "JLGCS",
        buid: this.processData.controlUnit,
      }).then((res) => {
        this.jlgcsOptions = res.data ? res.data : [];
      });
    },
    // 切换承建单位
    selectCJ(val) {
      console.log(val, "切换承建单位");
      this.processData.contractor = "";
      getUserByRoleCode({ roleCode: "CJDW_XMJL", buid: val }).then((res) => {
        console.log("承建单位项目经理下拉选", res.data);
        this.cjdwjlOptions = res.data;
      });
    },

    BaseCJ(item, index) {
      console.log(index);
      console.log(item);
      // 当承建单位切换时当前标段下的承建单位项目经理里面的值清楚
      // this.SortsData
      item.contractor = "";
      getUserByRoleCode({
        roleCode: "CJDW_XMJL",
        buid: item.contractUnitFullName,
      }).then((res) => {
        this.cjdwjlOptions = res.data;
      });
      // contractorName
      // contractorName
    },
    BaseXMJL(item, index) {
      console.log(item, "itemitemitem");
      console.log(item, index);
      console.log(this.SortsData, "this.SortsData");

      // contractorName
      item.contractorName = this.getAllId(this.cjdwjlOptions, item.contractor);

      // 根据获取到的index下标，把item里面的参数跟hthis.srotsData里面对应下标的数据进行替换
      this.SortsData[index] = item;
      console.log(this.SortsData, "111----");
      // this.SortsData[index].contractorName = item.contractorName;
      // this.SortsData[index].contractUnitFullName = item.contractUnitFullName;
    },
    // 切换监理
    selectJL(val) {
      this.processData.controlJfid = "";
      getUserByRoleCode({ roleCode: "JLGCS", buid: val }).then((res) => {
        this.jlgcsOptions = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.base-message-left-bottom-title {
  margin-bottom: 10px;
  font-weight: bold;
}

.base-message-box1 {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 20px;
  color: rgba(78, 89, 105, 1);
  margin-bottom: 5px;
  .base_select {
    // text-align: right;
  }
  .base_span {
    line-height: 20px;
    margin-bottom: 5px;
  }
  .span_i {
    color: red;
    border: 1px solid red;
    border-radius: 20px;
    font-size: 12px;
  }
  .span1 {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 20px;
    color: rgba(78, 89, 105, 1);
    opacity: 1;
    font-weight: 800;
  }

  .span2 {
    height: 19px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 20px;
    color: rgba(78, 89, 105, 1);
    opacity: 1;
    display: inline-block;
    margin-bottom: 16px;
    flex: 1;

    text-align: right;
    div {
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.base-message-box {
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 20px;
  color: rgba(78, 89, 105, 1);
  margin-bottom: 5px;

  .span1 {
    width: 50%;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 20px;
    color: rgba(78, 89, 105, 1);
    opacity: 1;
    margin-right: 16px;
    font-weight: 800;
  }

  .span2 {
    height: 19px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 20px;
    color: rgba(78, 89, 105, 1);
    opacity: 1;
    display: inline-block;
    margin-bottom: 16px;
    text-align: right;
    flex: 1;

    div {
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .span3 {
    display: inline-block;
    height: 19px;
    // width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    line-height: 20px;
    color: rgba(78, 89, 105, 1);
    opacity: 1;
    margin-bottom: 5px;
    margin-right: 15px;
  }
}

.projectZBtn {
  width: 100%;
  text-align: center;
  ::v-deep .el-button {
    border-radius: 4px !important;
    margin: 15px 0;
  }
}
</style>
