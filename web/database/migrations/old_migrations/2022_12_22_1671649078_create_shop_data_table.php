<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopDataTable extends Migration
{
    public function up()
    {
        Schema::create('shop_data', function (Blueprint $table) {

		$table->bigInteger('id',20)->unsigned();
		$table->string('shop_object');
		;
		$table->string('email');
		$table->string('domain');
		$table->string('plan_display_name',100);
		$table->string('plan_name',100);
		$table->string('country_code',5);
		$table->tinyInteger('has_install',4);
		$table->timestamp('timestamp')->nullable()->default('NULL');
		$table->timestamp('update_timestamp')->nullable()->default('NULL');
		$table->string('version',50);
		$table->tinyInteger('has_uninstall',4)->nullable()->default('NULL');

        });
    }

    public function down()
    {
        Schema::dropIfExists('shop_data');
    }
}