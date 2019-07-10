<?php 
$currentSite = basename($_SERVER['REQUEST_URI'], '.php');
function activeSite($site){
	global $currentSite;
	if($currentSite == $site){
		echo "active";
	}
}
?>

<nav class="navbar navbar-expand-sm navbar-dark bg-primary">
	<a class="navbar-brand" href="index.php">CLOBNET v0.8</a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Avaa valikko">
		<span class="navbar-toggler-icon"></span>
	</button>
	<div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item">
				<a class="nav-link <?php activeSite('clinical'); ?>" href="clinical.php">Clinical data</a>
			</li>
			<li class="nav-item">
				<a class="nav-link <?php activeSite('dataset'); ?>" href="dataset.php">Dataset</a>
			</li>
			<li class="nav-item">
				<a class="nav-link <?php activeSite('machine-learning'); ?>" href="machine-learning.php">Machine Learning</a>
			</li>
			<li class="nav-item">
				<a class="nav-link <?php activeSite('documentation'); ?>" href="documentation.php">Documentation</a>
			</li>
		</ul>
	</div>
</nav>