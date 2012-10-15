$(function(){

//页面加载次数
var pageView = 0;

//数据
var data0 = {
	html:"",
	js:"",
	css:"",
	imports:"http://wangxiao.github.com/BaiduTemplate/debug/js/baiduTemplate.js"
};

data0.html = $('#data0').val();

//工具栏上按钮
var tabs = $('#_tangram_debug_toolbar .switch_tab');

//页面上变可编辑的iframe
var editors = $("#_tangram_debug_panel .editor_tab");

//显示运行效果区域
var result = $('#_tangram_debug_result');

//当前处于哪个编辑器的索引
var index = 0;

//生成文件列表
//$('.dropdown-toggle').dropdown();

//生成编辑器
var htmlEditor = CodeMirror(editors[0], {
  mode:"htmlmixed",
  lineNumbers:true,
  theme:"blackboard",
  onFocus:function(){
  	switchTab(0);
  }
});
var cssEditor = CodeMirror(editors[1], {
  mode:"css",
  lineNumbers:true,
  theme:"blackboard",
  onFocus:function(){
  	switchTab(1);
  }
});
var javascriptEditor = CodeMirror(editors[2], {
  mode:"javascript",
  lineNumbers:true,
  theme:"blackboard",
  onFocus:function(){
  	switchTab(2);
  }
});
htmlEditor.focus();
editors.eq(0).children().addClass("focus");

//点击切换编辑区
tabs.click(function(event){
	event.preventDefault();
	for(var i=0;i<tabs.length;i++){
		if( tabs[i] == event.target && i != index){
			switchTab(i);
		}
	}
});

//移动tab
var moveDiv = function(num){
	var step = 826;
	step = step * num;
	$("#_tangram_debug_allEditor").animate({"left": "+="+step+"px"});
};

//切换tab
var moveFlag1 = true;
var moveFlag2 = true;
var tabTimer = setTimeout(function(){},1);
var focusTimer = setTimeout(function(){},1);

function switchTab(i){
  	if(index!=i){
		//moveDiv(index-i);
		index = i;
		editors.children().removeClass('focus');
		clearTimeout(tabTimer);
		tabTimer = setTimeout(function(){
			editors.eq(i).children().addClass("focus");
		},500);

		switch(i){
			//HTML编辑区
			case 0:

				tabs.eq(1).removeClass("btn-info disabled");
				tabs.eq(2).removeClass("btn-success disabled");
				tabs.eq(i).addClass("btn-primary disabled");
				
				if(moveFlag1 && moveFlag2){
					moveFlag1 = false;
					moveFlag2 = false;
					editors.eq(1).animate({"left":"1000px"},{
						complete:function(){
							moveFlag1 = true;
						}
					});
					editors.eq(2).animate({"left":"1040px"},{
						complete:function(){
							moveFlag2 = true;
						}
					});
				}
				clearTimeout(focusTimer);
				focusTimer = setTimeout(function(){
					htmlEditor.focus();
				},500);

			break;
			case 1:

				tabs.eq(0).removeClass("btn-primary disabled");
				tabs.eq(2).removeClass("btn-success disabled");
				tabs.eq(i).addClass("btn-info disabled");

				if(moveFlag1 && moveFlag2){
					moveFlag1 = false;
					moveFlag2 = false;

					editors.eq(1).animate({"left":"40px"},{
						complete:function(){
							moveFlag1 = true;
						}
					});
					editors.eq(2).animate({"left":"1040px"},{
						complete:function(){
							moveFlag2 = true;
						}
					});
				}
				clearTimeout(focusTimer);
				focusTimer = setTimeout(function(){
					cssEditor.focus();
				},500);

			break;	
			case 2:

				tabs.eq(1).removeClass("btn-info disabled");
				tabs.eq(0).removeClass("btn-primary disabled");
				tabs.eq(i).addClass("btn-success disabled");
				if(moveFlag1 && moveFlag2){
					moveFlag1 = false;
					moveFlag2 = false;

					editors.eq(1).animate({"left":"40px"},{
						complete:function(){
							moveFlag1 = true;
						}
					});
					editors.eq(2).animate({"left":"80px"},{
						complete:function(){
							moveFlag2 = true;
						}
					});
				}
				clearTimeout(focusTimer);
				focusTimer = setTimeout(function(){
					javascriptEditor.focus();
				},500);
			break;
		};				  	 	
  	}
}

//点击"运行"按键
$('#_tangram_debug_btn_run').click(function(){
	var html = htmlEditor.getValue();
	var css = cssEditor.getValue();
	var js = javascriptEditor.getValue();
	var imports = analyzeHtml(html).split('').reverse().join('');

	setImportsList(html);

	html = html.replace(/<link.*>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<script[\s\S]*?<\/script>/g,'');

	html = html.split('').reverse().join('');
	css = css.split('').reverse().join('');
	js = js.split('').reverse().join('');

	$('#_tangram_debug_input_html').val(html);
	$('#_tangram_debug_input_css').val(css);
	$('#_tangram_debug_input_js').val(js);
	$('#_tangram_debug_input_imports').val(imports);

	var form = $('#_tangram_debug_form');
	//form.attr('action','http://tangram.baidu.com/?m=frontData&a=demoEdit');

	form.submit();
	pageView ++;
});

//分析HTML
function analyzeHtml(html){
	var array = [];
	var linkList = html.match(/<link.*>/g);
	var styleList = html.match(/<style[\s\S]*?<\/style>/g);
	var scriptList = html.match(/<script[\s\S]*?<\/script>/g);

	if(linkList){
		array = array.concat(linkList);
	}
	if(styleList){
		array = array.concat(styleList);
	}
	if(scriptList){
		array = array.concat(scriptList);
	}
	return array.join("");
}

//分析HTML并取得CSS文件列表
function setImportsList(html){
	var urlList = [];
	var nameList = [];

	//找到引用的CSS文件
	html.replace(/<link.*?href=['|"](.*?)['|"].*?>/g,function(item,$1){
		urlList.push($1);
		nameList.push($1.match(/[^/]*\.css/));
	});

	//找到引用的JS文件
	html.replace(/<script.*?src=['|"](.*?)['|"].*?>/g,function(item,$1){
		urlList.push($1);
		nameList.push($1.match(/[^/]*\.js/));
	});

	//var tempStr = '<li class="divider"></li>';
	var tempStr = '';
	for(var i =0;i<urlList.length;i++){
		tempStr += "<li><a target='_blank' href='"+urlList[i]+"'>"+nameList[i]+"</a></li>";
	}
	if(urlList.length>0){
		$('#_tangram_debug_fileList .dropdown-menu').html(tempStr);
	}else if(pageView > 0){
		$('#_tangram_debug_fileList .dropdown-menu a').text('无');
	}
}

//提示功能
$('#_tangram_debug_modal').modal({
    backdrop:true,
    keyboard:true,
    show:false
});

//处理数据
function distributeData(data){
	htmlEditor.setValue(data.html);
	cssEditor.setValue(data.css);
	javascriptEditor.setValue(data.js);
	setImportsList(data.imports);
	// var css = "\n<style  type='text/css'>"+data.css+"</style>\n";
	// var js = "\n<script type='text/javascript'>"+data.js+"</script>\n";
	// var html = data.html ;

	// $("#_tangram_debug_btn_run").click(function(){
	// 	window.frames["_tangram_debug_result"].document.body.innerHTML = css + html +js;	 
	// });	
};
distributeData(data0);

});
