百度JS模板引擎 baiduTemplate 1.0 版
==========================

##一、baiduTemplate 简介

###应用场景：
	前端使用的模板系统  或  后端Javascript环境发布页面

###功能概述：
	提供一套模板语法，用户可以写一个模板区块，每次根据传入的数据，生成对应数据产生的HTML片段，渲染不同的效果。

###特性：
	1、语法简单，学习成本极低，开发效率提升很大，性价比较高（使用Javascript原生语法）；
	2、默认HTML转义（防XSS攻击），并且支持包括URL转义等多种转义；
	3、变量未定义自动输出为空，防止页面错乱；
	3、功能强大，如分隔符可自定等多种功能；

##二、基本用法
###1、存放：
####模板块可以放在 <script> 中，设置type属性为text/html，用id标识
如： 
	<script id='tpl' type="text/html">
	<!-- 模板部分 -->

	<!-- 模板结束 -->	
	</script>

####或者存放在<textarea>中，一般情况设置其CSS样式display:none来隐藏掉textarea，同样用id标识

			<textarea id='tpl'>
			<!-- 模板部分 -->

			<!-- 模板结束 -->	
			</textarea>

###2、调用

####baiduTemplate占用baidu.template命名空间
	var bt = baidu.template;

####tpl为传入的模板，可以是id，可以是模板片段的字符串，当前模板和数据返回的HTML
	var html = bt(tpl,data);


##三、使用举例

	//index.html
	<!doctype html>
	<html>
	<head>
	<meta charset="utf-8"/>
	<title>test</title>

	<!-- 引入baiduTemplate -->
	<script type="text/javascript" src="./baiduTemplate.js"></script>

	</head>
	<body>
	<div id='result'></div>

	<!-- 模板1开始，可以使用script（type设置为text/html）来存放模板片段，并且用id标示 -->
	<script id="t:_1234-abcd-1" type="text/html">
	<div>
		<!-- 我是注释，语法均为Javascript原生语法，默认分割符为 <% %> ，也可以自定义，参见API部分 -->
		<!-- 输出变量语句，输出title -->
		<h1>title:<%=title%></h1>
		<!-- 判断语句if else-->
		<%if(list.length>1) { %>
			<h2>输出list，共有<%=list.length%>个元素</h2>
			<ul>
				<!-- 循环语句 for-->
				<%for(var i=0;i<5;i++){%>
					<li><%=list[i]%></li>
				<%}%>
			</ul>
		<%}else{%>
			<h2>没有list数据</h2>	
		<%}%>
	</div>	
	</script>
	<!-- 模板1结束 -->

	<!-- 使用模板 -->
	<script type="text/javascript">
	var data={
		"title":'欢迎使用baiduTemplate',
		"list":[
			'test1:默认支持HTML转义，如输出<script>，也可以关掉，语法<:=value> 详见API',
			'test2:',
			'test3:',
			'test4:list[5]未定义，模板系统会输出空'
		]
	};

	//使用baidu.template命名空间
	var bt=baidu.template;

	//可以设置分隔符
	//bt.LEFT_DELIMITER='<!';
	//bt.RIGHT_DELIMITER='!>';

	//最简使用方法
	var html=bt('t:_1234-abcd-1',data);

	//渲染
	document.getElementById('results').innerHTML=html;
	</script>

	</body>
	</html>