<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class Helpers
{
    /**
     * Iterate Object if keys exists.
     * Add Keys with delimiter '.'
     * @example isset( "foo.bar", object )
     * @param $path
     * @param $object
     * @return bool
     */
    public static function isset($path, $object): bool
    {
        $pathElements = preg_split("/\./", $path);
        $helper = $object;
        $result = true;

        if (!is_null($object)) {
            foreach ($pathElements as $key) {
                Log::debug(
                    $key,
                    ["isset => key", __LINE__, (explode('/web/', __FILE__)[1])]
                );
                if (isset($helper[$key])) {
                    $helper = $helper[$key];
                } else {
                    $result = false;
                }
            }
            return $result;
        }
        return false;
    }
}
