<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdditionalRowsCharges extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("charges", function (Blueprint $table) {
            $table->tinyInteger("balance_used", 2)->default(0)->after("capped_amount");
            $table->tinyInteger("balance_remaining", 2)->default(0)->after("balance_used");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
