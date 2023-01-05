<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptTokenTable extends Migration
{
    public function up()
    {
        Schema::create('script_token', function (Blueprint $table) {

		$table->bigInteger('id',20)->unsigned();
		$table->string('shop_domain');
		$table->string('referer_domain')->nullable()->default('NULL');
		$table->integer('shop_id',10)->unsigned()->default('0');
		$table->tinyInteger('token_validate',1);
		$table->string('last_check',10)->nullable()->default('NULL');

        });
    }

    public function down()
    {
        Schema::dropIfExists('script_token');
    }
}