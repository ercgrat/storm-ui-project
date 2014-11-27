<?php
// Specify MIME Type to be a text/event stream for HTML5 server-side events
header("Content-type: text/event-stream\n\n");

// Require Redis autoloader and register with the Redis server
require '/home/eric/Predis/vendor/predis/predis/autoload.php';
Predis\Autoloader::register();

// Create new Predis client
$client = new Predis\Client();
$i = 0;
while(true) {
	echo "data" . $i . "\n\n";
	
	ob_flush();
	flush();
	sleep(4);
}

?>
