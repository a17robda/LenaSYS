<?php
include_once(dirname(__FILE__) . "/../../Shared/sessions.php");
session_start();
if(checklogin()) {
	if(isSuperUser($_SESSION["uid"])) {
?>

	<div id='create'>
		<form role="form" name='newCourse'>
			<div class='form-group'>
				<label>Course name</label>
				<input type="text" name="coursename" class="form-control" />
				<label>Course code</label>
				<input type="text" name="coursecode" class="form-control" />
			</div>
			<div class='form-group'>
				<label>Select visibility for course</label>
				<select name="visib" class='form-control'>
					<option id="select-opt" value="-1">Select</option>
					<option class="select-opt" value="0">Hidden</option>
					<option class="select-opt" value="1">Public</option>
				</select>
				<sub style="font-size:.8em; font-style:itelic;">Open if accessible to the public. Closed if only accessible by course-registered users</sub>
			</div>
			<button type='button' onclick="warningBox('Confirm creation', 'Do you want to create the course?', 0, submitNewCourse)" class='default'>Create Course</button>
            <button type='button' onclick='historyBack()' class='default-red'>Cancel</button>

		</form>
	</div>
	<script type="text/javascript" src="js/ajax.js"></script>
	<script type="text/javascript" src="js/verificationFunctions.js"></script>
	<script type="text/javascript">page.title("Create new course");</script>
<?php
	}
}
?>