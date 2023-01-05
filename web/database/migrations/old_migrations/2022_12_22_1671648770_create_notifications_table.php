<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {

		$table->char('id',36);
		$table->string('type');
		$table->string('notifiable_type');
		$table->bigInteger('notifiable_id',20)->unsigned();
		$table->text('data');
		$table->timestamp('read_at')->nullable()->default('NULL');
		$table->timestamp('created_at')->nullable()->default('NULL');
		$table->timestamp('updated_at')->nullable()->default('NULL');

        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}