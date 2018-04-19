/********************************************************************************
   Documentation 
*********************************************************************************

This file displays the result of each student with access under this course, the teacher can grade students
in this page.

Execution order: 
#1 returnedFile() is first function to be called this then invokes returned() callback through AJAX
#2 the other funtions are executed and used as eventlisteners, e.g waiting for the user to do something before they are started
-------------==============######## Documentation End ###########==============-------------
*/

/********************************************************************************

   Globals <-- Next are globals - properly declared with var

*********************************************************************************/

var sessionkind = 0;
var querystring = parseGet();
var filez, fileLink;
var fileKind = "";
var searchterm = "";

AJAXService("GET",{cid:querystring['cid']},"FILE");

window.onresize = function() {
	fileLink.magicHeader();
} 

$(document).on('click','.last',function(e) {
    e.stopPropagation();
});

$(function() {
	$( "#release" ).datepicker({dateFormat: "yy-mm-dd"});
	$( "#deadline" ).datepicker({dateFormat: "yy-mm-dd"});
});

//-------------------------------------------------------------
// Renderer <- Ran after the ajax call (ajax is started after
//			   initialation of this file) is successful
//-------------------------------------------------------------
function returnedFile(data) {
	filez = data;

    var tabledata = {
    	tblhead:{
    		fileid:"File ID",
    		filename:"File name",
    		extension:"Extension",
    		filesize:"Size",
    		uploaddate:"Upload date",
    		trashcan:"Delete",
    		editor:"Editor"
    	},
    	tblbody: data['entries'],
    	tblfoot:[]
    }

    fileLink = new SortableTable(
		tabledata,
		"fileLink",
		null,
		"",
        renderCell,
        null,
        null,
        rowFilter,
        [],
        [],				
        "",
        null,
        null,
		null,
		null,
		null,
        null,
		true
	);

	fileLink.renderTable();

	if(data['debug']!="NONE!") alert(data['debug']);
	makeAllSortable();
} 

//----------------------------------------------------------------
// makeSortable(table) <- Makes a table sortable and also allows
//						  the table to collapse when user double
//						  clicks on table head.
//----------------------------------------------------------------
function makeSortable(table) {
	var DELAY = 200;
	var clicks = 0;
	var timer = null;
	var th = table.tHead, i;
	th && (th = th.rows[0]) && (th = th.cells);
	if (th) i = th.length;
	else return; // if no `<thead>` then do nothing
	while (--i >= 0) (function (i) {
		var dir = 1;
		th[i].addEventListener('click', function (e) {
			clicks++;
			if(clicks === 1) {
				timer = setTimeout(function () {
					sortTable(table, i, (dir = 1 - dir));
					clicks = 0;
                }, DELAY);
            } else {
                clearTimeout(timer);
                $(this).closest('table').find('tbody').fadeToggle(500,'linear'); //perform double-click action
                if ($(this).closest('tr').find('.arrowRight').css('display') == 'none') {
    	            $(this).closest('tr').find('.arrowRight').delay(200).slideToggle(300,'linear');
    	            $(this).closest('tr').find('.arrowComp').slideToggle(300,'linear');
				} else if ($(this).closest('tr').find('.arrowComp').css('display') == 'none') {
					$(this).closest('tr').find('.arrowRight').slideToggle(300,'linear');
    	            $(this).closest('tr').find('.arrowComp').delay(200).slideToggle(300,'linear');
				} else {
					$(this).closest('tr').find('.arrowRight').slideToggle(300,'linear'); 
					$(this).closest('tr').find('.arrowComp').slideToggle(300,'linear');
				}
                clicks = 0; //after action performed, reset counter
            }
        });
        th[i].addEventListener('dblclick', function(e) {
            e.preventDefault();
        })
    }(i));
}

//---------------------------------------------------------------------------
// makeAllSortable(parent) <- Makes all tables within given scope sortable.
//---------------------------------------------------------------------------
function makeAllSortable(parent) {
	parent = parent || document.body;
	var t = parent.getElementsByTagName('table'), i = t.length;
	while (--i >= 0) makeSortable(t[i]);
}

//-----------------------------------------------------------------
// sortTable(table, col, reverse) <- Sorts table based on given
//									 column and whether or not to
//								     reverse the sorting.
//-----------------------------------------------------------------
function sortTable(table, col, reverse) {
    var tb = document.getElementById('fileLink_tbl').tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
        i;
    reverse = -((+reverse) || -1);
    tr = tr.sort(function (a, b) { // sort rows
		return reverse // `-1 *` if want opposite order
		* (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
            .localeCompare(b.cells[col].textContent.trim())
        );
    });
    for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
}

function showLinkPopUp() {
	$("#uploadbuttonname").html("<input class='submit-button' type='submit' value='Upload URL' />");
	$("#addFile").css("display","flex");
	$(".filePopUp").css("display","none");
	$(".linkPopUp").css("display","block");
	$("#selecty").css("display","none");
	$("#kind").val("LINK");
	$("#cid").val(querystring['cid']);
	$("#coursevers").val(querystring['coursevers']);
}

