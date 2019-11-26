<?php
$CONFIG_TARGET_TIME = "2019-12-24T18:00:00";
$CONFIG_SECRET_FILENAME = "~/.htsecret";

$CONFIG_TEST_PARAM = "currentTime";
$CONFIG_TEST_CONFIRMSECRET = "secret";
$CONFIG_FAKE_SECRET = "TestSecret";
// --------------------------------------------------------

$secretStatus = "unknown";
$secret = "ERROR_NO_SECRET_TOKEN_SET";

if (!file_exists($CONFIG_SECRET_FILENAME)) {
	$secretStatus = "file with secret token not found";
} else {
	$file = @fopen($CONFIG_SECRET_FILENAME, 'r');
	if ($file === false) {
		$secretStatus = "file with secret token could not be opened";
	} else {
		$secret = trim(fgets($file, 1024));
		$secretStatus = "Secret loaded, " . strlen($secret) . " characters";
	}
}

$currentTime = time();
$targetTimeString = $CONFIG_TARGET_TIME;
$result = array();

if (isset($_GET[$CONFIG_TEST_PARAM])) {
	$secret = $CONFIG_FAKE_SECRET;
	$result['mode'] = "dev";
    $currentTimeString = $_GET[$CONFIG_TEST_PARAM];
	$currentTime = strtotime($currentTimeString);
	if ($currentTime === false) {
		echo "Error: cannot parse current time: " . $currentTimeString;
		exit();
	}
}

if (isset($_GET[$CONFIG_TEST_CONFIRMSECRET])) {
	$result['status'] = $secretStatus;
}

$targetTime = strtotime($targetTimeString);
if ($targetTime === false) {
	echo "Error: cannot parse target time: " . $targetTimeString;
	exit();
}

$result['currentTime'] = date(DATE_ATOM, $currentTime);
$result['targetTime'] = date(DATE_ATOM, $targetTime);

$remainingTime = $targetTime - $currentTime;
if ($remainingTime > 0) {
	$result['countdown'] = $remainingTime;
} else {
	$result['countdown'] = 0;
	$result['secret'] = $secret;
}

header('Content-type: application/json');
echo json_encode($result);

?>
