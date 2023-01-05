<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartnerShopsTable extends Migration
{
    public function up()
    {
        Schema::create('partner_shops', function (Blueprint $table) {

		$table->bigInteger('id',20)->unsigned();
		$table->string('shopify_domain');
		$table->string('partner');
		$table->timestamp('created_at')->nullable()->default('NULL');
		$table->timestamp('updated_at')->nullable()->default('NULL');
		$table->bigInteger('partner_id',20)->unsigned()->nullable()->default('NULL');

        });
    }

    public function down()
    {
        Schema::dropIfExists('partner_shops');
    }
}