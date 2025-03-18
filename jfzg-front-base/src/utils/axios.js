import axios from "axios";
import config from "@/setting.js";
import { getStorageToken, getStorageTokenType } from "@/utils/user-vali.js";
import Vue from 'vue'

// create an axios instance
const service = axios.create({
	baseURL: config.baseUrl,
	withCredentials: true, // send cookies when cross-domain requests
	timeout: config.timout, // request timeout
});
service.defaults.withCredentials = true;
const V = new Vue()

// request interceptor
service.interceptors.request.use(
	(config) => {
		// do something before request is sent
		let token = getStorageToken();
		let token_type = getStorageTokenType();
		if (token) {
			//给请求头添加token
			config.headers["Authorization"] = token_type + " " + token;
		}
		config.headers["X-Requested-With"] = "XMLHttpRequest";
		config.headers["x-source-header"] = "pc";
		return config;
	},
	(error) => {
		// do something with request error
		return Promise.reject(error);
	}
);

// response interceptor
service.interceptors.response.use(
	(response) => {
		const res = response.data;
		if (res.msg.code !== "0000") {
			//未登录状态码
			if (res.msg.code == "1005") {
				let pageUrl = config.baseUrl + "/login";
				window.location.replace(pageUrl);
			} else {
				V.$message({
					message: res.msg.message || "请求错误",
					type: "error",
					duration: 5 * 1000,
				});
				return res;
			}
		} else {
			//正常情况
			res.success = res.msg.code === "0000";
			return res;
		}
	},
	(error) => {
		V.$message({
			message: "请求错误",
			type: "error",
			duration: 5 * 1000,
		});
		return Promise.reject(error);
	}
);

export default service;
