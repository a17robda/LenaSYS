<?php
	$files = array();
	$error = false;
	if(isset($_GET['lib'])) {
		// TODO: Sanitize $libName  <-------------
		$libName = $_GET['lib'];
		
		$uploaddir = "librarys/".$libName;
		if(!file_exists($uploaddir)) {
			mkdir($uploaddir, 0777);
		}
	}
	else {
		$error = true;
		$data = array("ERROR" => "No library name.");		
	}

	
	if(!$error) {
		foreach($_FILES as $file) {
			$filename = basename($file['name']);
			$fileext = substr(strrchr($filename,'.'),1);
			// Encrypt file name to ensure duplicate file names can co-exist (16 char names)
			$encrypted_filename = "i".substr(md5($filename.date("YmdHis")),0,15);
			
			// Put it all together
			$finalPath = $uploaddir."/".$encrypted_filename.".".$fileext;
			
			// Upload the file.
			if(move_uploaded_file($file["tmp_name"], $finalPath)) {
				$files[] = $uploaddir.$file["name"];
			}
			else {
				$error = true;
				$data = array("ERROR" => "Couldn't execute move_uploaded_file.");
			}
		}		
		if(!$error) {
			$data = array("SUCCESS" => $finalPath);
		}
	}
	
	// Give response
	
	echo json_encode($data);
	
?>