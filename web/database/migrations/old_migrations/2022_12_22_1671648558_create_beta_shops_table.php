<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBetaShopsTable extends Migration
{
    public function up()
    {
        Schema::create('beta_shops', function (Blueprint $table) {

		$table->integer('id',11);
		$table->string('shopify_domain');
		$table->integer('shop_id',11);

        });
    }

    public function down()
    {
        Schema::dropIfExists('beta_shops');
    }
}