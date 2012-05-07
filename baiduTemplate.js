/*
	占用两个命名空间  baidu.template 和 baidu.template_
	接口调用方式如下
	baidu.template(tpl);  //return function
	baidu.template(tpl,data); //return html string
	baidu._template.setTab(left,right);
	baidu._template中有部分方法
*/

(function(){

	//模板函数
	var bt = function(str, data){

		//检查是否有不是字母、-、：、.、的字符  即，检查是否是模板   W3C文档中规定，id的名字可由 字母 数字 冒号 横线 下划线 等组成
		var fn = !/[^\w\d-:.]/.test(str) ?

			//不是模板，看下缓存有没有数据，缓存没有数据则取到对应dom中的内容，调用模板引擎生成缓存函数
			cache[str] = cache[str] || bt(document.getElementById(str).innerHTML) :
			//是模板字符串，则生成一个函数
			new Function("obj",
				"var p=[];"+"with(obj){p.push('"+analysisStr(str)+"');}return p.join('');"
			);
			//有数据则返回HTML字符串，没有数据则返回函数
		return data ? fn( data ) : fn;
	};

	//取得命名空间 baidu.template和 baidu._template
	baidu=window.baidu||{};
	baidu.template=bt;

	baidu._template={};
	bt_=baidu._template;
/*
	//是否开启调试
	var debug_flag=false;
	bt_.debug=function(){
		debug_flag=true;
		console.log('\nbaidu template debug is running!\n');
	}
*/
	//HTML转义
	bt_._encodeHTML = function (source) {
		return String(source)
				.replace(/&/g,'&amp;')
				.replace(/</g,'&lt;')
				.replace(/>/g,'&gt;')
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
	};

	//转义影响正则的字符
	bt_._encodeReg = function (source) {
		return String(source)
			.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
	};

	//转义UI UI变量使用在HTML页面标签onclick等事件函数参数中
	bt_._encodeEventHTML = function (source) {
		return String(source)
			.replace(/&/g,'&amp;')
			.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;')
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
			.replace(/\\/g,"\\")
			.replace(/\//g,"\/")
			.replace(/\n/g,"\n")
			.replace(/\r/g,"\r");
	};

	//缓存
	var cache = {};
	
	//自定义表示，尽量不要含有正则中的表示，如果出现，需要转义
	var _left='<%';
	var _right='%>';

	//自定义标签的方法
	bt_.setTab=function(left,right){
		//强制转换string 并且 过滤可能影响正则的字符
		_left=bt_._encodeReg(String(left));
		_right=bt_._encodeReg(String(right));
	};

	//解析模板字符串
	var analysisStr=function(str){
		var temp=String(str);
		temp=temp

			//把所有换行空格去掉  \r回车符 \t制表符或空格 \n换行符
			.replace(new RegExp("[\\r\\t\\n]","g"), "");

			//默认支持HTML注释
			//.replace(new RegExp("<!--[\\s\\S]*?-->","g"),"")

			//去掉注释内容  <%* 这里可以任意的注释 *%>
			.replace(new RegExp(_left+"\\*[\\s\\S]*?\\*"+_right, "g"),"");

			//对变量后面的分号做容错(包括转义模式 如<%:h=value%>)  <%=value;%> 排除掉函数的情况 <%fun1();%> 排除定义变量情况  <%var val='test';%>
			.replace(new RegExp("("+_left+":?[hvu]=[^;|"+_right+"]*?);[\\s]*?"+_right,"g"),"$1"+_right);

			//定义变量，如果没有分号，需要容错  <%var val='test'%>
			.replace(new RegExp("("+_left+"[\\s]*?var[\\s]*?.*?[\\s]*?[^;])[\\s]*?"+_right,"g"),"$1;"+_right);

			//用来清理会报错的容易产生的无用间隔  如 <%if()%><%{%><%}%><%else%><%{%><%}%>
			.replace(new RegExp("(?:"+_right+_left+")?[\\s]*?\\{","g"),"{").replace(new RegExp("\\}[\\s]*?(?:"+_right+_left+")?[\\s]*?else\\b(?:"+_right+_left+")?\\{","g"),"}else{");

			//按照 <% 分割为一个个数组，再用 \t 和在一起，相当于将 <% 替换为 \t
			//将模板按照<%分为一段一段的，再在每段的结尾加入 \t,即用 \t 将每个模板片段前面分隔开
			.split(_left).join("\t");

			//找到 不是\t开头并且以单引号结束的字符串 或者 从%>开始含有不是\t的字符并且以点结束的字符串
			.replace(new RegExp("((^|"+_right+")[^\\t]*)'","g"), "$1\\r");

			//找到 \t=任意一个字符%> 替换为 ‘，任意字符,'
			//即替换简单变量  \t=data%> 替换为 ',data,'
			//默认转义
			.replace(new RegExp("\\t=(.*?)"+_right,"g"),"',typeof $1=='undefined'?'':baidu._template._encodeHTML($1),'")

			//支持不转义 <%:=value%>
			.replace(new RegExp("\\t:=(.*?)"+_right,"g"),"',typeof $1=='undefined'?'':$1,'")

			//支持url转义 <%:u=value%>
			.replace(new RegExp("\\t:u=(.*?)"+_right,"g"),"',typeof $1=='undefined'?'':encodeURIComponent($1),'")

			//支持UI 变量使用在HTML页面标签onclick等事件函数参数中  <%:v=value%>
			.replace(new RegExp("\\t:v=(.*?)"+_right,"g"),"',typeof $1=='undefined'?'':baidu._template._encodeEventHTML($1),'")

			//将字符串按照 \t 分成为数组，在用'); 将其合并，即替换掉结尾的 \t 为 ');
			//在if，for等语句前面加上 '); ，形成 ');if  ');for  的形式
			.split("\t").join("');");

			//将 %> 替换为p.push('
			//即去掉结尾符，生成函数中的push方法
			//如：if(list.length=5){%><h2>',list[4],'</h2>');}
			//会被替换为 if(list.length=5){p.push('<h2>',list[4],'</h2>');}
			.split(_right).join("p.push('");

			//将 \r 替换为 \
			.split("\r").join("\\'");
		
		return temp;
	};
})();