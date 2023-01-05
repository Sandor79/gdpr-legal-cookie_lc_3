<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChangeLogTable extends Migration
{
    public function up()
    {
        Schema::create('change_log', function (Blueprint $table) {

		$table->bigInteger('id',20)->unsigned();
		$table->integer('shop_id',10)->unsigned()->default('0');
		$table->string('shop_domain');
		$table->bigInteger('field_id',20);
		;
		$table->tinyInteger('is_live',1);
		$table->timestamp('timestamp_change')->default('CURRENT_TIMESTAMP');

        });
    }

    public function down()
    {
        Schema::dropIfExists('change_log');
    }
}