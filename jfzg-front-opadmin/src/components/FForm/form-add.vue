<template>
  <section class="form-config">
    <el-form
      :ref="refForm"
      :rules="rules"
      :model="form"
      label-suffix="："
      autocomplete="off"
      :label-width="(otherConfig.labelNum || 120) + 'px'"
      :validate-on-rule-change="otherConfig.validateOnRuleChange || false"
    >
      <template v-for="(item, index) in config">
        <el-form-item
          :key="'fa-item-' + index"
          :label="item.name"
          :prop="item.bind"
          :class="[
            'col-' + (item.col ? item.col : 12),
            { textarea_vertical: item.type == 'auto_textarea' },
            'relative',
            'border-box',
            item.itemClass,
          ]"
          :style="
            'padding-left:' +
            (otherConfig.labelNum || 120) +
            'px;display:' +
            item.display
          "
        >
          <div class="flexBox" v-if="item.type == 'tree'">
            <el-popover
              placement="bottom"
              trigger="click"
              v-model="item.popover"
            >
              <div class="select-tree text-right">
                <select-tree
                  :getData="item.getData"
                  v-if="item.popover"
                  :id="'select_tree_' + item.bind + '_' + index"
                  :ref="item.bind"
                  :default-params="item.defaultParam || {}"
                  :single-check="item.singleCheck || false"
                ></select-tree>
                <el-button
                  type="primary"
                  size="mini"
                  @click.native="setSelect(index)"
                  >确定</el-button
                >
              </div>
              <el-input
                slot="reference"
                type="textarea"
                readonly
                class="width-100"
                v-model="form[item.bind]"
                :autosize="{
                  minRows: item.minRows || 2,
                  maxRows: item.maxRows || 4,
                }"
              ></el-input>
            </el-popover>
          </div>
          <!--  -->
          <div
            v-if="item.type == 'switch'"
            class="flexBox"
            @click="sendEvent(item.eventName)"
          >
            <el-switch
              v-model="form[item.bind]"
              :active-text="item.active"
              :inactive-text="item.inactive"
            ></el-switch>
          </div>
          <!--  -->
          <div
            v-if="item.type == 'checkbox'"
            class="flexBox"
            @click="sendEvent(item.eventName || '')"
          >
            <el-checkbox-group v-model="form[item.bind]">
              <el-checkbox
                v-for="op in enums[item.dataList]"
                :label="op.dataValue"
                :key="op.dataValue"
                >{{ op.dataName }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <!--  -->
          <div
            v-if="item.type == 'checkboxButton'"
            class="flexBox"
            @click="callFn(item.eventName || '')"
          >
            <el-checkbox-group v-model="form[item.bind]" :max="item.max">
              <el-checkbox-button
                v-for="op in enums[item.dataList]"
                :label="op.dataValue"
                :key="op.dataValue"
                >{{ op.dataName }}</el-checkbox-button
              >
            </el-checkbox-group>
          </div>
          <!--  -->
          <div
            v-if="item.type == 'star'"
            class="flexBox ver-middle"
            @click="sendEvent(item.eventName)"
          >
            <el-popover placement="bottom" trigger="hover" v-if="item.hover">
              <div @click="sendEvent(item.eventName)">
                <div class="title">{{ item.hover }}</div>
              </div>
              <el-rate
                slot="reference"
                v-model="form[item.bind]"
                :disabled="item.disabled"
                :show-score="item.showScore || false"
                text-color="#ff9900"
              ></el-rate>
            </el-popover>
            <el-rate
              v-else
              slot="reference"
              v-model="form[item.bind]"
              :disabled="item.disabled"
              :show-score="item.showScore || false"
              @change="validatorField(item)"
              :score-template="form[item.bind] + '分'"
              text-color="#ff9900"
            ></el-rate>
          </div>
          <!--  -->
          <div
            v-if="item.type == 'event'"
            class="flexBox"
            @click="sendEvent(item.eventName)"
          >
            <el-input
              size="small"
              :placeholder="item.placeholder"
              readonly
              v-model="form[item.bind]"
              :disabled="item.disabled"
            >
              <i slot="suffix" class="el-input__icon el-icon-caret-bottom"></i>
            </el-input>
          </div>
          <!--  -->
          <div v-else-if="item.type == 'readonly'">
            <el-input
              size="small"
              readonly
              v-model="form[item.bind]"
            ></el-input>
          </div>
          <!--  -->
          <div v-else-if="item.type == 'contentFile'">
            <div class="width900">
              <div
                class="expand text-right more_less"
                @click="expand = !expand"
                v-show="
                  item.showExpand && form[item.bind].length > (item.colNum || 3)
                "
              >
                <span class="expand_class" v-show="!expand">展开</span>
                <span class="expand_class" v-show="expand">收起</span>
                <img
                  :src="moreImg"
                  alt
                  class="uploader_class"
                  v-show="!expand"
                />
                <img
                  :src="lessImg"
                  alt
                  class="uploadImg_class"
                  v-show="expand"
                />
              </div>

              <div
                class="nofloat"
                v-for="(item, index) in form[item.bind]"
                :key="index"
                v-show="index < (item.colNum || 3) || expand"
              >
                <span class="uploader">
                  <img :src="linkImg" alt class="uploader_class" />
                  <span class="uploader_title">
                    {{ fieldSubStr(item.name, item.maxFeild) }}
                  </span>
                  <img
                    :src="seeImg"
                    @click="seeclick(item)"
                    alt
                    class="uploader_class"
                  />
                  <img
                    :src="uploadImg"
                    @click="download(item)"
                    alt
                    class="uploadImg_class"
                  />
                </span>
              </div>
            </div>
          </div>
          <!--  -->
          <!-- input -->
          <el-input
            v-else-if="item.type == 'text'"
            :disabled="item.disabled"
            size="small"
            v-model.trim="form[item.bind]"
            :placeholder="item.placeholder"
            :maxlength="item.maxLength"
            clearable
            :readonly="readonlyInput"
            @focus="cancelReadOnly('readonlyInput')"
            :class="item.className ? item.className : ''"
          ></el-input>
          <slot
            v-if="item.type == 'text' && item.slotName"
            :name="item.slotName"
          ></slot>
          <!--  -->
          <el-radio-group
            v-model="form[item.bind]"
            :disabled="item.disabled"
            :class="{ bdRadioBox: item.radioBlock }"
            @change="callFn(item, $event)"
            v-else-if="item.type == 'radio'"
          >
            <!-- 如何兼容竖向 style="display:block;" -->
            <el-radio
              v-for="op in enums[item.dataList]"
              :class="{ dsBlock: item.radioBlock }"
              :label="op[item.key] || op.dataValue"
              :key="op[item.key] || op.dataValue"
              >{{ op.dataName }}</el-radio
            >
            <div>
              <!-- 单选下级列表 -->
              <div
                v-for="(redChild, i) in item.radioList"
                :key="'radioList' + i"
              >
                <el-form-item
                  id="radios"
                  :key="'radioList' + i"
                  :label="redChild.name"
                  :prop="redChild.bind"
                >
                  <el-radio-group
                    v-model="form[redChild.bind]"
                    :disabled="redChild.disabled"
                    v-if="redChild.type == 'radio'"
                  >
                    <el-radio
                      v-for="op in enums[redChild.dataList]"
                      :label="op.dataValue"
                      :key="op.dataValue"
                      >{{ op.dataName }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
          </el-radio-group>

          <!-- input number第一种类型-->
          <el-input
            v-else-if="item.type == 'number'"
            type="number"
            :disabled="item.disabled"
            size="small"
            v-model.number="form[item.bind]"
            :placeholder="item.placeholder"
            clearable
          ></el-input>
          <!--第二种类型-->
          <el-form-item v-if="item.type == 'number2'">
            <el-input-number
              style="width: 120px"
              v-model="form[item.bind]"
              controls-position="right"
              :min="1"
              prop="serverSize"
              size="small"
            ></el-input-number>
          </el-form-item>
          <!-- 密码框 -->
          <el-input
            v-else-if="item.type == 'password'"
            type="password"
            :disabled="item.disabled"
            size="small"
            :show-password="item.showPassword"
            v-model="form[item.bind]"
            :placeholder="item.placeholder"
            clearable
          ></el-input>
          <!-- select -->
          <el-select
            v-else-if="item.type == 'select'"
            size="small"
            :disabled="item.disabled"
            :multiple="item.multiple"
            v-model="form[item.bind]"
            :placeholder="item.placeholder"
            :popper-append-to-body="!item.popperAppendToBody"
            @change="
              (val) => {
                item.change && item.change(val, item);
              }
            "
            :style="item.multiple ? 'width:100%' : ''"
            filterable
            clearable
          >
            <el-option
              v-for="(op, index) in enums[item.dataList]"
              :key="index"
              :label="item.label ? op[item.label] : op.dataName"
              :value="item.value ? op[item.value] : op.dataValue"
            ></el-option>
          </el-select>

          <!--arrSelect -->
          <el-select
            v-else-if="item.type == 'arrSelect'"
            size="small"
            :disabled="item.disabled"
            :multiple="item.multiple"
            v-model="form[item.bind]"
            :placeholder="item.placeholder"
            @change="
              (val) => {
                item.change && item.change(val, item);
              }
            "
            :style="item.multiple ? 'width:100%' : ''"
            filterable
            clearable
          >
            <el-option
              v-for="(op, index) in enums[item.dataList]"
              :key="'arrselect_' + index"
              :label="item.label ? op[item.label] : op.dataName"
              :value="item.value ? op[item.value] : op.dataValue"
            ></el-option>
          </el-select>

          <!-- selectCity -->
          <!-- 编辑页面的省市 -->

          <el-cascader
            class="cityCascader"
            v-else-if="
              item.isEdit
                ? item.type == 'selectCity' &&
                  form[item.bind] &&
                  form[item.bind].length > 0
                : item.type == 'selectCity'
            "
            :props="selectCityConfig"
            v-model="form[item.bind]"
          ></el-cascader>

          <el-select
            v-else-if="item.type == 'selectLabel'"
            size="small"
            :multiple="item.multiple"
            v-model="form[item.bind]"
            :placeholder="item.placeholder"
            @change="changSelect(item.selectLabel, $event)"
            :style="item.multiple ? 'width:100%' : ''"
            filterable
            clearable
          >
            <el-option
              v-for="op in enums[item.dataList]"
              :key="op.dataValue"
              :value="op.dataValue"
              >{{ op.dataName }}</el-option
            >
          </el-select>
          <el-input
            v-else-if="item.type == 'textarea'"
            type="textarea"
            :readonly="item.readonly"
            :disabled="item.disabled"
            size="small"
            resize="none"
            :maxlength="item.maxlength || 500"
            :show-word-limit="item.showWordLimit || true"
            :rows="item.row || 5"
            v-model="form[item.bind]"
            :placeholder="item.placeholder"
            clearable
          ></el-input>
          <el-input
            v-else-if="item.type == 'auto_textarea'"
            type="textarea"
            size="small"
            resize="none"
            :maxlength="item.maxlength || ''"
            :show-word-limit="true"
            :rows="form[item.bind] ? item.row || 5 : 1"
            v-model="form[item.bind]"
            :placeholder="item.placeholder"
            clearable
          ></el-input>
          <slot name="elInput" v-if="item.elInput"></slot>
          <!-- year -->
          <el-date-picker
            v-else-if="item.type == 'year'"
            type="year"
            size="small"
            :disabled="item.disabled"
            v-model="form[item.bind]"
            :placeholder="item.placeholder"
            format="yyyy 年"
            value-format="yyyy"
          ></el-date-picker>
          <!-- date -->
          <el-date-picker
            v-else-if="item.type == 'date'"
            :picker-options="{
              disabledDate: item.disabledDate || disabledDate,
            }"
            type="date"
            size="small"
            :disabled="item.disabled"
            v-model="form[item.bind]"
            :placeholder="item.placeholder"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <!-- datatime -->
          <el-date-picker
            v-else-if="item.type == 'datetime'"
            type="datetime"
            size="small"
            :disabled="item.disabled"
            v-model="form[item.bind]"
            :placeholder="item.placeholder"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          <!--daterange-->
          <el-date-picker
            v-else-if="item.type == 'daterange'"
            type="daterange"
            :picker-options="pickerOptions"
            size="small"
            :disabled="item.disabled"
            v-model="form[item.bind]"
            range-separator=" - "
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>

          <!--datetimerange-->
          <el-date-picker
            v-else-if="item.type == 'datetimerange'"
            type="datetimerange"
            size="small"
            :disabled="item.disabled"
            v-model="form[item.bind]"
            range-separator=" - "
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          <!--upload-->
          <div v-if="item.type == 'bigUpload'">
            <SrBigUpload
              ref="srUpload"
              @uploadSuccess="
                (data) => {
                  BigFileUploadSuccess(data, item);
                }
              "
              @resume="
                (data) => {
                  clearValidateItem(item);
                }
              "
              @startUpload="
                (data) => {
                  clearValidateItem(item);
                }
              "
              @download="
                (data) => {
                  this.download && this.download(data);
                }
              "
              :item="item"
              :form="form"
              :fileList="
                form[item.bind] &&
                Array.isArray(form[item.bind]) &&
                form[item.bind].length
                  ? form[item.bind]
                  : item.fileList
              "
            ></SrBigUpload>
          </div>
          <div v-else-if="item.type == 'upload'">
            <el-upload
              :ref="`uploadref${index}`"
              class="upload-middle"
              :action="itemurl"
              :headers="myHeaders"
              :accept="item.fileType"
              :disabled="item.disabled"
              :before-upload="
                (res) => {
                  return callBeforeUpLoad(item, res, 'loading');
                }
              "
              :on-success="
                (res, file, fileList) => {
                  callSuccessFn(item, res, file, fileList);
                }
              "
              :on-error="
                (err, file, fileList) => {
                  callErrorFn(item);
                }
              "
              :show-file-list="false"
            >
              <div class="upload_content">
                <el-button
                  class="upload-before_tip"
                  v-if="!item.isshow"
                  :disabled="item.disabled"
                >
                  <svg-icon icon-class="icon_upload" class="uploadImg_before" />
                  <span class="upload_title">上传文件</span>
                </el-button>
                <div @click.stop slot="tip" class="tip_all" v-if="item.fileTip">
                  <svg-icon icon-class="icon_info" />
                  <span class="up_tip">{{ item.fileTip }}</span>
                </div>
              </div>
            </el-upload>
            <ul @click.stop class="upload_list">
              <li
                class="list_item"
                v-for="value in form[item.bind] &&
                Array.isArray(form[item.bind]) &&
                form[item.bind].length
                  ? form[item.bind]
                  : item.fileList"
                :key="value.id"
              >
                <svg-icon icon-class="icon_fujian" class="uploader_class" />
                <span
                  class="upload_title"
                  :title="value.name || value.fileName"
                  >{{ value.name || value.fileName }}</span
                >
                <svg-icon
                  @click.stop="seeclick(value)"
                  icon-class="up_watch"
                  class="uploader_class"
                />
                <svg-icon
                  v-if="!item.deleteIconHide"
                  @click.stop="callRemoveFn(value, item)"
                  icon-class="up_delete"
                  class="up_delete"
                />
              </li>
              <li class="list_item" v-if="item.loading">
                <i class="el-icon-loading"></i>
                <span class="upload_title">上传中</span>
                <svg-icon
                  @click.stop="stopUpload(`uploadref${index}`, item)"
                  icon-class="up_delete"
                  class="up_delete"
                />
              </li>
            </ul>
          </div>
          <slot name="upLoadSlot" v-if="item.upLoadSlot"></slot>
          <!-- 上传图片另一个格式 -->
          <div class="uploadImgBox" v-if="item.type == 'uploadImg'">
            <el-upload
              ref="uploadref"
              :file-list="item.fileList2"
              :limit="item.limit || 100"
              :action="item.url || itemurl"
              list-type="picture-card"
              :disabled="item.disabled"
              :on-success="
                (res, file, fileList) => imgSuccessFn(item, res, file, fileList)
              "
              :on-remove="(res) => imgRemoveFn(item, res)"
              :before-upload="(res) => callBeforeUpLoad(item, res)"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="tipInfo">
              <img src="../../assets/xxts.png" />
              <span>{{ item.tipInfo }}</span>
            </div>
          </div>
          <!-- 上传头像 -->
          <div class="uploadImgBox" v-if="item.type == 'uploadAvatar'">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              accept=".jpg, .png"
              :action="item.url || imgUrl"
              :on-success="(res) => avatarSuccessFn(item, res)"
              :on-remove="(res) => imgRemoveFn(item, res)"
              :before-upload="(res) => callBeforeUpLoad(item, res)"
            >
              <img
                v-if="form[item.bind]"
                :src="imgBaseUrl + form[item.bind]"
                class="avatar"
              />
              <div class="uploadAva" v-else>
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <span class="upload_tip">
                  {{ item.uploadTip || "点击上传" }}
                </span>
              </div>
            </el-upload>
            <div class="tipInfo">
              <img src="../../assets/xxts.png" />
              <span>{{ item.tipInfo }}</span>
            </div>
          </div>
          <!--  -->
          <el-cascader
            v-else-if="item.type == 'cascader'"
            :ref="item.ref"
            style="width: 100%"
            clearable
            :placeholder="item.placeholder"
            :options="enums[item.dataList]"
            v-model="form[item.bind]"
            :props="getCascaderProp(item)"
            filterable
            size="small"
            @change="
              (res) => {
                callSuccessFn(item.select, res);
              }
            "
            :show-all-levels="item.showAllLevels || false"
          ></el-cascader>
          <el-cascader
            v-if="item.type == 'projectTypeCascader'"
            style="width: 100%"
            :options="item.dataList ? enums[item.dataList] : enums[item.data]"
            v-model="form[item.bind]"
            filterable
            @change="
              (val) => {
                item.change && item.change(val, item);
              }
            "
            v-bind="item"
          ></el-cascader>
          <!--  -->
          <el-button
            v-else-if="item.type == 'button'"
            v-for="(btn, index) in item.buttonArr"
            :key="index"
            :type="btn.type ? btn.type : ''"
            size="small"
            @click="callFn(btn)"
            >{{ btn.name }}</el-button
          >
          <!--  带提示输入框-->
          <el-autocomplete
            v-else-if="item.type == 'autocomplete'"
            class="inline-input"
            v-model="form[item.bind]"
            :fetch-suggestions="item.querySearch"
            :placeholder="item.placeholder"
            :trigger-on-focus="false"
            @select="() => {}"
          ></el-autocomplete>
          <!--  -->
          <div class="autocomplate" v-else-if="item.type == 'autoCompleteList'">
            <el-autocomplete
              class="inline-input width-100"
              size="small"
              v-model="temporary[item.temporary || item.bind]"
              @blur="temporary[item.temporary || item.bind] = ''"
              @change="() => {}"
              :fetch-suggestions="
                (str, cb) => {
                  item.querySearch && item.querySearch(str, cb, item);
                }
              "
              :placeholder="item.placeholder"
              :trigger-on-focus="false"
              @select="
                (row) => {
                  autoCompleteList(row, item);
                }
              "
              @keydown.native="
                (e) => {
                  autoCompleteList(
                    { value: temporary[item.temporary || item.bind] },
                    item,
                    e
                  );
                }
              "
            ></el-autocomplete>
            <div
              class="tag-lis"
              v-if="form[item.bind] && form[item.bind].length > 0"
            >
              <el-tag
                v-for="(tag, index) in form[item.bind]"
                :key="index"
                closable
                @close="form[item.bind].splice(index, 1)"
                >{{ tag.value == undefined ? tag : tag.value }}</el-tag
              >
            </div>
          </div>
          <!-- input 尾文字 -->
          <span class="trailTypeface" v-else-if="item.trailName">{{
            item.trailName
          }}</span>
          <slot v-else-if="item.type == 'slot'" :name="item.slotName"></slot>
        </el-form-item>
      </template>
      <el-form-item
        v-if="button && button.length"
        style="width: 100%; text-align: center"
      >
        <el-button
          v-for="(btn, index) in button"
          :key="index"
          :type="btn.type ? btn.type : ''"
          size="small"
          @click="callFn(btn)"
          >{{ btn.name }}</el-button
        >
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
import config from "@/settings.js";
// import region from "@/components/region/province.vue";
// import serverInfo from "@/components/FForm/serverInfo";
import { getRules } from "@/utils/rules.js";
// import { api_queryListJfDictcode } from "@/api/zhuanjia/checkList";
import { getStorageToken, getStorageTokenType } from "@/utils/user-vali";
import SrBigUpload from "@/components/SrBigUpload/SrBigUpload.vue";
const ruleItem = getRules();
export default {
  components: {
    SrBigUpload,
    // region,
    // serverInfo
  },
  watch: {
    form: {
      deep: true,
      handler(n) {
        this.createRulesRequired();
      },
    },
  },
  props: {
    pickerOptions: {
      type: [Object],
    },
    otherConfig: {
      type: [Object],
      default() {
        return {
          labelNum: 130,
          column: 2,
        };
      },
    },
    config: {
      type: Array,
    },
    button: {
      type: Array,
    },
    form: {
      type: [Object, Array],
    },
    refForm: {
      type: String,
      default: "refForm",
    },
    enums: {
      type: Object,
    },
    column: {
      type: Number,
    },
    otherRule: {
      type: Object,
    },
  },

  data() {
    return {
      passwordInput: true,
      readonlyInput: true,
      imgBaseUrl: config.imgBaseUrl,
      temporary: {}, // 不参与业务的组件内部临时变量
      fileList: [],
      rules: {},
      isOK: false,
      expand: false,
      upImg: require("../../assets/upload/up_before.png"),
      tipImg: require("../../assets/upload/tip.png"),
      lessImg: require("../../assets/upload/showless.png"),
      moreImg: require("../../assets/upload/showmore.png"),
      linkImg: require("../../assets/upload/link.png"),
      seeImg: require("../../assets/upload/see.png"),
      uploadImg: require("../../assets/upload/upload.png"),
      itemurl: config.baseUrl + "/api/file/upload",
      myHeaders: { Authorization: "" },
      selectCityConfig: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, value } = node;
          if (level === 0) {
            api_queryListJfDictcode({
              jsonStr: { levelcode: "1", typeCode: "LOC" },
            }).then((res) => {
              let nodes = [];
              res.data.list.forEach((item) => {
                nodes.push({
                  value: item.code,
                  label: item.cnname,
                  leaf: false,
                });
              });
              resolve(nodes);
            });
          } else if (level === 1) {
            api_queryListJfDictcode({
              jsonStr: {
                levelcode: "2",
                typeCode: "LOC",
                parentCode: value,
              },
            }).then((res) => {
              let nodes = [];
              res.data.list.forEach((item) => {
                nodes.push({
                  value: item.code,
                  label: item.cnname,
                  leaf: true,
                });
              });
              resolve(nodes);
            });
          }
        },
      },
    };
  },
  mounted() {
    // let access_token = getStorageToken();
    // let access_token = "bearer e174742c-51d6-428d-8e2c-c255ee826513"
    // this.itemurl =
    //   config.baseUrl +
    //   `/jfzg/file/api/file/partFileUpload?access_token=${access_token}`

    if (process.env.NODE_ENV === "development") {
      this.myHeaders["Authorization"] =
        "bearer e174742c-51d6-428d-8e2c-c255ee826513";
    } else {
      let token = getStorageToken();
      if (token) {
        //给请求头添加token
        this.myHeaders["Authorization"] = getStorageTokenType() + " " + token;
      }
    }
    this.createRulesRequired();
    this.initTemporary();
  },
  methods: {
    // 分片上传成功
    BigFileUploadSuccess(fileList, item) {
      this.$set(this.form, item.bind, fileList);
      console.log(fileList);
      console.log(this.form[item.bind]);
      this.$set(item, "fileList", fileList);
    },

    // 清除单字段校验
    clearValidateItem(item) {
      this.$refs[this.refForm].clearValidate([item.bind]);
    },
    cancelReadOnly(item) {
      this.readonlyInput = false;
    },
    stopUpload(ref, item) {
      console.log(ref, item);
      this.$refs[ref][0].abort();
      this.$set(item, "loading", false);
      this.$set(item, "disabled", false);
    },
    getSelectCityConfig(value) {
      return this.selectCityConfig;
    },
    /**
     * 单字段校验
     */
    validatorField(item) {
      this.$refs[this.refForm].validateField(item.bind);
    },
    /**
     * 删除资源分配
     */
    deleteServer(bind, index) {
      if (bind.length > 1) {
        bind.splice(index, 1);
      } else {
        this.$message({
          message: `最少保留一个!`,
          type: "warning",
        });
      }
    },
    /**
     * 区域切换
     */
    regionChange(row, item) {
      this.form[item.bind] = row.dataValue;
      (item.change || (() => {}))(row, item);
    },
    /**
     * 初始化临时变量
     */
    initTemporary() {
      let obj = {};
      this.config.map((res) => {
        if (res.temporary) {
          obj[res.temporary || res.bind] = "";
        }
      });
      this.temporary = obj;
      setTimeout(() => {
        let nodeList = document.querySelectorAll(
          "li.el-upload-list__item.is-success .el-upload-list__item-name"
        );
        for (let i = 0; i < nodeList.length; i++) {
          nodeList[i].setAttribute("title", nodeList[i].innerText);
        }
      }, 1000);
    },
    /**
     * 选取输入建议后执行
     * @param {Object} row 选取的对象
     * @param {Object} item 区分是哪个输入框
     * @param {Object} e 键盘事件
     */
    autoCompleteList(row, item, e) {
      console.log(row, item);
      console.log(this.form[item.bind]);
      if (e && e.keyCode == 13) {
        if (item.keydown) {
          item.keydown(row, item);
        }
      }
      if ((e && e.keyCode == 13) || !e) {
        if (this.form[item.bind] && this.form[item.bind].constructor == Array) {
          //判断是否已存在输入的值 存在则不添加并提示
          if (row.value.trim()) {
            let flag = this.form[item.bind].find((item) => {
              return item.value == row.value.trim();
            });
            if (flag) {
              this.$message.warning(`${item.name}不可以重复！`);
            } else {
              this.form[item.bind].push(row);
            }
          }
        } else {
          this.form[item.bind] = [row];
        }
        this.temporary[item.temporary || item.bind] = "";
      }
    },
    /**
     * 校验表单，通过返回表单，否则返回false
     */
    validate() {
      let flag = false;
      this.$refs[this.refForm].validate((valid) => {
        if (valid) {
          flag = this.form;
        }
      });
      return flag;
    },
    /**
     * 选择id,带出label
     */
    changSelect(name, e) {
      this.$emit("selectLabel", name, e);
    },
    /**
     * 创建表单校验规则
     */
    createRulesRequired() {
      let obj = {};
      this.config.map((res) => {
        // 必填项校验
        if (res.bind) {
          let arr = res.required
            ? [Object.assign({}, ruleItem.requiredText[0])]
            : [];
          if (res.required) {
            if (res.trigger) {
              arr[0].trigger = res.trigger;
            }
            if (arr[0].required) {
              arr[0].message = res.required;
            }
          }
          obj[res.bind] = arr;
        }
      });
      this.otherRules(obj);
    },
    /**
     * 其他校验
     * @param {Object} obj 基础校验完成的对象
     */
    otherRules(obj) {
      this.config.map((res) => {
        if (res.rules) {
          // 有额外校验
          for (let key in res.rules) {
            if (key.indexOf("maxLength") != -1) {
              // 长度类型
              let validator = Object.assign({}, ruleItem["maxLength"][0]);
              let arr = [validator];
              arr[0].message = res.rules[key];
              arr[0].trigger = res.trigger || arr[0].trigger;
              arr[0].max = key.split("maxLength_")[1] - 0;
              obj[res.bind] = [...obj[res.bind], ...arr];
            } else if (key.indexOf("regular") != -1) {
              // 正则匹配
              let validator = Object.assign({}, ruleItem["regular"][0]);
              let arr = [validator];
              arr[0].message = res.rules[key];
              arr[0].trigger = res.trigger || arr[0].trigger;
              arr[0].pattern = ruleItem.regularList[key.split("regular_")[1]];
              obj[res.bind] = [...obj[res.bind], ...arr];
            } else if (key.indexOf("validator") != -1) {
              // 自定义事件
              let validator = Object.assign({}, ruleItem["validator"][0]);
              let arr = [validator];
              arr[0].trigger = res.trigger || arr[0].trigger;
              arr[0].validator = res.rules[key];
              obj[res.bind] = [...obj[res.bind], ...arr];
            } else {
              // 其他rule.js里有的校验类型
              let item = Object.assign({}, ruleItem[key][0]);
              let arr = [];
              arr.push(item);
              arr[0].message = res.rules[key];
              arr[0].trigger = res.trigger || arr[0].trigger;
              obj[res.bind] = [...obj[res.bind], ...arr];
            }
          }
        }
      });

      this.rules = obj;
    },
    /**
     * 时间选择限制
     */
    disabledDate() {
      return false;
    },
    /**
     * 树状选择确定事件
     */
    setSelect(index) {
      let arr =
        this.$store.state.select[
          "select_tree_" + this.config[index].bind + "_" + index
        ] || [];
      this.$store.dispatch("select/tree_check", {
        key: ["select_tree_" + this.config[index].bind + "_" + index],
        value: null,
      });
      let name = [];
      let ids = [];
      arr.map((res) => {
        name.push(res.label);
        ids.push(res.id);
      });
      name = name.length > 0 ? name.join(",") : "";
      ids = ids.length > 0 ? ids.join(",") : "";
      this.form[this.config[index].bind] = name;
      this.form[this.config[index].bindId] = ids;
      this.$set(this.config[index], "selectList", arr);
      this.$set(this.config[index], "popover", false);
    },
    sendEvent(eventName) {
      this.$emit("eventNotify", eventName);
    },

    resetForm() {
      //重置
      this.$refs[this.refForm].resetFields();
    },
    getCascaderProp(item) {
      if (item.props && !item.props.emitPath && !item.props.value) {
        item.props.value = "svalue";
        return item.props;
      }
      return item.props || {};
    },
    columnFn(item) {
      if (this.otherConfig.column) {
        return ["width:", 100 / this.otherConfig.column - 1, "%"].join("");
      }
    },
    /**
     * 附件名称截取
     * @param {String}  文件名
     */
    fieldSubStr(name, maxFeild) {
      return name.length > (maxFeild || 15)
        ? name.substr(0, maxFeild || 15) + "..."
        : name;
    },
    // 头像上传成功方法
    avatarSuccessFn(item, res) {
      if (!res.data) {
        this.$message.error("上传失败!");
        return false;
      }
      this.$message.success("上传成功!");
      this.$set(this.form, item.bind, res.data.fileInfo.id);
    },
    /**
     * 图片上传
     * */
    imgSuccessFn(item, res, file, fileList) {
      if (!res.data) {
        this.$message.error("上传失败!");
        fileList.pop();
        return false;
      }
      this.$message.success("上传成功!");
      item.fileList.push(res.data.fileInfo);
      this.$set(this.form, item.bind, item.fileList);
    },
    imgRemoveFn(item, res) {
      if (res && res.status === "success") {
        item.fileList = item.fileList.filter((r) => {
          return r.id != res.response.data.fileInfo.id;
        });
      }
      this.$set(this.form, item.bind, item.fileList);
    },
    /***
     * 删除附件
     */
    callRemoveFn(value, item) {
      if (
        this.form[item.bind] &&
        Array.isArray(this.form[item.bind]) &&
        this.form[item.bind].length
      ) {
        this.form[item.bind] = this.form[item.bind].filter((r) => {
          return r.id != value.id;
        });
        this.$set(item, "fileList", this.form[item.bind]);
      } else {
        item.fileList = item.fileList.filter((r) => {
          return r.id != value.id;
        });
        this.$set(this.form, item.bind, item.fileList);
        this.$set(item, "fileList", item.fileList);
      }
    },
    callExceedFn(item, res) {
      this.$message({
        message: "上传文件不能超过" + (item.limit || 1) + "个！",
        type: "warning",
        showClose: true,
        duration: 2000,
      });
    },
    /**
     * 上传成功时调用
     */
    callSuccessFn(item, res, file, fileList) {
      console.log("item", item, res);
      let flag = false;
      if (!res.data) {
        this.$message.error("上传失败!");
        fileList.pop();
        return false;
      }
      if (item.fileList) {
        // 过滤重名的文件
        item.fileList = item.fileList.filter((val) => {
          if (val.name == res.data.fileInfo.name) {
            flag = true;
          }
          return val.name != res.data.fileInfo.name;
        });
        item.fileList.push(res.data.fileInfo);
      } else {
        item.fileList = [res.data.fileInfo];
      }
      flag
        ? this.$message.warning("文件名重复,已自动覆盖同名文件!")
        : this.$message.success("上传成功!");
      if (item.bind) {
        // 为表单绑定的key添加上value
        this.$set(this.form, item.bind, item.fileList);
        this.validatorField(item);
      }
      // 为上传之后的文件列表增加title提示
      setTimeout(() => {
        let nodeList = document.querySelectorAll(
          "li.el-upload-list__item.is-success .el-upload-list__item-name"
        );
        for (let i = 0; i < nodeList.length; i++) {
          if (!nodeList[i].getAttribute("title")) {
            nodeList[i].setAttribute("title", res.data.fileInfo.name);
          }
        }
      }, 1000);
    },
    callErrorFn(item, res) {
      this.$message.error("上传失败!");
    },
    /**
     * 上传文件之前验证大小和文件类型
     */
    callBeforeUpLoad(item, file) {
      //验证大小,格式
      //fileType是字符串
      item.fileType =
        item.fileType ||
        "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip";
      item.fileSize = item.fileSize || 50;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      let type = item.fileType.split(",");
      let index = type.indexOf(testmsg);
      if (type.indexOf(testmsg) != -1 || item.fileType == "*") {
        const extension = testmsg === type[index];
        const isLt2M = file.size / 1024 / 1024 < item.fileSize;
        if (!extension && item.fileType != "*") {
          this.$message({
            message: `上传文件只能是${item.fileType}格式!`,
            type: "warning",
          });
        }
        if (!isLt2M) {
          this.$message({
            message: `上传文件大小不能超过 ${item.fileSize || "50"}MB!`,
            type: "warning",
          });
        }
        return (extension || item.fileType == "*") && isLt2M;
      } else {
        this.$message({
          message: `上传文件只能是${item.fileType}格式!`,
          type: "warning",
        });
        return false;
      }
    },
    callFn(btn, $event) {
      //操作事件
      if (btn.method && btn.method.constructor == Function) {
        // 兼容以前，扩展传入fn方式
        btn.method(btn, this.form);
        return;
      }
      let sum = 0;
      let obj = this.getDeepMethod(this.$parent, btn.method, sum, 10);
      if (obj.parent && obj.method) {
        obj.method.call(obj.parent, $event, this.form, this.config);
      }
    },
    // 递归找method
    getDeepMethod(parent, method, sum, limit) {
      sum++;
      if (!parent) {
        return {};
      } else if (sum == limit) {
        return {};
      } else if (parent[method]) {
        return {
          parent,
          method: parent[method],
        };
      } else {
        return this.getDeepMethod(parent.$parent, method);
      }
    },
    // 下载
    download(item) {
      window.open(
        `${config.baseUrl}/csportalsite/api/file/download?id=${item.id}`
      );
    },
    // 预览
    seeclick(item) {
      let type = "";
      if (item.fileName) {
        type = item.fileName.split(".").pop();
      } else {
        type = item.name.split(".").pop();
      }
      if (["zip", "rar"].includes(type)) {
        window.open(
          `${config.baseUrl}/csportalsite/api/file/download?id=${item.id}`
        );
      } else {
        window.open(
          `${config.baseUrl}/csportalsite/api/file/docapi/view/?fileId=${item.id}`
        );
      }
    },
  },
};
</script>
<style lang="scss">
.cityCascader {
  width: 100% !important;
  .el-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
}
.bdRadioBox {
  border: 1px solid rgba(209, 225, 236, 1);
  width: 233%;
  padding: 20px;
}
.dsBlock {
  display: block;
  margin-bottom: 10px;
}

