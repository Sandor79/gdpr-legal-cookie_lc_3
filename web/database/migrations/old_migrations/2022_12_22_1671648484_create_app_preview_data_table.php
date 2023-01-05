<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppPreviewDataTable extends Migration
{
    public function up()
    {
        Schema::create('app_preview_data', function (Blueprint $table) {

		$table->integer('id',6);
		$table->integer('app_partner_id',2);
		$table->string('app_alternate_id');
		$table->text('app_preview_data');
		$table->datetime('updated_at')->default('CURRENT_TIMESTAMP');

        });
    }

    public function down()
    {
        Schema::dropIfExists('app_preview_data');
    }
}