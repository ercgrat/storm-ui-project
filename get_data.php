<?php

// Require Redis autoloader and register with the Redis server
require '/home/eric/Predis/vendor/predis/predis/autoload.php';
Predis\Autoloader::register();

// Use Ratchet classes for communicating over web sockets
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
require '/home/eric/Ratchet/vendor/autoload.php';

// Create new Predis client
$client = new Predis\Client();

// Define communication class
class StormConnection implements MessageComponentInterface {
	protected $clients;

	public function __construct() {
		$this->clients = new \SplObjectStorage;
	}

	public function onOpen(ConnectionInterface $conn) {
		$this->clients->attach($conn);
		echo "New connection!";		
	}

	public function onMessage(ConnectionInterface $from, $msg) {
		$from->send("HEY~!");		
	}
	
	public function onClose(ConnectionInterface $conn) {
		
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		
	}
}

$server = IoServer::factory(new HttpServer(new WsServer(new StormConnection())), 8080);
$server->run();

?>
