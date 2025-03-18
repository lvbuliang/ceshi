<template>
	<div class="monaco-container">
		<div ref="container" :class="editorStyleName"></div>
	</div>
</template>

<script>
	import * as monaco from 'monaco-editor'
	export default {
		props: {
			// 编辑器中呈现的内容
			editorStyleName: {
				type: String,
				default: function() {
					return 'monaco-editor'
				}
			},
			codes: {
				type: String,
				default: function() {
					return ''
				}
			},
			language: {
				type: String,
				default: function() {
					return 'json'
				}
			},
			theme: {
				type: String,
				default: function() {
					return 'vs-dark'
				}
			},
			readOnly: {
				type: Boolean,
				default: function() {
					return false
				}
			},
			// 主要配置
			editorOptions: {
				type: Object,
				default: function() {
					return {
						selectOnLineNumbers: true,
						roundedSelection: false,
						readOnly: this.readOnly, // 只读
						cursorStyle: 'line', // 光标样式
						automaticLayout: false, // 自动布局
						glyphMargin: true, // 字形边缘
						useTabStops: false,
						fontSize: 28, // 字体大小
						autoIndent: false // 自动布局
					}
				}
			}
		},
		data() {
			return {
				monacoEditor: null
			}
		},
		mounted() {
			this.monacoEditor = monaco.editor.create(this.$refs.container, {
				value: this.codes, // 见props
				language: this.language,
				theme: this.theme, // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
				editorOptions: this.editorOptions // 同codes
			})
			this.monacoEditor.onDidChangeModelContent((event) => {
				let changeContent = this.monacoEditor.getValue()
				this.$emit('update:contentBody', changeContent)
			})
		},
		methods: {
			setValue(val) {
				this.monacoEditor.setValue(val)
			}
		}
	}
</script>

<style scoped lang="scss">
	.monaco-editor {
		width: 100%;
		height: 500px;
	}
</style>
