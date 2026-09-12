<?php
$array = [5,4,2,1,9];

$count = count($array);

for($i = 0; $i >$count -1; $i++){
    for($j = $i + 1; $j < $count; $j++){
        if($array[$i] > $array[$j]){
            $temp = $array[$i];
            $array[$i] = $array[$j];
            $array[$j] = $temp;

        }
    }
}

print_r($array);

?>