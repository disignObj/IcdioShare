function loadBackManagement(){
	isLogin();
	var url = GetRequest();
	
	if(url['block'] != undefined){
		getPermissions();
		setItem();
		sessionStorage.removeItem('permissions');
		
		if(url['block'] == 'main')
			return;
		if (url['type'] == "add") {
			$('#addEditModel').css('display','block');
			$('#displayModel').css('display','none');
			getColumnInfo(url['block']);
			setAddModel(url['block']);
			return;
		}else if(url['type'] == 'edit'){
			$('#addEditModel').css('display','block');
			$('#displayModel').css('display','none');
			getColumnInfo(url['block']);
			setEditModel(url['block'], url['id']);
			return ;
		}

		$('#displayModel').css('display','block');
		$('#title').html(control2[url['block']]);
		$('#title').css('display','block');
		
		if(url['block'] == "Permissions" || url['block'] == "Role" || url['block'] == "User" ){
			$("#btAddInfo").css('display','block');
		}else {
			$("#btAddInfo").css('display','none');
		}
		setFindBt(url['block']);
		displayInfo();
		
	}else {
		alert("路径出错！");
		reManager();
	}	
}

function setItem(){
	if(!isDisplay('PermissionsCtr') && !isDisplay('PermissionsCtr_display'))
		$("#permissionsCtr").remove();
	if(!isDisplay('UserCtr') && !isDisplay('UserCtr_display'))
		$("#roleCtr").remove();
	if(!isDisplay('RoleCtr') && !isDisplay('RoleCtr_display'))
		$("#userCtr").remove();
	if(!isDisplay('ProcessCtr') && !isDisplay('ProcessCtr_display'))
		$("#processCtr").remove();
	$("div.item").css('display','block');
}

function isDisplay(type){
	if(eval(sessionStorage.permissions) == undefined || sessionStorage.permissions == "[]")
		return true;
	
	var perssions = eval(sessionStorage.permissions)[0]['sign'];
	
	for(var i = 0; i < perssions.length; i++){
		if(type == perssions[i])
			return false;
	}
	return true;
}

function setFindBt(type){
	for(var i = 0; i < tableTh2[type].length - 1;i++)
		$('#findSel').append('<option value="'+tableTh[type][i] + '">'+ tableTh2[type][i] +'</option>');
}

function setAddModel(type){
	var column = eval(sessionStorage.column);
	
	for(var i = 0, j = 0; i < column.length; i++){
		if(column[i]['name'] == 'id')
			continue;
		else{
			if(column[i]['length'] < 100){
				var index = (j % 2 == 0 ? 1 : 2);
				j++;
				var display = '<div class="addInput'+index+'"><label class="lab'+index+'">'+column[i]['chineseName']+'</label>'+
				'<input class="input'+index+'" type="text" id="addModel_'+column[i]['name']+'" />'+
				'<div class="tip'+index+'"></div></div>';
				$("#addEdit").append(display);
			}
		} 
			
	}
	var dis = '<div class="tail"><button class="btSure">确定</button><button class="btRe" onclick="addReBt(\''+type+'\')">返回</button>'+
			'</div>'
	$("#addEdit").append(dis);
	
}

function setEditModel(type, infoId){
	var column = eval(sessionStorage.column);
	
	for(var i = 0; i < column.length; i++){
		var index = (i % 2 == 0 ? 1 : 2);
		if(column[i]['length'] < 100){
			var display = '<div class="addInput'+index+'"><label class="lab'+index+'">'+column[i]['chineseName']+'</label>'+
			'<input class="input'+index+'" type="text" id="addModel_'+column[i]['name']+'" />'+
			'<div class="tip'+index+'"></div></div>';
			$("#addEdit").append(display);
		} else {
			
			var display = '<div class="addInput'+index+'"><label class="lab'+index+'">'+column[i]['chineseName']+'</label>'+
			'<input class="input'+index+'" type="text" id="addModel_'+column[i]['name']+'" />'+
			'<div class="tip'+index+'"></div></div>';
			$("#addEdit").append(display);
		}
			
	}
	var dis = '<div class="tail"><button class="btSure">确定</button><button class="btRe" onclick="addReBt(\''+type+'\')">返回</button>'+
			'</div>'
	$("#addEdit").append(dis);
	
}

function restoreEdit(type, infoId){
	$.ajax({
		type:'post',
		url:'../servlet/CommonOperateServlet',
		async:false,
		data:{
			'info':'restore','id': infoId, 'className':type,
		},
		success:function(data){
			
		},
		error:function(data){
			
		},
		
	})
}

function getColumnInfo(block){
	$.ajax({
		type:'post',
		url:'../servlet/CommonOperateServlet',
		async:false,
		data:{
			'info':'columnInfo', 'class':block
		},
		success:function(data){
			var info = eval(data);
			if(info != null && info != ""){
				sessionStorage.column = JSON.stringify(info);
			}
		},
		error:function(data){
			alert("服务器访问失败！");
		},
	})
}

