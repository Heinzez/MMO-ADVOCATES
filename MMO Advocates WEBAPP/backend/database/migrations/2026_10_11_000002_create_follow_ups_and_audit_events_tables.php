<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('follow_ups', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('case_id')->constrained()->restrictOnDelete();
            $table->date('due_on');
            $table->text('note');
            $table->string('status', 20)->default('pending');
            $table->foreignId('assignee_id')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index(['status', 'due_on']);
        });

        Schema::create('audit_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('event', 80);
            $table->string('subject_type', 80);
            $table->unsignedBigInteger('subject_id');
            $table->timestampTz('created_at')->useCurrent();

            $table->index(['subject_type', 'subject_id', 'created_at']);
            $table->index(['actor_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_events');
        Schema::dropIfExists('follow_ups');
    }
};
