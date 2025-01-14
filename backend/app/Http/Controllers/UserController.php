<?php

namespace App\Http\Controllers;

use App\Helpers\ApiFormatter;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function ranking()
    {
        // Get users with product count and likes
        $users = User::withCount('products')
            ->with(['products' => function ($query) {
                $query->select('user_id', 'likes');
            }])
            ->get()
            ->map(function ($user) {
                // Calculate total likes across all products
                $totalLikes = $user->products->sum(function ($product) {
                    return count(is_array($product->likes) ? $product->likes : []);
                });

                // Calculate points: (likes + products_count * 100)
                $points = $totalLikes + ($user->products_count * 100);

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'products_count' => $user->products_count,
                    'medsoses' => $user->medsoses,
                    'total_product_likes' => $totalLikes,
                    'points' => $points
                ];
            })
            ->sortByDesc('points')
            ->values();

        return ApiFormatter::sendResponse('success', 200, 'User ranking', $users);
    }

    public function myProfile()
    {
        // Get user with product count and likes
        $user = User::where('id', auth()->user()->id)->withCount('products')
            ->with(['products' => function ($query) {
                $query->select('user_id', 'likes');
            }])
            ->first();

        // Calculate total likes across all products
        $totalLikes = $user->products->sum(function ($product) {
            return count(is_array($product->likes) ? $product->likes : []);
        });

        // Calculate points: (likes + products_count * 100)
        $points = $totalLikes + ($user->products_count * 100);

        // urutan rank current user berdasarkan point yang sudah di sorting
        $rank = User::withCount('products')
            ->with(['products' => function ($query) {
                $query->select('user_id', 'likes');
            }])
            ->get()
            ->map(function ($user) {
                $totalLikes = $user->products->sum(function ($product) {
                    return count(is_array($product->likes) ? $product->likes : []);
                });
                $points = $totalLikes + ($user->products_count * 100);
                return [
                    'id' => $user->id,
                    'points' => $points
                ];
            })
            ->sortByDesc('points')
            ->pluck('id')
            ->search($user->id) + 1;

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'products_count' => $user->products_count,
            'total_product_likes' => $totalLikes,
            'points' => $points,
            'medsoses' => $user->medsoses,
            'rank' => $rank
        ];

        return ApiFormatter::sendResponse('success', 200, 'User profile', $userData);
    }

    public function myUMKM()
    {
        $umkm = Product::with('vendor:id,name')->where('user_id', auth()->user()->id)->get(['id', 'name', 'vendor_id', 'likes'])
            ->map(function ($product) {
                $product->likes = count(is_array($product->likes) ? $product->likes : []);
                return $product;
            });

        return ApiFormatter::sendResponse('success', 200, 'My UMKM', $umkm);
    }

    public function storeMedsos()
    {
        $validate = request()->validate([
            'medsoses' => 'required|array',
            'medsoses.*.username' => 'required|string',
            'medsoses.*.url' => 'required|string',
            'medsoses.*.platform' => 'required|string|in:instagram,facebook,youtube,tiktok',
        ]);

        $user = Auth::user();

        $user->update($validate);

        return ApiFormatter::sendResponse('success', 200, 'Social media updated', $user->medsoses);
    }

    public function changePassword()
    {
        $validate = request()->validate([
            'old_password' => 'required',
            'password' => 'required|confirmed',
        ]);

        $user = Auth::user();

        if (!password_verify($validate['old_password'], $user->password)) {
            return ApiFormatter::sendResponse('error', 401, 'Old password is incorrect');
        }

        $user->update([
            'password' => bcrypt($validate['password'])
        ]);

        return ApiFormatter::sendResponse('success', 200, 'Password updated');
    }
}
