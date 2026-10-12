<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('public_content_items', function (Blueprint $table): void {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('title', 255);
            $table->longText('body');
            $table->string('status', 20)->default('draft');
            $table->foreignId('updated_by')->constrained('users')->restrictOnDelete();
            $table->string('published_slug', 100)->nullable()->unique();
            $table->string('published_title')->nullable();
            $table->longText('published_body')->nullable();
            $table->timestampTz('published_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('public_content_items');
    }
};
