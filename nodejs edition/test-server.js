var fs = require('fs');
var baidu = require('./baiduTemplate.js');

fs.readFile('test.tpl',function(err,data){
	var tpl = data;
	//console.log("tpl:\n"+tpl);
	//测试数据，对应每个用例
	var data = {
			value1:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value2:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value3:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value4:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value5:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value6:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value7:'<b>http://wangxiao.github.com/BaiduTemplate/</b><b>\\\'\"</b>',
			value8:'<b>http://wangxiao.github.com/BaiduTemplate/</b><b>\\\'\"</b>',
			value9:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value10:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value14:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value15:'<b>http://wangxiao.github.com/BaiduTemplate/</b>',
			value16:['<b>这是value</b>',123,'<b>http://wangxiao.github.com/BaiduTemplate/</b>'],
			value17:['<b>这是value</b>',123,'<b>http://wangxiao.github.com/BaiduTemplate/</b>']
		};
	var html = baidu.template(tpl,data);
	console.log(html);
});