function showFilePopUp() {
    $("#uploadbuttonname").html("<input id='file-submit-button' class='submit-button' type='submit' " +
    	"value='Upload file' onclick='setFileKind();uploadFile(fileKind);' />");
	$("#selecty").css("display","block");
	$("#addFile").css("display","flex");
	$(".filePopUp").css("display","block");
	$(".linkPopUp").css("display","none");
}

//---------------------------------------------------
// setFileKind <- Sets the file kind based on which
// 				  radio button the user has pressed
//---------------------------------------------------
function setFileKind() {
	fileKind = document.querySelector('input[name=\"fileRB\"]:checked').value;
}

function uploadFile(kind) {
	if (kind == "MFILE") {
		var str = "<option>NONE</option>";
		for (i = 0; i < filez['lfiles'].length; i++) {
			var item = filez['lfiles'][i];
			if (item != ".." && item != ".") str += "<option>" + item + "</option>";
		}
		$("#selectedfile").html(str);
	} else if (kind == "GFILE") {
		var str = "<option>NONE</option>";
		for (i = 0; i < filez['gfiles'].length; i++) {
			var item = filez['gfiles'][i];
			if (item != ".." && item != ".") str += "<option>" + item + "</option>";
		}
		$("#selectedfile").html(str);			
	} else if (kind == "LFILE" || kind == "LINK") {
		$("#selecty").css("display","none");				
	}
  
	$("#kind").val(kind);
	$("#cid").val(querystring['cid']);
	$("#coursevers").val(querystring['coursevers']);
}

function closeAddFile() {
	$("#addFile").css("display","none");
}

//------------------------------------------------------------------
// validateForm <- Validates the file that is going to be uploaded
//------------------------------------------------------------------
function validateForm() {	
	var result;
	//Validation for links
	if ($(".linkPopUp").css('display') == 'block') {
		//Check if the link starts with http:// or https://
		if (document.getElementById('uploadedlink').value.substr(0,7).toLowerCase() == "http://") {
			result = true;
		} else if (document.getElementById('uploadedlink').value.substr(0,8).toLowerCase() == "https://") {
			result = true;
		} else {
			$("#errormessage").css("display","block");
			$("#errormessage").html("<div class='alert danger'>Link has to start with \"http://\" or \"https://\" </div>");
			$("#uploadedlink").css("background-color", "rgba(255, 0, 6, 0.2)");
			result = false;
		}
	} else {
		result = true;
	} 
	return result;
}

function showLoginPopup() {
	$("#loginBox").css("display","flex");
}

function hideLoginPopup() {
	$("#loginBox").css("display","none");
}

//----------------------------------------------------------------------------
// renderCell <- Callback function that renders a specific cell in the table
//----------------------------------------------------------------------------
function renderCell(col,celldata,cellid) {
	var list = celldata.split('.');
	var link = celldata.split('://');
	if (col == "trashcan") {
		obj = JSON.parse(celldata);
	    str = "<div class='iconBox'><img id='dorf' class='trashcanIcon' src='../Shared/icons/Trashcan.svg' ";
		str += " onclick='deleteFile(\"" + obj.fileid + "\",\"" + obj.filename + "\");' ></div>";
		return str;
	} else if (col == "filename") {
		if (link[0] == "https" || link[0] == "http") {
			return "<a href='" + celldata + "' target='_blank'>" + celldata + "</a>";
		} else {
			// Goes through the previously split parts of the file name
			// and adds dots to keep the actual file name correct
			var listStr = "";
			for (var i = 0; i < list.length - 1; i++) {
				listStr += list[i];
				if (i != list.length - 2) {
					listStr += ".";
				}
			}
			return "<div>" + listStr + "</div>";
		}
	} else if (col == "extension") {
	    return "<div>" + list[list.length - 1] + "</div>";
	} else if (col == "editor") {
		if(link[0] == "https" || link[0] == "http"){
			str = "";
		} else {
			str = "<div class='iconBox'><img id='dorf' class='markdownIcon' src='../Shared/icons/markdownPen.svg' ></div>";
		}
		return str;
	}
	return celldata;
}

//----------------------------------------------------------------
// rowFilter <- Callback function that filters rows in the table
//----------------------------------------------------------------
function rowFilter(row) {
	for (key in row) {
		if (row[key] != null) {
			if (row[key].toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
		}
	}
	return false;
}

function formatBytes(bytes,decimals) {
   if (bytes == 0) return '0 Bytes';
   var k = 1000,
       dm = decimals + 1 || 3,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function convertFileKind(kind){
	var retString = "";
	if (kind == "1") {
        retString = "Link";
	} else if (kind == "2") {
        retString = "Global";
	} else if (kind == "3") {
        retString = "Course local";
	} else if (kind == "4") {
        retString = "Local";
	} else {
        retString = "Not recognized";
	}
	return retString;
}

function deleteFile(fileid,filename) {
	if (confirm("Do you really want to delete the file/link: " + filename)) {
		AJAXService("DELFILE",{fid:fileid,cid:querystring['cid']},"FILE");
	}
	/*Reloads window when deleteFile has been called*/
	window.location.reload(true);
}