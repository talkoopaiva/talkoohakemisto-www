<?php

// basic crawler detection and block script (no legit browser should match this)
//if(!empty($_SERVER['HTTP_USER_AGENT']) and !preg_match('~(bot|crawl|facebookexternal|twitter|linkedin)~i', $_SERVER['HTTP_USER_AGENT'])){

    // this is a crawler -> show simplified site with just the essential data
    $index = file_get_contents('index.html');

    $phpself = $_SERVER['PHP_SELF'];

    if (preg_match("/\/view\//i", $phpself)) {

        $id = (int)end(explode("/", $phpself));

        $ogStartTag = '<!-- PHP-REWRITE:ogTags -->';
        $ogEndTag = '<!-- /PHP-REWRITE -->';

        $posStart = strpos($index, $ogStartTag);
        $posEnd = strpos($index, $ogEndTag);

        // This is for showing single voluntaryWorkItem details
        $detailsTag = '<!-- PHP-REWRITE:vwDetails/ -->';
        $posDetails = strpos($index, $detailsTag);
        $toReplace = substr($index, $posDetails, strlen($detailsTag));

        // Fetch data from API...
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://jaffatron.com:5000/voluntary_works/" . $id);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        $out = json_decode($output);
        $vw = $out->voluntary_works[0];
        $muni = $out->linked->municipalities[0]->name;
        $type = strtolower($out->linked->types[0]->name);

        if ($posDetails !== FALSE) {

            $detailSegment = '
            <h1>'. $vw->name .'</h1>
            <p>'. $vw->description .'</p>
            <h3>'. $muni .'</h3>
            <p>'. $type .'</p>
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
                'title' => 'Talkoopäivä 17.5. '.$vw->name.', '.$muni,
                'url' => 'http://hakemisto.talkoot.fi/index.php?id=' . $id,
                'image' => 'http://talkoot.fi/hakemisto/app/img/icons/'. $type .'.png',
                'description' => $wv->description
            );

            $replacement = '';
            foreach ($ogData as $key => $value) {
                $replacement .= sprintf($ogTag, $key, $value) . "\n";
            }

            $index = str_replace($toReplace, $replacement, $index);
        }
    }
    // TODO: the above info could be cached, if possible, to avoid extra roundtrip
    echo($index);
/*
} else {
	require('index.html');
}
*/

?>