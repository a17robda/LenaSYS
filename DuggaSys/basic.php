<?php

//------------------------------------------------------------------------------------------------
// getOP
//------------------------------------------------------------------------------------------------
//
// Reads service Parameter from POST encoding using entities
//

function getOP($name)
{
		if(isset($_POST[$name]))	return urldecode($_POST[$name]);
		else return "UNK";			
}

//------------------------------------------------------------------------------------------------
// getOP
//------------------------------------------------------------------------------------------------
//
// Reads service Parameter from POST encoding using entities
//

function getOPG($name)
{
		if(isset($_GET[$name]))	return urldecode($_GET[$name]);
		else return "UNK";			
}

//------------------------------------------------------------------------------------------------
// makeRandomString
//------------------------------------------------------------------------------------------------
//
// Makes a random string of length X
//

function makeRandomString($length = 6) {
    $validCharacters = "abcdefghijklmnopqrstuxyvwzABCDEFGHIJKLMNOPQRSTUXYVWZ+-*#&@!?";
    $validCharNumber = strlen($validCharacters);
    $result = "";
    for ($i = 0; $i < $length; $i++) {
    	$index = mt_rand(0, $validCharNumber - 1);
      $result .= $validCharacters[$index];
    }
    return $result;
}

?>