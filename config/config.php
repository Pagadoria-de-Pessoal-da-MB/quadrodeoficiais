<?php
try {
    $pdo = new PDO('pgsql:host=localhost;dbname=paginadeoficiais', 'postgres', 'postgres');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES 'UTF8'");
} catch (PDOException $e) {
    die('N�o foi poss�vel conectar ao banco de dados: ' . $e->getMessage());
}
?>
