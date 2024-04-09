<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
       
          // Check if the authenticated user has admin privileges
        if (auth()->user()->user_rank == 3 || auth()->user()->user_rank == 4 || auth()->user()->user_rank == 5) {
            // User is an admin, allow access to the route
            return $next($request);
        }
        
        // User does not have admin privileges, redirect or return an error response
        return abort(403, 'Unauthorized'); // or redirect to a different route
    }
    }


