<?php

use App\Http\Controllers\Staff\CaseRecordController;
use App\Http\Controllers\Staff\ContentController;
use App\Http\Controllers\Staff\DashboardController;
use App\Http\Controllers\Staff\FollowUpController;
use App\Http\Controllers\Staff\UserController;
use App\Http\Controllers\PublicPageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicPageController::class, 'home'])->name('home');
Route::get('/services', [PublicPageController::class, 'services'])->name('public.services');
Route::get('/about', [PublicPageController::class, 'about'])->name('public.about');
Route::get('/contact', [PublicPageController::class, 'contact'])->name('public.contact');
Route::get('public-content/{slug}', [ContentController::class, 'publicShow'])
    ->where('slug', '[a-z0-9-]+')->name('public-content.show');

Route::middleware(['auth', 'active'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('staff')->name('staff.')->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard.data');

        Route::get('cases', [CaseRecordController::class, 'index'])->name('cases.index');
        Route::post('cases', [CaseRecordController::class, 'store'])->name('cases.store');
        Route::get('cases/{caseRecord}', [CaseRecordController::class, 'show'])->name('cases.show');
        Route::get('cases/{caseRecord}/history', [CaseRecordController::class, 'history'])->name('cases.history');
        Route::patch('cases/{caseRecord}', [CaseRecordController::class, 'update'])->name('cases.update');
        Route::delete('cases/{caseRecord}', [CaseRecordController::class, 'destroy'])->name('cases.destroy');
        Route::post('cases/{caseId}/restore', [CaseRecordController::class, 'restore'])->name('cases.restore');

        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::patch('users/{user}/active', [UserController::class, 'setActive'])->name('users.active');

        Route::get('content', [ContentController::class, 'index'])->name('content.index');
        Route::post('content', [ContentController::class, 'store'])->name('content.store');
        Route::get('content/{contentItem}', [ContentController::class, 'show'])->name('content.show');
        Route::patch('content/{contentItem}', [ContentController::class, 'update'])->name('content.update');
        Route::post('content/{contentItem}/preview', [ContentController::class, 'preview'])->name('content.preview');
        Route::post('content/{contentItem}/publish', [ContentController::class, 'publish'])->name('content.publish');

        Route::get('cases/{caseRecord}/follow-ups', [FollowUpController::class, 'index'])->name('follow-ups.index');
        Route::post('cases/{caseRecord}/follow-ups', [FollowUpController::class, 'store'])->name('follow-ups.store');
        Route::patch('follow-ups/{followUp}', [FollowUpController::class, 'update'])->name('follow-ups.update');
    });
});

require __DIR__.'/settings.php';