/**
 * 模块数据表格展示
 * */
function displayInfo(){
	var url = GetRequest();
	
	if(url['page'] != undefined && url['block'] != undefined){
		$.ajax({
			type:'post',
			async:false,
			url:'../servlet/'+ url['block'] + 'Servlet',
			data:{
				'info':'display', 'page': url['page'], 'userId' : eval(sessionStorage.user)[0]['id'],
			},
			success:function(data){
				var info = eval(data);				
				if(info != undefined && info != ""){	
					getPermissions();
					displayTable(info);	
					sessionStorage.removeItem('permissions');
				}
			},
			error:function(data){
				alert("服务器访问失败！");
			},
		});
	}
	
}

function displayTable(info){
	var url = GetRequest();
	var display = '<table id="table" class="table" cellspacing="0" cellpadding="5"><tr class="controlTh controlTh2">';
	
	for(var j = 0; j < tableTh[url['block']].length; j++)
		display += '<td>'+tableTh2[url['block']][j]+'</td>';
	
	display +='</tr>';
	for(var i = 0; i < info.length; i++){
		
		if(info[i]['id'] != undefined){
			if(i % 2 == 1)
				display += "<tr class='otherTr'>";
			else 
				display += "<tr>";
			
			for(var j = 0; j < tableTh[url['block']].length; j++){
				if(j == (tableTh[url['block']].length - 1)){
					display += '<td class="controlTh">' + getOperate(url['block'] + 'Ctr', info[i]) + '</td>';
				}else {
					display += "<td title='"+isNull(info[i][tableTh[url['block']][j]])+"'>"+isNull(info[i][tableTh[url['block']][j]]) + '</td>';
				}
			}
			
			display += "</tr>";
		}else {
			$('#nowPage').html(url['page']);
			var url = GetRequest();
			if(Math.ceil(info[i]['page']) == 0 || Math.ceil(info[i]['page']) == 1) {
				$('#allPage').html('1');
				sessionStorage.backPages = 1;
				addClasses();
			}
			else if(parseInt(url['page'])  > 1 && parseInt(url['page']) < Math.ceil(info[i]['page'])){
				$('#allPage').html(Math.ceil(info[i]['page']));
				sessionStorage.backPages = Math.ceil(info[i]['page']);
				removeClasses();
			}
			else if(parseInt(url['page']) == 1 && parseInt(url['page']) < Math.ceil(info[i]['page'])) {
				$('#allPage').html(Math.ceil(info[i]['page']));
				sessionStorage.backPages = Math.ceil(info[i]['page']);
				aheadAddClasses();
			}
			else {
				$('#allPage').html(Math.ceil(info[i]['page']));
				sessionStorage.backPages = Math.ceil(info[i]['page']);
				backAddClasses();
			}
		}
	}
	
	display += '</table>'
	$('#displayTable').append(display);
}


function isNull(info){
	if(info == null)
		return "";
	return info;
}

function addClasses() { //全部不能点
	$('#bcakFirstPg').addClass('cantClick');
	$('#bcakPreviousPg').addClass('cantClick');
	$('#bcakNextPg').addClass('cantClick');
	$('#bcakLastPg').addClass('cantClick');
	$('#bcakFirstPg').removeClass('canClick');
	$('#bcakPreviousPg').removeClass('canClick');
	$('#bcakNextPg').removeClass('canClick');
	$('#bcakLastPg').removeClass('canClick');
}

function removeClasses() { //全部能点
	$('#bcakFirstPg').addClass('canClick');
	$('#bcakPreviousPg').addClass('canClick');
	$('#bcakNextPg').addClass('canClick');
	$('#bcakLastPg').addClass('canClick');
	$('#bcakFirstPg').removeClass('cantClick');
	$('#bcakPreviousPg').removeClass('cantClick');
	$('#bcakNextPg').removeClass('cantClick');
	$('#bcakLastPg').removeClass('cantClick');
}

function aheadAddClasses() { //左边不能点
	$('#bcakFirstPg').removeClass('canClick');
	$('#bcakPreviousPg').removeClass('canClick');
	$('#bcakFirstPg').addClass('cantClick');
	$('#bcakPreviousPg').addClass('cantClick');
	$('#bcakNextPg').removeClass('cantClick');
	$('#bcakLastPg').removeClass('cantClick');
	$('#bcakNextPg').addClass('canClick');
	$('#bcakLastPg').addClass('canClick');
}

function backAddClasses() { //右边不能点
	$('#bcakFirstPg').removeClass('cantClick');
	$('#bcakPreviousPg').removeClass('cantClick');
	$('#bcakFirstPg').addClass('canClick');
	$('#bcakPreviousPg').addClass('canClick');
	$('#bcakNextPg').removeClass('canClick');
	$('#bcakLastPg').removeClass('canClick');
	$('#bcakNextPg').addClass('cantClick');
	$('#bcakLastPg').addClass('cantClick');

}

