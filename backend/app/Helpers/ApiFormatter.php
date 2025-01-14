<?php

namespace App\Helpers;

class ApiFormatter
{
    protected static $response = [
        "status" => null,
        "status_code" => null,
        "message" => null,
        "data" => null
    ];

    public static function sendResponse($status = NULL, $status_code = NULL, $message = NULL, $data = [])
    {
        self::$response["status"] = $status;
        self::$response["status_code"] = $status_code;
        self::$response["message"] = $message;
        self::$response["data"] = $data;

        if (empty($data)) {
            unset(self::$response["data"]);
        }

        return response()->json(self::$response, self::$response["status_code"]);
    }
}