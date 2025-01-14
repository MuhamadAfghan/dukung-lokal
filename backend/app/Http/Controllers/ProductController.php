<?php

namespace App\Http\Controllers;

use App\Helpers\ApiFormatter;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('vendor', 'positions');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // if ($request->has('type')) {
        //     $query->where('type', $request->type);
        // }

        $products = $query->get();

        return ApiFormatter::sendResponse('success', 200, 'Product list', $products);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     $validate = $request->validate([
    //         'name' => 'required|string',
    //         'description' => 'nullable|string',
    //         'category' => 'required|in:Makanan,Minuman,Pakaian,Furnitur,Elektronik,Jasa & Layanan,Kerajinan,Pertanian/Perkebunan,Bahan Pokok',
    //         'type' => 'required|in:Keliling,Tetap,Ruko',
    //         'images' => 'required|array',
    //         'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
    //         'price' => 'required|array',
    //         'price.min' => 'required',
    //         'price.max' => 'required',
    //         'open_time' => 'required|string',
    //         'close_time' => 'required|string',
    //         // 'vendor_id' => 'required|exists:vendors,id',

    //         'position' => 'required|array',
    //         'position.latitude' => 'required',
    //         'position.longitude' => 'required',

    //         'vendor.name' => 'required|string',
    //         'vendor.contact' => 'required|array',
    //         'vendor.contact.email' => 'nullable|email',
    //         'vendor.contact.phone' => 'required|string',

    //         'omzet_per_week' => 'required|int',
    //     ], [
    //         'images.*.image' => 'The file must be an image (jpeg, png, jpg)',
    //         'images.*.mimes' => 'The file must be an image (jpeg, png, jpg)',
    //         'images.*.max' => 'The file may not be greater than 2048 kilobytes',
    //     ]);


    //     // pastikan omset perminggu tidak lebih dari 24.038.462 jt
    //     if ($validate['omzet_per_week'] > 24038462) {
    //         return ApiFormatter::sendResponse('error', 400, 'Syarat UMKM, omzet perminggu tidak boleh lebih dari Rp. 24.038.462 jt');
    //     }

    //     $validate['user_id'] = auth()->user()->id;
    //     // $validate['user_id'] = "9de58031-5e77-4063-a2b1-6c44238582c6";
    //     // $validate['user_id'] = "9de38f86-783a-4dd7-9931-6714d0c66474";

    //     # Store Images
    //     $images = [];
    //     foreach ($request->images as $image) {
    //         $images[] = $image->store('images', 'public');
    //     }

    //     $validate['images'] = $images;

    //     $vendor = null;

    //     if (Vendor::where('contact->phone', $validate['vendor']['contact']['phone'])->count() > 0) {
    //         $vendor = Vendor::where('contact->phone', $validate['vendor']['contact']['phone'])->first();
    //     } else if (Vendor::where('contact->email', $validate['vendor']['contact']['email'])->count() > 0) {
    //         $vendor = Vendor::where('contact->email', $validate['vendor']['contact']['email'])->first()->products()->where('name', $validate['name'])->first();
    //     } else if (Vendor::where('name', $validate['vendor']['name'])->count() > 0) {
    //         $vendor = Vendor::where('name', $validate['vendor']['name'])->first()->products()->where('name', $validate['name'])->first();
    //     }

    //     if ($vendor) {
    //         $product = $vendor->products()->where('name', 'LIKE', '%' . $validate['name'] . '%')->where('category', $validate['category'])->first();
    //         if ($product) {
    //             if ($product->type == 'Keliling') {
    //                 if ($product->positions->where('latitude', $validate['position']['latitude'])->where('longitude', $validate['position']['longitude'])->count() > 0) {
    //                     return ApiFormatter::sendResponse('error', 409, 'Position already exist');
    //                 } else {
    //                     $product->positions()->create($validate['position']);
    //                 }

    //                 return ApiFormatter::sendResponse('success', 200, 'Position Product Update', $product->load('vendor', 'positions'));
    //             } else {
    //                 return ApiFormatter::sendResponse('error', 409, 'Product already exist');
    //             }
    //         } else {
    //             $product = $vendor->products()->create($validate);
    //             $product->positions()->create($validate['position']);
    //             return ApiFormatter::sendResponse('success', 200, 'Product created', $product->load('vendor', 'positions'));
    //         }
    //     } else {
    //         // $product = Product::create($validate);
    //         // # Store Positions
    //         // $product->positions()->create($validate['position']);
    //         // $product->vendor()->create($validate['vendor']);
    //         $vendor = Vendor::create($validate['vendor']);
    //         $product = $vendor->products()->create($validate);
    //         $product->positions()->create($validate['position']);
    //         return ApiFormatter::sendResponse('success', 200, 'Product created', $product->load('vendor', 'positions'));
    //     }
    // }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'category' => 'required|in:Makanan,Minuman,Pakaian,Furnitur,Elektronik,Jasa & Layanan,Kerajinan,Pertanian/Perkebunan,Bahan Pokok',
            'type' => 'required|in:Keliling,Tetap,Ruko',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'price' => 'required|array',
            'price.min' => 'required',
            'price.max' => 'required',
            'open_time' => 'required|string',
            'close_time' => 'required|string',
            // 'vendor_id' => 'required|exists:vendors,id',

            'position' => 'required|array',
            'position.latitude' => 'required',
            'position.longitude' => 'required',

            'vendor.name' => 'required|string',
            'vendor.contact' => 'required|array',
            'vendor.contact.email' => 'nullable|email',
            'vendor.contact.phone' => 'required|string',

            'omzet_per_week' => 'required|int',
        ], [
            'images.*.image' => 'The file must be an image (jpeg, png, jpg)',
            'images.*.mimes' => 'The file must be an image (jpeg, png, jpg)',
            'images.*.max' => 'The file may not be greater than 2048 kilobytes',
        ]);

        $validate['user_id'] = auth()->user()->id;
        // pastikan omset perminggu tidak lebih dari 24.038.462 jt
        if ($validate['omzet_per_week'] > 24038462) {
            return ApiFormatter::sendResponse('error', 400, 'Syarat UMKM, omzet perminggu tidak boleh lebih dari Rp. 24.038.462 jt');
        }

        $images = [];
        foreach ($request->images as $image) {
            $images[] = $image->store('images', 'public');
        }
        $validate['images'] = $images;

        // Find existing vendor
        $vendor = Vendor::where('contact->phone', $validate['vendor']['contact']['phone'])
            ->orWhere('contact->email', $validate['vendor']['contact']['email'])
            ->first();

        if (!$vendor) {
            $vendor = Vendor::create($validate['vendor']);
        }

        // Check for existing product
        $product = $vendor->products()
            ->where('name', 'LIKE', '%' . $validate['name'] . '%')
            ->where('category', $validate['category'])
            ->first();

        if ($product) {
            if ($product->type == 'Keliling') {
                // Check if position exists
                $existingPosition = $product->positions()
                    ->where('latitude', $validate['position']['latitude'])
                    ->where('longitude', $validate['position']['longitude'])
                    ->exists();

                if ($existingPosition) {
                    return ApiFormatter::sendResponse('error', 409, 'Position already exists');
                }

                $product->positions()->create($validate['position']);
                return ApiFormatter::sendResponse(
                    'success',
                    200,
                    'Position Product Updated',
                    $product->load('vendor', 'positions')
                );
            } else {
                $product->update([
                    'type' => "Keliling",
                ]);
                $product->positions()->create($validate['position']);
                return ApiFormatter::sendResponse(
                    'success',
                    200,
                    'Product update new position',
                    $product->load('vendor', 'positions')
                );
            }
        }

        // Create new product
        $product = $vendor->products()->create($validate);
        $product->positions()->create($validate['position']);

        return ApiFormatter::sendResponse(
            'success',
            200,
            'Product created',
            $product->load('vendor', 'positions')
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product = $product->load('vendor', 'positions');
        return ApiFormatter::sendResponse('success', 200, 'Product detail', $product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validate = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|in:Makanan,Minuman,Pakaian,Furnitur,Elektronik,Jasa & Layanan,Kerajinan,Pertanian/Perkebunan,Bahan Pokok',
            'type' => 'required|in:Keliling,Tetap,Ruko',
            'images' => 'required|array',
            'price' => 'required|array',
            'price.min' => 'required',
            'price.max' => 'required',
            'open_time' => 'required|string',
            'close_time' => 'required|string',
            'vendor_id' => 'required|exists:vendors,id',
        ]);

        # Store Images
        $images = [];
        foreach ($request->images as $image) {
            $images[] = $image->store('images', 'public');
        }

        $validate['images'] = $images;

        $product->update($validate);

        return ApiFormatter::sendResponse('success', 200, 'Product updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        # Delete Images
        foreach ($product->images as $image) {
            if (Storage::disk('public')->exists($image)) {
                Storage::disk('public')->delete($image);
            }
        }
        $product->delete();
        return ApiFormatter::sendResponse('success', 200, 'Product deleted');
    }

    public function toggleLike(string $id)
    {
        $product = Product::findOrfail($id);
        $user = Auth::user();
        $likes = $product->likes;
        if ($likes == null) {
            $likes = [];
        } else {
            $likes = is_string($likes) ? json_decode($likes) : $likes;
        }

        // Check if user already liked the product
        if (in_array($user->id, $likes)) {
            $likes = array_diff($likes, [$user->id]);
            $message = 'unliked';
        } else {
            $likes[] = $user->id;
            $message = 'liked';
        }

        $product->update([
            'likes' => $likes
        ]);

        return ApiFormatter::sendResponse('success', 200, $message);
    }
}
