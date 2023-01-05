<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopsTable extends Migration
{
    public function up()
    {
        Schema::create('shops', function (Blueprint $table) {

		$table->integer('id',10)->unsigned();
		$table->string('shopify_domain');
		$table->string('shopify_token')->nullable()->default('NULL');
		$table->timestamp('created_at')->nullable()->default('NULL');
		$table->timestamp('updated_at')->nullable()->default('NULL');
		$table->tinyInteger('grandfathered',1)->default('0');
		$table->timestamp('deleted_at')->nullable()->default('NULL');
		$table->string('namespace')->nullable()->default('NULL');
		$table->integer('plan_id',10)->unsigned()->nullable()->default('NULL');
		$table->tinyInteger('freemium',1)->default('0');
		$table->date('create_stats_row')->nullable()->default('NULL');

        });
    }

    public function down()
    {
        Schema::dropIfExists('shops');
    }
}