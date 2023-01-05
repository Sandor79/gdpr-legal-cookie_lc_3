<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptStatsMonthlyTable extends Migration
{
    public function up()
    {
        Schema::create('script_stats_monthly', function (Blueprint $table) {

		$table->integer('shop_id',6)->unsigned()->nullable()->default('NULL');
		$table->integer('year',4);
		$table->string('01',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('02',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('03',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('04',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('05',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('06',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('07',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('08',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('09',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('10',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('11',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->string('12',256)->default('{"count":0,"type_0":0,"type_1":0,"type_2":0,"custom":0}');
		$table->integer('sum',11)->default('0');
		$table->integer('type_0',11)->default('0');
		$table->integer('type_1',11)->default('0');
		$table->integer('type_2',11)->default('0');
		$table->integer('custom',11)->default('0');
		$table->timestamp('updated_at')->default('CURRENT_TIMESTAMP');

        });
    }

    public function down()
    {
        Schema::dropIfExists('script_stats_monthly');
    }
}