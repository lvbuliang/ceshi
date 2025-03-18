import axios from "axios";
import config from "@/setting.js";
import store from "@/store/index";
import Vue from 'vue'

import {
	getStorageToken,
	clearStorageToken,
	getStorageTokenType,
} from "@/utils/user-vali.js";

const V = new Vue()

// create an axios instance
const service = axios.create({
	baseURL: config.baseUrl,
	withCredentials: true, // send cookies when cross-domain requests
	timeout: config.timout, // request timeout
	headers: {
		"cache-contral": "no-cache",
		Pragma: "no-cache",
	},
});
service.defaults.withCredentials = true;
let store_count = 0;

// request interceptor
service.interceptors.request.use(
	(config) => {
		// store.commit("app/store_loading", ++store_count);
		// do something before request is sent
		let token = getStorageToken();
		let token_type = getStorageTokenType();
		if (token) {
			//给请求头添加token
			config.headers["Authorization"] = token_type + " " + token;
			// config.headers['X-Token'] = getToken()
		}
    config.headers["x-source-header"] = "pc";
		return config;
	},
	(error) => {
		// do something with request error
		// store.commit("app/store_loading", --store_count);
		return Promise.reject(error);
	}
);

// response interceptor
service.interceptors.response.use(
	/**
	 * If you want to get http information such as headers or status
	 * Please return  response => response
	 */

	/**
	 * Determine the request status by custom code
	 * Here is just an example
	 * You can also judge the status by HTTP Status Code
	 */
	(response) => {
    // debugger
		// store.commit("app/store_loading", --store_count);
		const res = response.data;
		// if the custom code is not 20000, it is judged as an error.
		if (res && res.code !== "0000" && res.msg.code !== "0000") {
			if (res.code == "1005" || res.msg.code == "1005") {
				clearStorageToken();
				sessionStorage.clear();
				let pageUrl = window.location.origin + "/login";
				window.location.replace(pageUrl);
			}
			return res;
		}else {
			res.success = res.code === "0000" || res.msg.code === "0000";
			return res;
		}
	},
	({ response }) => {
		// store.commit("app/store_loading", --store_count);
		V.$message({
			message:
				response && response.data && response.data.message
					? response.data.message
					: "请求错误",
			type: "error",
			duration: 5 * 1000,
		});
		return Promise.reject(response && response.data);
	}
);

export default service;
