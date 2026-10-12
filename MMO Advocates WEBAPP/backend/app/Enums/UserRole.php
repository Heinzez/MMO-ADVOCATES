<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Associate = 'associate';
    case Staff = 'staff';
}
