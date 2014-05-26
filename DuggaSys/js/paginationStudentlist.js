function pagination() {
	this.items = [];
	// Amount of cells in a row
	this.cells = 9;
	this.show_per_page = 10;
	
	this.number_of_items = 0;
	this.number_of_pages = 0;
	
	this.max_pages = 5;
	
	this.currentPage = 0;
	
	this.renderPages = function() {
		$('#pages').empty();
		if (pagination.number_of_pages > 1) {
			var minRange = 1;
			var maxRange = this.max_pages;
			
			if (this.currentPage + 2 >= this.max_pages) {
				var diff = (this.currentPage + 2) - this.max_pages;
				minRange += diff;
				maxRange += diff;
			}
			
			if (this.currentPage + 1 >= this.max_pages) {
				$('#pages').append("<div class='page' onClick='pagination.goToPage("+0+")'>First page</div>");
			}
			
			$('#pages').append("<div class='page' onClick='pagination.previous()'>Previous</div>");
			
			for (i = minRange; i <= maxRange; i++) {
				if (i <= this.number_of_pages) {
					if (this.currentPage + 1 == i) {
						$('#pages').append("<div class='page selected' onClick='pagination.goToPage("+(i-1)+")'>"+i+"</div>");
					} else {
						$('#pages').append("<div class='page' onClick='pagination.goToPage("+(i-1)+")'>"+i+"</div>");
					}
				} else {
					break;
				}
			}
			$('#pages').append("<div class='page' onClick='pagination.next()'>Next</div>");
			if (this.max_pages < this.number_of_pages && this.currentPage + 1 != this.number_of_pages) {
				$('#pages').append("<div class='page' onClick='pagination.goToPage("+(this.number_of_pages-1)+")'>Last page</div>");
			}
		}
	}
	
	this.goToPage = function(page) {
		this.currentPage = page;
		this.clearRows();
		this.showContent($("#searchbox").val());
		this.renderPages($("#searchbox").val());
	}
	
	this.next = function() {
		if (this.currentPage + 1 < this.number_of_pages) {
			this.goToPage(this.currentPage + 1);
		}
	}
	
	this.previous = function() {
		if (this.currentPage > 0) {
			this.goToPage(this.currentPage - 1);
		}
	}

	this.showContent = function(data) {
		data = data || null;
		var table = document.getElementById("contentlist");
		// If there are any items to print
		if (this.number_of_items > 0) {
			// Print items currentPage * show_per_page to show_per_page * (currentPage + 1)
			var modulo = (this.currentPage * this.show_per_page);
			var n = modulo;
			for (i = modulo; i < (this.show_per_page * (this.currentPage + 1));) {
				// If item is defined
				if (this.items.entries[n]) {
					if (data == null || this.items.entries[n]['username'].toLowerCase().indexOf(data.toLowerCase()) > -1) {
						// Insert row below <th>
						var row = table.insertRow(modulo % this.show_per_page + 1);
						if (this.items.entries[n]["expired"]) {
							row.className = "yellow";
						} else if (parseInt(this.items.entries[n]["grade"]) >= 3) {
							row.className = "green";
						} else if (parseInt(this.items.entries[n]["grade"]) < 3) {
							row.className = "red";
						}
						for (j = 0; j < this.cells; j++) {
							var cell = row.insertCell(j);
							switch (j) {
								case 0:
									cell.innerHTML = this.items.entries[n]["username"];
									break;
								case 1:
									cell.innerHTML = this.items.entries[n]["name"];
									break;
								case 2:
									cell.innerHTML = this.items.entries[n]["start"];
									break;
								case 3:
									cell.innerHTML = this.items.entries[n]["deadline"];
									break;
								case 4:
									cell.innerHTML = this.items.entries[n]["submitted"];
									break;
								case 5:
									if (parseInt(this.items.entries[n]["gradesystem"]) == 1) {
										if (parseInt(this.items.entries[n]["grade"]) > 0) {
											cell.innerHTML = "G";
										} else {
											cell.innerHTML = "U";
										}
									} else if (parseInt(this.items.entries[n]["gradesystem"]) == 2) {
										if (parseInt(this.items.entries[n]["grade"]) == 1) {
											cell.innerHTML = "G";
										} else if (parseInt(this.items.entries[n]["grade"]) >= 2) {
											cell.innerHTML = "VG";
										} else {
											cell.innerHTML = "U";
										}
									} else {
										if (parseInt(this.items.entries[n]["grade"]) >= 3) {
											cell.innerHTML = this.items.entries[n]["grade"];
										} else if (parseInt(this.items.entries[n]["grade"]) < 3) {
											cell.innerHTML = "U";
										}
									}
									break;
								case 6:
									cell.innerHTML = this.items.entries[n]["answer"];
									break;
								case 7:
									cell.innerHTML = this.items.entries[n]["correctAnswer"];
									break;
								case 8:
									cell.innerHTML = this.items.entries[n]["link"];
									break;
							}
						}
						modulo++;
						i++;
					}
				} else {
					// No more items to print
					break;
				}
				n++;
			}
		} else {
			$('#content').empty();
			$('#content').append("<div class='no_results'>There is currently no content available in the database</div>");
			page.title("No content");
		}
	}

	this.clearRows = function() {
		var table = document.getElementById('contentlist');
		var tableRows = table.getElementsByTagName('tr');
		var rowCount = tableRows.length;

		for (var x = rowCount-1; x>0; x--) {
		   tableRows[x].remove();
		}
	}
	
	this.calculatePages = function(data) {
		data = data || null;
		if (data != null && data != "") {
			var count = 0;
			for (i = 0; i < this.number_of_items; i++) {
				if (this.items.entries[i]['username'].toLowerCase().indexOf(data.toLowerCase()) > -1) {
					count++;
				}
			}
			this.setPages(count);
		} else {
			this.setPages(this.number_of_items);
		}
		this.currentPage = 0;
	}
	
	this.setPages = function(items) {
		this.number_of_pages = Math.ceil(items/pagination.show_per_page);
	}
}

function getResults(pagination, course, quiz) {
	$.ajax({
		dataType: 'json',
		async: false,
		url: 'ajax/studentlist_results.php',
		method: 'post',
		data: {
			'courseid': course,
			'quizid': quiz
		},
		success: function(data) {
			if (data == "No access") {
				changeURL('noid');
			} else {
				pagination.items = data;
				pagination.number_of_items = pagination.items.entries.length;
				pagination.calculatePages();
				if (pagination.number_of_pages > 1) {
					$('#content').append("<div id='pages'></div>");
					pagination.renderPages();
				}
			}
		}
	});
}