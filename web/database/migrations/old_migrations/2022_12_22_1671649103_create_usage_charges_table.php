<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsageChargesTable extends Migration
{
    public function up()
    {
        Schema::create('usage_charges', function (Blueprint $table) {

		$table->bigInteger('id',20);
		$table->bigInteger('charges_charge_id',20);
		$table->string('description',256);
		$table->decimal('price',5,2);
		$table->timestamp('created_at')->default('CURRENT_TIMESTAMP');
		$table->date('billing_on')->nullable()->default('NULL');
		$table->decimal('balance_used',5,2);
		$table->decimal('balance_remaining',5,2);

        });
    }

    public function down()
    {
        Schema::dropIfExists('usage_charges');
    }
}