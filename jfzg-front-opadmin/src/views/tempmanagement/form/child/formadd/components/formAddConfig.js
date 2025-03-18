export const comType = {
	input: "单行文本",
	switch: "开关",
	radio: "单选框",
	checkbox: "多选框",
	number: "计数器",
	select: "下拉框",
	dialogSelect: "dialog选择框",
	textarea: "多行文本",
	editor: "富文本",
	dateSelect: "日期",
	dateRelevancy: "日期范围",
	upload: "文件上传",
	star: "评分",
	duration: "时长录入",
	tag: "标签"
};
export const colList = {
	col: [
		{
			label: "6列",
			value: 6,
		},
		{
			label: "8列",
			value: 8,
		},
		{
			label: "12列",
			value: 12,
		},
		{
			label: "24列",
			value: 24,
		},
	],
	resize: [
		{
			label: "none",
			value: "none",
		},
		{
			label: "both",
			value: "both",
		},
		{
			label: "horizontal",
			value: "horizontal",
		},
		{
			label: "vertical",
			value: "vertical",
		},
	],
	timeType: [
		{
			label: "year",
			value: "year",
		},
		{
			label: "month",
			value: "month",
		},
		{
			label: "date",
			value: "date",
		},
		{
			label: "dates",
			value: "dates",
		},
		{
			label: "week",
			value: "week",
		},
		{
			label: "datetime",
			value: "datetime",
		},
		{
			label: "datetimerange",
			value: "datetimerange",
		},
		{
			label: "daterange",
			value: "daterange",
		},
		{
			label: "monthrange",
			value: "monthrange",
		},
	],
	'controls-position': [
		{
			label: "两端",
			value: "-",
		},
		{
			label: "右边",
			value: "right",
		},
	],
};
export const basicComponents = [
	{
		type: "input",
		icon: "icon-input",
		options: {
			placeholder: "请输入",
			maxlength: 50,
			disabled: false,
			readonly: false,
		},
	},
	{
		type: "switch",
		icon: "icon-switch",
		options: {
			'active-text': "",
			'inactive-text': "",
			'active-value': "",
			'inactive-value': "",
			'active-color': "",
			'inactive-color': "",
			disabled: false,
		},
	},
	{
		type: "radio",
		icon: "icon-radio",
		options: {
			dataList: "",
		},
	},
	{
		type: "checkbox",
		icon: "icon-check-box",
		options: {
			dataList: "",
			dataConfig: {
				url: "",
				params: [],
			},
		},
	},
	{
		type: "number",
		icon: "icon-number",
		options: {
			disabled: false,
			placeholder: "请输入",
			min: 0,
			max: 0,
			'controls-position': "",
		},
	},
	{
		type: "select",
		icon: "icon-selectbox",
		options: {
			dataList: "",
			dataConfig: {
				url: "",
				params: [],
			},
			label: '',
			value: '',
			placeholder: "请选择",
			multiple: false,
			disabled: false,
			filterable: false
		},
	},
	{
		type: "dialogSelect",
		icon: "icon-selectbox",
		options: {
			placeholder: "请选择项目",
		},
	},
	{
		type: "textarea",
		icon: "icon-textarea",
		options: {
			placeholder: "请输入",
			maxlength: 500,
			row: 3,
			disabled: false,
			readonly: false,
			resize: "none",
		},
	},
	{
		type: "editor",
		icon: "icon-icon-editor",
		options: {
			placeholder: "请输入",
			maxlength: 500,
			readonly: false,
		},
	},
	{
		type: "dateSelect",
		icon: "icon-date-time",
		options: {
			timeType: "datetime",
			disabled: false,
			placeholder: "请选择",
			format: "",
			'range-separator': "",
		},
	},
	{
		type: "dateRelevancy",
		icon: "icon-date_range",
		options: {
			startname: "",
			endname: "",
			timeType: "datetime",
			disabled: false,
			format: "",
		},
	},
	{
		type: "upload",
		icon: "icon-up-load",
		options: {
			fileList: [],
			fileTip: "",
			limit: "",
			fileType: "",
		},
	},
	{
		type: "star",
		icon: "icon-starmarkhighligh",
		options: {
			hover: "",
			disabled: false,
			'show-score': false,
		},
	},
	{
		type: "duration",
		icon: "icon-date-time",
		options: {
			defaultValue: {
				hour: '',
				minute: ''
			}
		}
	},
	{
		type: "tag",
		icon: "el-icon-collection-tag",
		options: {
			defaultValue: [],
			keyword: "keyword",
			unitName: "unitName",
		}
	}
];

export const attrDesc = {
	name: "标签文本",
	bind: "字段标识",
	col: "占的列数",
	className: "自定义类名",
	isHide: "是否隐藏",
	isHideView: "查看时隐藏",
	placeholder: "占位符",
	disabled: "是否禁用",
	readonly: "是否只读",
	'active-text': "switch 打开时的文字描述",
	'inactive-text': "switch 关闭时的文字描述",
	'active-value': "switch 打开时的值",
	'inactive-value': "switch 关闭时的值",
	'active-color': "switch 打开时的背景色",
	'inactive-color': "switch 关闭时的背景色",
	dataList: "数据源属性名",
	dataConfig: "数据源接口配置",
	min: "设置计数器允许的最小值",
	max: "设置计数器允许的最大值",
	multiple: "是否多选",
	filterable: "是否可搜索",
	maxlength: "最大输入长度",
	maxLength: "最大输入长度",
	row: "输入框行数",
	resize: "控制是否能被用户缩放",
	timeType: "显示类型",
	format: "显示的格式",
	'range-separator': "时间分隔符",
	startname: "开始时间的标识",
	endname: "结束时间的标识",
	fileTip: "文件类型提示",
	hover: "hover提示",
	'show-score': "是否显示当前分数",
	'controls-position': "控制按钮位置",
	limit: "文件个数限制",
	fileType: "文件类型",
	label: "label",
	value: "value",
	unitName: "回显字段key",
	keyword: "模糊查询时后端接收的key"
};
// 渲染属性对应的组件类型
export const attrComType = {
	name: "input",
	bind: "input",
	col: "select",
	className: "input",
	isHide: "switch",
	isHideView: "switch",
	placeholder: "input",
	disabled: "switch",
	readonly: "switch",
	'active-text': "input",
	'inactive-text': "input",
	'active-value': "input",
	'inactive-value': "input",
	'active-color': "input",
	'inactive-color': "input",
	dataList: "input",
	min: "number",
	max: "number",
	multiple: "switch",
	filterable: "switch",
	maxlength: "number",
	maxLength: "number",
	row: "number",
	resize: "select",
	timeType: "select",
	format: "input",
	'range-separator': "input",
	startname: "input",
	endname: "input",
	fileTip: "input",
	hover: "input",
	'show-score': "switch",
	'controls-position': "select",
	limit: "number",
	fileType: "input",
	label: 'input',
	value: 'input',
	unitName: 'input',
	keyword: "input"
};
