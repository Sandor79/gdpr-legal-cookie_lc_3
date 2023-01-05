<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptStatsSumTable extends Migration
{
    public function up()
    {
        Schema::create('script_stats_sum', function (Blueprint $table) {

		$table->string('unique_id',10);
		$table->integer('count',11)->default('0');

        });
    }

    public function down()
    {
        Schema::dropIfExists('script_stats_sum');
    }
}