function submitEdit(){
	
}

function getOperate(type, info){
	var display = "";
		
	if(type == "ProcessCtr" && hasPerssions(type)){
		if(info['state'] == "已提交"){
			display += '<span class="control">同意</span>';
			display += '<span class="control">驳回</span>';
		}else {
			display += '<span class="control" onclick="del(\''+type+'\',\''+info['id']+'\')">删除</span>';
		}
		return display;
	}
	
	if(hasPerssions(type) || hasPerssions(type +"_display"))
		display += '<span class="control">查看</span>';
	if(type != "QuestionCtr" && type != "AnswerCtr" && type != "Evaluation"){
		if(hasPerssions(type) || hasPerssions(type +"_edit"))
			display += '<span class="control" onclick="edit('+info['id']+')">编辑</span>';
	}
	
	if(hasPerssions(type) || hasPerssions(type +"_delete"))
		display += '<span class="control" onclick="del(\''+type+'\',\''+info['id']+'\')">删除</span>';
	
	if(type == "TechnologyCtr" || type == "ActiveCtr"){ 
		if((hasPerssions(type) || (eval(sessionStorage.user)[0]['id'] == info['userID']))
				&& info['state'] == '已提交'){
			display += '<span class="control">撤回</span>';
		}else if((hasPerssions(type) || (eval(sessionStorage.user)[0]['id'] == info['userID']))
				&& (info['state'] == '已撤回' || info['state'] == '已驳回')){
			display += '<span class="control">提交</span>';
		}
	}
	return display;
}

function del(type, id){
	if(confirm("确定删除？")){
		if(type == "ActiveCtr" || type == "TechnologyCtr")
			type = "Tel_And_ActCtr";
		$.ajax({
			type:'post',
			url:'../servlet/CommonOperateServlet',
			aysnc:false,
			data:{
				'info':'delete', 'id':id, 'className':type.substring(0, type.length - 3)
			},
			success:function(data){
				var url = GetRequest();
				window.location.href = "BackManagement.html?page=1&block=" + url['block'];
				alert("删除成功！");
			},
			error:function(data){
				alert("服务器访问失败！");
			},
		});
	}
}


function addReBt(tip){
	window.location.href = "BackManagement.html?page=1&block=" + tip;
}

function find(type, key, value){
	if(confirm("确定删除？")){
		if(type == "ActiveCtr" || type == "TechnologyCtr")
			type = "Tel_And_ActCtr";
		$.ajax({
			type:'post',
			url:'../servlet/CommonOperateServlet',
			aysnc:false,
			data:{
				'info':'find', 'key':key, 'value':value, 'className':type.substring(0, type.length - 3)
			},
			success:function(data){
				var url = GetRequest();
				window.location.href = "BackManagement.html?page=1&block=" + url['block'];
			},
			error:function(data){
				alert("服务器访问失败！");
			},
		});
	}
}

function goBlock(tip){
	window.location.href = "BackManagement.html?page=1&block=" + control[tip];
}
function Return(){
	window.location.href = "ManagerIndex.html?activeIndex=1&technologyIndex=1";
}
function goMain() {
	window.location.href = "BackManagement.html?block=main";
}

function backGoFirstPg (){
	var url = GetRequest();
	var pages = sessionStorage.backPages;
	if(parseInt($('#nowPage').html()) <= pages && parseInt(url['page']) > 1 && parseInt($('#nowPage').html()) != 1) {
		window.location.href = "BackManagement.html?page=1&block=" + url['block'];
	}
}

function backGoPreviousPg (){
	var url = GetRequest();
	var pages = sessionStorage.backPages;
	if(parseInt($('#nowPage').html()) <= pages && (parseInt(url['page']) - 1) > 0 && (parseInt(url['page']) - 1) < pages) {
		window.location.href = "BackManagement.html?page=" + (parseInt(url['page']) - 1) + "&block=" + url['block'];
	}
}

function backGoNextPg (){
	var url = GetRequest();
	var pages = sessionStorage.backPages;
	if(parseInt($('#nowPage').html()) < pages && (parseInt(url['page']) + 1) <= pages && (parseInt(url['page']) + 1) >=2) {
		window.location.href = "BackManagement.html?page=" + (parseInt(url['page']) + 1) + "&block=" + url['block'];
	}
}

function backGoLastPg (){
	var url = GetRequest();
	var pages = sessionStorage.backPages;
	if(parseInt($('#nowPage').html()) < pages && parseInt(url['page']) > 0 && parseInt($('#nowPage').html()) != pages) {
		window.location.href = "BackManagement.html?page=" + pages + "&block=" + url['block'];
	}
}

function add() {
	var url = GetRequest();
	window.location.href = "BackManagement.html?block=" + url['block'] + "&type=add";
}

function edit(id) {
	var url = GetRequest();
	window.location.href = "BackManagement.html?block=" + url['block'] + "&type=edit&id=" + id;
}







