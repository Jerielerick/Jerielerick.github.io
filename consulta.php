<?php
// Configura la conexión a la base de datos (ajusta según tus configuraciones)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "appweb";

// Crea la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Realiza la consulta a la base de datos
$result = $conn->query("SELECT * FROM tu_tabla");

// Prepara los resultados para ser enviados como JSON
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Cierra la conexión
$conn->close();

// Envía los datos como JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
