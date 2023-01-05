<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptStatisticSumMinuteTable extends Migration
{
    public function up()
    {
        Schema::create('script_statistic_sum_minute', function (Blueprint $table) {

		$table->timestamp('time')->default('CURRENT_TIMESTAMP');
		$table->integer('count',11);

        });
    }

    public function down()
    {
        Schema::dropIfExists('script_statistic_sum_minute');
    }
}