.tips2 {
  text-align: left;
  height: 40px;
  margin-top: 20px;
  border-radius: 2px;
  border: 1px solid #ffaa00;
  background: rgba(255, 170, 0, 0.1);
  padding: 0 10px;
  color: #ffaa00;
  font-size: 12px;
  span.f1 {
    color: #333;
    display: inline-block;
    margin-left: 5px;
  }
  span.f2 {
    margin-left: 5px;
    color: #666;
  }
}

.form-config {
  .col-24 {
    width: 100%;
  }
  .col-12 {
    width: 50%;
  }
  .col-7 {
    width: 30%;
  }
  .el-form-item__content {
    position: relative;

    // input后面尾字体
    .trailTypeface {
      position: absolute;
      right: -20px;
      top: 0;
    }
  }
  .el-form-item {
    position: relative;
    margin-bottom: 16px;
    padding-left: 0 !important;
    .el-input,
    .el-select {
      width: 100%;
    }
  }

  .el-form--inline .el-form-item {
    margin-right: 0;
    padding-right: 10px;
  }
  .el-form-item_c_label {
    text-align: right;
    // position: absolute;
    // top: 0;
    // left: 0;
    // color: #007aff !important;
  }

  .ver-middle {
    padding-top: 10px;
  }
  .up_tip {
    height: 20px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(153, 153, 153, 1);
    line-height: 20px;
  }
  // .upload_title {
  //   width: 84px;
  //   height: 19px;
  //   font-size: 14px;
  //   color: rgba(102, 102, 102, 1);
  //   line-height: 19px;
  //   position: relative;
  //   top: -6px;
  //   left: 8px;
  // }
  .tip_all {
    display: inline-block;
    height: 40px;
    cursor: initial;
  }

  .uploadImg_class {
    margin-left: 30px;
    margin-right: 3px;
    position: relative;
    top: 2px;
  }
  .upload-middle {
    .el-upload-list__item {
      display: inline-block;
      margin-right: 8px;
      height: 36px;
      background: #e6f7ff;
      border-radius: 2px;
      border: 1px solid #d4f0ff;
      width: auto;
      line-height: 36px;
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-icon-document {
      font-family: "iconfont" !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .el-icon-close {
      font-family: "iconfont" !important;
      font-size: 10px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .el-icon-document:before {
      content: "\e636";
    }
    .el-icon-close:before {
      content: "\e624";
      position: relative;
      top: 8px;
    }
  }
  // .upload-before_tip {
  //   width: auto;
  //   height: 40px;
  //   background: rgba(255, 255, 255, 1);
  //   border-radius: 2px;
  //   border: 1px solid rgba(209, 225, 236, 1);
  // }

  // .uploader_class {
  //   margin: 10px 0px 0px 12px;
  // }
  .uploadImg_class {
    margin: 10px 0px 0px 5px;
    position: relative;
    top: -1px;
  }
  .uploader_title {
    top: -4px;
    left: 6px;
    position: relative;
  }
  .width900 {
    /*width: 900px;*/
    position: relative;
  }
  .width900::after {
    content: "";
    display: block;
    clear: both;
  }
  .nofloat {
    float: left;
  }
  .expand_class {
    width: 28px;
    height: 22px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(0, 122, 255, 1);
    line-height: 22px;
  }
  .more_less {
    position: absolute;
    right: -50px;
    top: 14px;
  }
  .el-checkbox-button {
    span {
      border: 1px solid rgba(230, 230, 230, 1);
      padding: 5px;
      margin: 5px;
      border-radius: 2px !important;
    }
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background-color: #bae7ff;
    color: #007aff;
    border: 1px solid #007aff;
  }
  .uploadImgBox {
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 16px;
    display: flex;
    align-items: center;
    .tipInfo {
      margin-left: 20px;
      span {
        margin-left: 10px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }
  }

  #radios {
    position: relative;

    .el-form-item__content {
      padding-left: 120px;
    }
  }
  .upload_content {
    display: flex;
    align-items: center;
    .tip_all {
      display: flex;
      align-items: center;
      margin-left: 30px;
    }
  }
}
</style>
<style lang="scss" scoped>
.avatar-uploader /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/.el-upload:hover {
  border-color: #409eff;
}
// .avatar-uploader-icon {
//   font-size: 28px;
//   color: #8c939d;
//   width: 178px;
//   height: 178px;
//   line-height: 178px;
//   text-align: center;
// }
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: contain;
}
/deep/ .el-form-item__label {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
@import "./form-add.scss";
</style>
