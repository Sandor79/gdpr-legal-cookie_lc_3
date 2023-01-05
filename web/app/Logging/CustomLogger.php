<?php

namespace App\Logging;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Monolog\Logger;

class CustomLogger
{
    public static function debug(string $type, string $message, array $context = [])
    {
        self::handler([
            "level" => Logger::DEBUG,
            "caller" => "debug",
            "type" => $type,
            "message" => $message,
            "context" => $context
        ]);
    }
    public static function info(string $type, string $message, array $context = [])
    {
        self::handler([
            "level" => Logger::INFO,
            "caller" => "info",
            "type" => $type,
            "message" => $message,
            "context" => $context
        ]);
    }
    public static function notice(string $type, string $message, array $context = [])
    {
        self::handler([
            "level" => Logger::NOTICE,
            "caller" => "notice",
            "type" => $type,
            "message" => $message,
            "context" => $context
        ]);
    }
    public static function warning(string $type, string $message, array $context = [])
    {
        self::handler([
            "level" => Logger::WARNING,
            "caller" => "warning",
            "type" => $type,
            "message" => $message,
            "context" => $context
        ]);
    }
    public static function error(string $type, string $message, array $context = [])
    {
        self::handler([
            "level" => Logger::ERROR,
            "caller" => "error",
            "type" => $type,
            "message" => $message,
            "context" => $context
        ]);
    }
    public static function critical(string $type, string $message, array $context = [])
    {
        self::handler([
            "level" => Logger::CRITICAL,
            "caller" => "critical",
            "type" => $type,
            "message" => $message,
            "context" => $context
        ]);
    }
    public static function alert(string $type, string $message, array $context = [])
    {
        self::handler([
            "level" => Logger::ALERT,
            "caller" => "alert",
            "type" => $type,
            "message" => $message,
            "context" => $context
        ]);
    }
    public static function emergency(string $type, string $message, array $context = [])
    {
        self::handler([
            "level" => Logger::EMERGENCY,
            "caller" => "emergency",
            "type" => $type,
            "message" => $message,
            "context" => $context
        ]);
    }
    private static function createPath(string $type, string $level): string
    {
        return storage_path('logs/' . $type . '/' . Logger::getLevelName($level) . '/' . date('l') . '.log');
    }
    private static function handler(array $config)
    {
        if (Config::get('logging.custom_types.' . $config["type"])) {
            $path = self::createPath($config["type"], $config["level"]);
            $channel = Log::build([
                'driver' => 'single',
                'path' => $path,
            ]);
            Log::stack(['stack', $channel])->{$config["caller"]}(
                $config["message"],
                $config["context"]
            );
        }
    }
}
