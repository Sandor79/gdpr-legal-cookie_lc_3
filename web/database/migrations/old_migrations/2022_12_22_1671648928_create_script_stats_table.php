<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptStatsTable extends Migration
{
    public function up()
    {
        Schema::create('script_stats', function (Blueprint $table) {

		$table->integer('id',6)->unsigned();
		$table->string('shop_id_date',100);
		$table->integer('shop_id',6)->unsigned()->nullable()->default('NULL');
		$table->integer('date_day',2)->nullable()->default('NULL');
		$table->integer('date_month',2)->nullable()->default('NULL');
		$table->integer('date_year',4)->nullable()->default('NULL');
		$table->integer('count',8)->nullable()->default('NULL');

        });
    }

    public function down()
    {
        Schema::dropIfExists('script_stats');
    }
}