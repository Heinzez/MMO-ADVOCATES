<?php

use App\Http\Controllers\Staff\CaseRecordController;
use App\Http\Controllers\Staff\DashboardController;
use App\Http\Controllers\Staff\FollowUpController;
use App\Http\Controllers\Staff\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'active'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('staff')->name('staff.')->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard.data');

        Route::get('cases', [CaseRecordController::class, 'index'])->name('cases.index');
        Route::post('cases', [CaseRecordController::class, 'store'])->name('cases.store');
        Route::get('cases/{caseRecord}', [CaseRecordController::class, 'show'])->name('cases.show');
        Route::patch('cases/{caseRecord}', [CaseRecordController::class, 'update'])->name('cases.update');
        Route::delete('cases/{caseRecord}', [CaseRecordController::class, 'destroy'])->name('cases.destroy');
        Route::post('cases/{caseId}/restore', [CaseRecordController::class, 'restore'])->name('cases.restore');

        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::patch('users/{user}/active', [UserController::class, 'setActive'])->name('users.active');

        Route::get('cases/{caseRecord}/follow-ups', [FollowUpController::class, 'index'])->name('follow-ups.index');
        Route::post('cases/{caseRecord}/follow-ups', [FollowUpController::class, 'store'])->name('follow-ups.store');
        Route::patch('follow-ups/{followUp}', [FollowUpController::class, 'update'])->name('follow-ups.update');
    });
});

require __DIR__.'/settings.php';
