<?php
    $host        = "host = <IP adress>";
    $port        = "port = <Port>";
    $dbname      = "dbname = <DB name>";
    $credentials = "user = <User> password=<password>";
    $db = pg_connect( "$host $port $dbname $credentials");    
?>