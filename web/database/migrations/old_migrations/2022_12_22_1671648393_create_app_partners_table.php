<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppPartnersTable extends Migration
{
    public function up()
    {
        Schema::create('app_partners', function (Blueprint $table) {

		$table->integer('id',11);
		$table->string('app_partner_name');
		$table->string('app_shopify_app_store_partner_link');
		$table->integer('app_partner_activated',11);
		$table->datetime('created_at')->default('CURRENT_TIMESTAMP');
		$table->datetime('updated_at')->default('CURRENT_TIMESTAMP');

        });
    }

    public function down()
    {
        Schema::dropIfExists('app_partners');
    }
}