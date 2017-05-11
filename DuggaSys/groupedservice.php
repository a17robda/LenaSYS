<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid=1;
	$loginname="UNK";		
	$lastname="UNK";
	$firstname="UNK";
} 	

// Options from AJAX 
$opt = getOP('opt');
$cid = getOP('cid'); // Course id
$vers = getOP('vers'); // Course version
$listentry = getOP('moment'); // Moment i.e (Biträkningsduggor 1)
$qvariant=getOP("qvariant");
$name=getOP("name");
$headings=array();

$data = []; // Array that contains all data generated by the queries in this file. To be written to JSON. 

$debug="NONE!"; // How is this used? Is it neccessary?

// Don't retreive all results if request was for a single dugga or a grade update
if(strcmp($opt,"GET")==0){
 	if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {

		// First query: get the headings for the table, which is the listentry names. 
		$query = $pdo->prepare("SELECT listentries.*,quizFile,COUNT(variant.vid) as qvariant FROM listentries LEFT JOIN quiz ON  listentries.link=quiz.id LEFT JOIN variant ON quiz.id=variant.quizID WHERE listentries.cid=:cid and listentries.vers=:vers and (listentries.kind=4) AND (listentries.grouptype=1 OR listentries.grouptype=3) GROUP BY lid ORDER BY pos;");

		/* // Constant parameters for testing.
		$cid = 2;
		$vers = 97732; */
		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $vers);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving moments and duggas. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		$currentMoment=null; // This is a mystery

		// Save the headings for the table 
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			array_push(
				$headings,
				array(
					'entryname' => $row['entryname'],
					'lid' => (int)$row['lid'],
					'kind' => (int)$row['kind'],
					'moment' => (int)$row['moment'],
					'visible'=> (int)$row['visible']
				)
			);
		}
		
		// Put it in the data array
		$data['moments'] = $headings;
		
		// Get a list of the lids, to be used when displayed to what group a user belongs 
		$lids = [];
		foreach($headings as $heading) {
			$lids[] = $heading['lid'];
		}
		
		// Take a copy of the lids
		$allLids = $lids;
		
		// Make it a array of keys with false as standard value 
		$lids = array_fill_keys($lids, false);
	
		// Second query: Select all users that are connected to the course and the current version of it. Order by the uid. 
		$query = $pdo->prepare("SELECT user.uid, user.firstname, user.lastname, user.ssn, user.username FROM user, user_course WHERE user.uid = user_course.uid AND user_course.cid = :cid AND user_course.vers = :vers ORDER BY user.username");
		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $vers);
		
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving moments and duggas. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		// Get the first two columns, which is the students and their groups. Save this information, and set the group assignments after the next query. 
		$studentData = $query->fetchAll(PDO::FETCH_ASSOC); // 2 rows initially. (count = 2)

		// Third query: Select all user id's that are connected to a group and their lid. 
		$query = $pdo->prepare("SELECT uug.uid, ug.lid, uug.ugid FROM user_usergroup AS uug, usergroup AS ug, listentries AS l WHERE uug.ugid = ug.ugid AND ug.lid = l.lid AND l.cid = :cid AND l.vers = :vers AND l.kind = 4 AND (l.grouptype = 1 OR l.grouptype = 3) ORDER BY uug.uid");

		$query->bindParam(':cid', $cid);
		$query->bindParam(':vers', $vers);

		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving moments and duggas. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}

		// Assigned courses
		$groupData = $query->fetchAll(PDO::FETCH_ASSOC);
	
		// Fourth query: Select all available groups
		$query = $pdo->prepare("SELECT lid, ugid, name FROM usergroup"); // Query to get all existing groups 
		
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error retreiving moments and duggas. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}
		
		$allGroups = $query->fetchAll(PDO::FETCH_ASSOC); // Contains all groups. 

		// Create array to hold the table contents. 
		$tableContent = [];
		
		foreach($studentData as &$studentRow) { // Iterate the student rows (& for keeping the array up to date)
			$lidstogroup = $lids;
			foreach($groupData as $groupRow) {
				// This checks which group is assigned. However, the existing groups must also be in the dropdown menu, so available groups must also be filled, with null. 
				if($studentRow['uid'] == $groupRow['uid']) {
					$lidstogroup[strval($groupRow['lid'])] = $groupRow['ugid']; // Put a new key with lid and a new value for the key, the group id 
				}
			}
			$studentRow['lidstogroup'] = $lidstogroup;
			array_push($tableContent, $studentRow);
		}
		
		// Create a array with lids as keys to contain the available groups per lid
		$groupsPerLids = array_flip($allLids);
	
		// Iterate groups and place per lid
		foreach($groupsPerLids as $lid => &$val) { // [2001] => 0, [2013] => 1
			foreach($allGroups as $group) {
				if($lid == $group['lid']) {
					$groupsPerLids[$lid] = array($group['ugid'] => $group['name']);
				}
			}
		}
		
		// Place the data in the output data array
		$data['tablecontent'] = $tableContent;
		$data['availablegroups'] = $groupsPerLids;
 	}
} else if(strcmp($opt,"NEWGROUP")==0){
	$query = $pdo->prepare("INSERT INTO `usergroup` (`ugid`, `name`, `created`, `lastupdated`) VALUES (DEFAULT, :name, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"); 
	$query->bindParam(':name', $name);

	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error updating entries".$error[2];
	}else{
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			array_push(
				$codeexamples,
				array(
					'ugid' => (int)$row['ugid'],
					'name' => $row['name'],
					'created' => $row['created'],
					'lastupdated' => $row['lastupdated']
				)
			);
		}
	}
} else if(strcmp($opt, "UPDATEGROUP") == 0) {
	$uid = getOP('uid');
	$lid = getOP('lid');
	$ugid = getOP('ugid');
	
	if($ugid > 0) { // User wants to assign to a group
		$query = $pdo->prepare("REPLACE INTO user_usergroup (uid, ugid) VALUES (:uid, :ugid)");
		$query->bindParam(":uid", $uid);
		$query->bindParam(":ugid", $ugid);
		
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error inserting/updating uid/ugid mapping. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}
	} else { // User wants to unassign from a group
		$query = $pdo->prepare("DELETE FROM user_usergroup WHERE uid = :uid AND ugid = :ugid"); // Remove where there is the combination of uid and ugid
		$query->bindParam(":uid", $uid);
		$query->bindParam(":ugid", $ugid);
		
		if(!$query->execute()) {
			$error=$query->errorInfo();
			$debug="Error deleting uid/ugid mapping. (row ".__LINE__.") ".$query->rowCount()." row(s) were found. Error code: ".$error[2];
		}
	}
	
}

if(isset($_SERVER["REQUEST_TIME_FLOAT"])){
		$serviceTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];	
		$benchmark =  array('totalServiceTime' => $serviceTime);
}else{
		$benchmark="-1";
}

// This is possibly needed later, for debugging and benchmarking and such.
$array = array(

	/* 
	'data' => $data,
	'debug' => $debug,
	'moment' => $listentry,
	'benchmark' => $benchmark */
);

// Print only the $data contents array as JSON for now. 
echo json_encode($data);
// logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php",$userid,$info);
?>
