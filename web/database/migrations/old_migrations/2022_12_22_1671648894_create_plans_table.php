<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlansTable extends Migration
{
    public function up()
    {
        Schema::create('plans', function (Blueprint $table) {

		$table->integer('id',10)->unsigned();
		$table->integer('type',11);
		$table->string('name');
		$table->decimal('price',8,2);
		$table->decimal('capped_amount',8,2)->nullable()->default('NULL');
		$table->text('terms');
		$table->integer('trial_days',11)->nullable()->default('NULL');
		$table->tinyInteger('test',1)->default('0');
		$table->tinyInteger('on_install',1)->default('0');
		$table->timestamp('created_at')->nullable()->default('NULL');
		$table->timestamp('updated_at')->nullable()->default('NULL');

        });
    }

    public function down()
    {
        Schema::dropIfExists('plans');
    }
}