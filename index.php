<?php

// basic crawler detection and block script (no legit browser should match this)
if(!empty($_SERVER['HTTP_USER_AGENT']) and !preg_match('~(bot|crawl|facebookexternal|twitter|linkedin)~i', $_SERVER['HTTP_USER_AGENT'])){
    // this is a crawler -> show simplified site with just the essential data
    $index = file_get_contents('index.html');

    $ogStartTag = '<!-- PHP-REWRITE:ogTags -->';
    $ogEndTag = '<!-- /PHP-REWRITE -->';

    $posStart = strpos($index, $ogStartTag);
    $posEnd = strpos($index, $ogEndTag);

    // This is for showing single voluntaryWorkItem details
    $detailsTag = '<!-- PHP-REWRITE:vwDetails/ -->';
    $posDetails = strpos($index, $detailsTag);
    $toReplace = substr($index, $posDetails, strlen($detailsTag));
    if ($posDetails !== FALSE) {
    	// Fetch data from API...
    	$detailSegment = '
		<h1>Talkoot XY</h1>
		<p>Kuvaus...</p>
		<h3>Paikkakunta</h3>
		<p>Helsinki</p>
    	';
    	$index = str_replace($toReplace, $detailSegment, $index);
    }

    if ($posStart !== FALSE && $posEnd !== FALSE) {
    	// Tags were found, start constructing replacement
    	$replacementLength = ($posEnd - $posStart + strlen($ogEndTag));
    	$toReplace = substr($index, $posStart, $replacementLength);
    	$ogTag = '<meta property="og:%s" content="%s"/>';

    	// TODO: Construct data based on the fetched details
    	$ogData = array(
    		'title' => 'Sivu1',
    		'url' => 'http://www.foo.bar',
    		'image' => '',
    		'description' => ''
    	);

    	$replacement = '';
    	foreach ($ogData as $key => $value) {
    		$replacement += sprintf($ogTag, $key, $value) . "\n";
    	}
        $index = str_replace($toReplace, $replacement, $index);
    }

    // TODO: the above info could be cached, if possible, to avoid extra roundtrip
    echo($index);

} else {
	require('index.html');
}


?>