const baseUrl = process.env.NODE_ENV === 'development' ? 'http://172.20.19.160:81' : location.protocol + '//' +
	location.host
export default {
	tokenKey: 'token',
	baseUrl,
	imgBaseUrl: baseUrl + "/jfzg/file/api/file/downlaodDocToPDF?key="
}