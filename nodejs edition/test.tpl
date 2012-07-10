<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="keywords" content="baidu template" />
<meta name="description" content="javascript前端模板" />
<title>test</title>
<script type="text/javascript" src="./baiduTemplate.js"></script>
</head>
<body>
	<h3>BaiduTemplate单元测试用例</h3>
<script type="text/javascript">
//nodejs测试1
function test(){
	alert('test');
};
test();
</script>

<!-- 测试模板1开始 -->
<script id='t:_1234-abcd-1' type="text/template">
<br>
1、基本输出（自动HTML转义）：  <%=value1%> 
<br>
<br>
2、容错写法：  <%=value2;%>
<br>
<br>
3、不转义输出： <%:=value3%> 或 <%-value3%>
<br>
<br>
4、容错写法： <%:=value4;%>
<br>
<br>
5、URL转义输出： <%:u=value5%>
<br>
<br>
6、容错写法： <%:u=value6;%>
<br>
<br>
7、UI变量在页面标签事件中使用转义： <%:v=value7%>
<br>
<br>
8、容错写法：<%:v=value8;%>
<br>
<br>
9、HTML转义输出：<%:h=value9%>
<br>
<br>
10、容错写法：<%:h=value10;%>
<br>
<br>
11、变量未定义自动输出空：<%=value11%>
<br>
<br>
12、模板直接输出特殊字符：5个斜杠 ///// 5个单引 ‘’‘’‘ 5个双引 “”“”“
<br>
<br>
13、注释：
	<!-- HTML注释支持 -->  
	<%* 模板自带注释 *%> 
	<% //js注释方式 
	%>
<br>
<br>
14、判断语句：
	<%if(value14){%>
		<input type="text" value="<%:v=value14%>">
	<%}else{%>
		无值
	<%}%>
<br>
<br>
15、循环语句：
<br>
<ul>
<%for(var i=0;i<value17.length;i++){%>
	<li><%=value17[i]%></li>
<%}%>
</ul>
<br>
<br>
16、a标签 <br>
单引问题：<a target='_blank' href='http://www.baidu.com ' onclick='alert("test");'>test</a><br>
双引问题：<a target="_blank" href="http://www.baidu.com" onclick="alert('test');">test</a><br>

</script>
<!-- 测试模板1结束 -->

<div id="results"></div>

<script type="text/javascript">
//nodejs测试2
function test(){
	alert('test');
};
test();
</script>
<script type="text/javascript">
//nodejs测试3
function test(){
	alert('test');
};
test();
</script>

</body>
</html>