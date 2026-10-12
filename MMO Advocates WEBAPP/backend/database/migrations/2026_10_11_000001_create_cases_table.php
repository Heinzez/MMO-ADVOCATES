<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table): void {
            $table->id();
            $table->string('client_name');
            $table->string('client_contact');
            $table->string('type');
            $table->string('case_number')->nullable();
            $table->string('court')->nullable();
            $table->string('status');
            $table->foreignId('assigned_lawyer_id')->constrained('users')->restrictOnDelete();
            $table->date('opened_on');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['assigned_lawyer_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
