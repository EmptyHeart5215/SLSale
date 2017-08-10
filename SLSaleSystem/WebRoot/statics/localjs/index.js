$("#loginBtn").click(function(){
	var user = new Object();
	user.loginCode = $.trim($("#loginCode").val());
    user.password = $.trim($("#password").val());
    user.isStart = 1;
    
    if(user.loginCode == "" || user.loginCode == null){
    	$("#loginCode").focus;
    	$("#formtip").css("color","red");
    	$("#formtip").html("对不起，登录账号不能为空。");
    }else if(user.password == "" || user.password == null){
    	$("#password").focus;
    	$("#formtip").css("color","red");
    	$("#formtip").html("对不起，登录密码不能为空。");
    }else{
    	$("#formtip").html("");
    	
    	$.ajax({
    		type:'POST',
    		url:'/login.html',
    		data:{user:JSON.stringify(user)},
    		dataType:'html',
    		timeout:1000,
    		error:function(){
    			$("#formtip").css("color","red");
    	    	$("#formtip").html("登录失败！请重试。");
    		},
    		success:function(result){
    			if(result != "" && result == "success"){//若登录成功，跳转到"/main.html"
    				window.location.href='/main.html';
    			}else if(result == "failed"){
    				$("#formtip").css("color","red");
        	    	$("#formtip").html("登录失败！请重试。");
        	    	$("#loginCode").val('');
        	    	$("#password").val('');
    			}else if(result == "nologincode"){
    				$("#formtip").css("color","red");
        	    	$("#formtip").html("登录账号不存在！请重试。");
    			}else if(result == "pwderror"){
    				$("#formtip").css("color","red");
        	    	$("#formtip").html("登录密码错误！请重试。");
    			}else if("nodata" == result){
    				$("#formtip").css("color","red");
        	    	$("#formtip").html("对不起，没有任何数据需要处理！请重试。");
    			}
    		}
    		
    	});
    	
    }
	
});