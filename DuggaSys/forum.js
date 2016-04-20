/********************************************************************************

   Globals

*********************************************************************************/

var sessionkind=0;
var querystring = parseGet();

//----------------------------------------
// Commands:
//----------------------------------------

function initThread()
{
	if (querystring["threadId"])
	{
		$("#createThreadWrapper").hide();
		console.log(querystring);
		getThread();
	}
	else {
		createThreadUI();
	}
}

function getThread()
{
	AJAXService("GETTHREAD",{threadId:querystring["threadId"]},"GETTHREAD");
	getComments();
}

function lockThread()
{
	AJAXService("LOCKTHREAD",{threadId:querystring["threadId"]},"LOCKTHREAD");
}

function deleteThread()
{
	AJAXService("DELETETHREAD",{threadId:querystring["threadId"]},"DELETETHREAD");
}

// Vad ska hända när man deletar en tråd???
function deleteThreadSuccess(data)
{
	if (data["accessDenied"]){
		accessDenied(data);
	}else{
		window.location.replace("courseed.php");
	}
}

function getComments()
{
  AJAXService("GETCOMMENTS",{threadId:querystring["threadId"]},"GETCOMMENTS");
}

function createThread()
{
	var courseId = 1;
	var topic = "Din mormor";
	var description = "Din mormor är fin";
	var userID = "1";
	AJAXService("CREATETHREAD",{courseId:courseId,userID:userID,topic:topic,description:description},"CREATETHREAD");
}

function makeComment()
{
	var text = $(".commentInput").val();

	if(text.length > 0)
	{
		AJAXService("MAKECOMMENT",{threadId:querystring["threadId"],text:text},"MAKECOMMENT");
	}
	else
	{

	}
}

function checkComment()
{
	var text = $(".commentInput").val();

	if(text.length > 0)
	{
		$(".commentSubmitButton").css("background-color", "#614875");
	}
	else
	{
		$(".commentSubmitButton").css("background-color", "buttonface");
	}
}

function deleteComment(commentid)
{
	console.log(commentid);
	AJAXService("DELETECOMMENT",{commentid:commentid},"DELETECOMMENT");
}

function getCourses()
{
	AJAXService("GETCOURSES",{},"GETCOURSES");
}

//----------------------------------------
// Renderer
//----------------------------------------

function accessDenied(data)
{
	var str = "<div class='err'>";
			str +=	"<span style='font-weight:bold'>";
			str +=		"Access denied! ";
			str	+=	"</span>";
			str +=	data["accessDenied"];
			str +="</div>";
	$("#content").html(str);
}

function returnedThread(data)
{
	if (data["accessDenied"]){
		accessDenied(data);
	}else {
		$(".threadTopic").html(data["thread"]["topic"]);
		$("#threadDescr").html(data["thread"]["description"]);
		var str = "<span id='threadDate'>";
				str += 	data["thread"]["datecreated"].substring(0, 16);
				str += "</span> by <span id='threadCreator'>a97marbr</span>";
		$("#threadDetails").html(str);
	}
}

function returnedComments(data)
{
	if (data["accessDenied"]){
		accessDenied(data);
	}else {
		// Adds the comment header with the amount of comments.
		var commentLength = data["comments"].length;
		var threadCommentStr = "<div id='threadCommentsHeader'>Comments ("  +  commentLength  + ")</div>";

		threadCommentStr += "<div class=\"allComments\">";

		// Iterates through all the comments
		$.each(data["comments"], function(index, value){
			threadCommentStr +=
			"<div class=\"threadComment\">" +
				"<div class=\"commentDetails\"><span id=\"commentUser\">" + value["username"]  +   "</span></div>" +
				"<div class=\"commentContent\"> <p>" +  value["text"]  + "</p></div>" +
				"<div class=\"commentFooter\">" +
						getCommentOptions(index, value['uid'], data['threadAccess'], data['uid'], data['comments'][index]['commentid']) +
				"</div>" +

				"<div class=\"commentDate\">" + (value["datecreated"]).substring(0,10) + "</div></div>";

			// Appends the comment
			$("#threadComments").html(threadCommentStr);
		});

		threadCommentStr += "</div>";
	}
}

function getCommentOptions (index, commentuid, threadAccess, uid, commentid){
	// console.log(commentid);
	var threadOptions = "";

	if (threadAccess){
		if (threadAccess !== "public"){
			threadOptions = "<input class=\"submit-button\" type=\"button\" value=\"Reply\" onclick=\"replyUI();\">";

			//console.log("uid " + uid + "commentuid " + commentuid);
			if (uid === commentuid){
				threadOptions += "<input class=\"submit-button\" type=\"button\" value=\"Edit\" onclick=\"editUI();\">";
			}
			if (threadAccess === "op" || threadAccess === "super" || uid === commentuid){
				threadOptions += "<input class=\"submit-button\" type=\"button\" value=\"Delete\" onclick=\"deleteComment("+commentid+");\">";
			}
		}
	}
	return threadOptions;
}

function replyUI()
{
	makeComment();
}

function makeCommentSuccess()
{
	getComments();
}

function deleteCommentSuccess(data)
{
	console.log(data);
	if (data["accessDenied"]){
		accessDenied(data);
	}else{
		getComments();
	}
}

function lockThreadSuccess(data)
{
	if (data["accessDenied"]){
		accessDenied(data);
	}else{
		getThread();
	}
}

function createThreadUI()
{
	$("#threadHeader").hide();
	$(".threadMakeComment").hide();
	$("#threadComments").hide();
	$("#createThreadWrapper").show();

	getCourses();
}

function writeText()
{
	$("#threadPreviewButton").removeClass("threadActiveButton");
	$("#threadWriteButton").addClass("threadActiveButton");
	$("#previewText").hide();
	$("#createThreadDescr").show();
}

function previewText()
{
	$("#threadWriteButton").removeClass("threadActiveButton");
	$("#threadPreviewButton").addClass("threadActiveButton");
	$("#createThreadDescr").hide();

	// Parse preview text...

	$("#previewText").show();
}

function returnedCourses(data) {
	console.log(data);
	var str;
	$.each(data['courses'], function() {
		str += "<option value='" + this[
			"cid"
		] + "'>" + this["coursecode"] + " - " + this["coursename"] + "</option>";
	});
	$("#createThreadCourseList").html(str);
}

function error(xhr, status, error)
{
	console.log("ERROOR");
	console.log(error);
	console.log(status);
	console.log(xhr);
}
