
function parseGet(){

    var tmp = [];
    var result=[];
    location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        result [tmp[0]] = decodeURIComponent(tmp[1]);
        // alert(item+" "+tmp[0]+" "+tmp[1]);
    });

    return result;
}

//----------------------------------------------------------------------------------
// htmlEntities: removes some non ASCII characters and replaces them with corresponding hmtl codes
//----------------------------------------------------------------------------------

function htmlEntities(str) {
													
		if(str!=undefined){
				str=str.replace(/\&/g, '&amp;');
				str=str.replace(/\</g, '&lt;');
				str=str.replace(/\>/g, '&gt;');
				str=str.replace(/\ö/g, '&ouml;');
				str=str.replace(/\Ö/g, '&Ouml;');
				str=str.replace(/\ä/g, '&auml;');
				str=str.replace(/\Ä/g, '&Auml;');
				str=str.replace(/\å/g, '&aring;');
				str=str.replace(/\Å/g, '&Aring;');
		}
	
    return str;
}


function AJAXService(opt,apara,kind)
{
	var para="";
	for (var key in apara) {
			para+="&"+key+"="+encodeURIComponent(htmlEntities(apara[key]));
	}
	
	if(kind=="COURSE"){
			$.ajax({
				url: "courseedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedCourse
			});
	}else if(kind=="DUGGA"){
			$.ajax({
				url: "duggaedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedDugga
			});
	}else if(kind=="ACCESS"){
			$.ajax({
				url: "accessedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedAccess
			});
	}else if(kind=="SECTION"){
			$.ajax({
				url: "sectionedservice.php",
				type: "POST",
				data: "courseid="+querystring['courseid']+"&coursename="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&opt="+opt+para,
				dataType: "json",
				success: returnedSection
			});
	}else if(kind=="RESULT"){
			$.ajax({
				url: "resultedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedResults
			});
	}
}

function processLogin(kind) {
		var username = $("#login #username").val();
		var saveuserlogin = $("#login #saveuserlogin").val();
		var password = $("#login #password").val();
		$.ajax({
			type:"POST",
			url: "login.php",
			data: {
				username: username,
				saveuserlogin: saveuserlogin == 1 ? 'on' : 'off',
				password: password
			},
			success:function(data) {
				var result = JSON.parse(data);
				if(result['login'] == "success") {
					$("#user label").html(result['username']);
					$("#user img").addClass("loggedin");
					hideLoginPopup();
					$("#loginbutton").click(function(){processLogout();});

					if(kind=="COURSE") AJAXService("GET",{},"COURSE")
					else if(kind=="ACCESS") AJAXService("GET",{cid:querystring['cid']},"ACCESS")
					else if(kind=="RESULT") AJAXService("GET",{cid:querystring['cid']},"RESULT")
					else if(kind=="DUGGA") AJAXService("GET",{cid:querystring['cid']},"DUGGA")
					else if(kind=="SECTION") AJAXService("get",{},"SECTION")
					else if(kind=="LINK") alert('LINKT!');
				
				}else{
					console.log("Failed to log in.");
					if(typeof result.reason != "undefined") {
						$("#login #message").html("<div class='alert danger'>" + result.reason + "</div>");
					} else {
						$("#login #message").html("<div class='alert danger'>Wrong username or password!</div>");
					}
					$("input#username").css("background-color", "#ff7c6a");
					$("input#password").css("background-color", "#ff7c6a");
				}
			},
			error:function() {
				console.log("error");
			}
		});
}

function processLogout(kind) {
	$.ajax({
		type:"POST",
		url: "logout.php",
		success:function(data) {
			$("#user label").html("Guest");
			$("#user img").removeClass("loggedin");
			$("#loginbutton").click(function(){showLoginPopup();});

			if(kind=="COURSE") AJAXService("GET",{},"COURSE")
			else if(kind=="ACCESS") AJAXService("GET",{cid:querystring['cid']},"ACCESS")
			else if(kind=="RESULT") AJAXService("GET",{cid:querystring['cid']},"RESULT")
			else if(kind=="DUGGA") AJAXService("GET",{cid:querystring['cid']},"DUGGA")
			else if(kind=="SECTION") AJAXService("get",{},"SECTION")
			else if(kind=="LINK") alert('LINKT!');

		},
		error:function() {
			console.log("error");
		}
	});
}

function showLoginPopup()
{
		$("#loginBox").css("display","block");
		$("#overlay").css("display","block");
}

function hideLoginPopup()
{
		$("#loginBox").css("display","none");
		$("#overlay").css("display","none");
}