<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartnersTable extends Migration
{
    public function up()
    {
        Schema::create('partners', function (Blueprint $table) {

		$table->bigInteger('id',20)->unsigned();
		$table->string('name');
		$table->string('contact_name')->nullable()->default('NULL');
		$table->string('phone_number')->nullable()->default('NULL');
		$table->string('email')->nullable()->default('NULL');
		$table->string('www')->nullable()->default('NULL');
		$table->string('logo')->nullable()->default('NULL');
		$table->string('hash');
		$table->tinyInteger('isActive',4);
		$table->bigInteger('activated_on',20)->nullable()->default('NULL');
		$table->integer('trial_days',11);
		$table->string('terms');
		$table->timestamp('created_at')->nullable()->default('NULL');
		$table->timestamp('updated_at')->nullable()->default('NULL');

        });
    }

    public function down()
    {
        Schema::dropIfExists('partners');
    }
}