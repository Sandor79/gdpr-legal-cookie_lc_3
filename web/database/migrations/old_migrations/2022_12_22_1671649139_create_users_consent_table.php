<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersConsentTable extends Migration
{
    public function up()
    {
        Schema::create('users_consent', function (Blueprint $table) {

		$table->string('shop_id_date');
		$table->json('consent_data');
		$table->date('created_at')->nullable()->default('NULL');
		$table->date('updated_at')->nullable()->default('NULL');

        });
    }

    public function down()
    {
        Schema::dropIfExists('users_consent');
    }
}