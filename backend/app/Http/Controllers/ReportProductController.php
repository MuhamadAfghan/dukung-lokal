<?php

namespace App\Http\Controllers;

use App\Helpers\ApiFormatter;
use App\Models\Product;
use App\Models\Report;
use App\Models\ReportProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id)
    {
        // Validate product exists first
        $product = Product::find($id);
        if (!$product) {
            return ApiFormatter::sendResponse('error', 404, 'Product not found');
        }

        $validate = [
            'category' => 'required|string|in:fraud,poor_service,misleading_info,poor_quality,unsafe_product,illegal_activity,wrong_product,overcharged,other',
            'reason' => 'nullable|string',
        ];

        if ($request->category === 'other') {
            $validate['description'] = 'required|string';
        } else {
            $validate['description'] = 'nullable|string';
        }

        $validate = $request->validate($validate);

        $report = Report::where('product_id', $id)->first();

        if ($report) {
            if ($report->reportProducts()->where('user_id', auth()->user()->id)->exists()) {
                return ApiFormatter::sendResponse('error', 400, 'You have already reported this product');
            }

            if ($validate['category'] == 'other') {
                $report->max_index = 3;
                $report->save();
            }

            $report->fresh();

            if ($report->max_index >= $report->reportProducts()->count()) {

                //remove images from storage
                foreach ($report->product->images as $image) {
                    if ($image) {
                        if (Storage::exists($image)) {
                            Storage::delete($image);
                        }
                    }
                }

                //remove product
                $report->product->delete();

                return ApiFormatter::sendResponse('success', 200, 'Product has been deleted');
            } else {
                $report->reportProducts()->create([
                    'category' => $validate['category'],
                    'reason' => $validate['description'],
                    'user_id' => auth()->user()->id,
                ]);

                return ApiFormatter::sendResponse('success', 200, 'Report has been sent', $report);
            }
        } else {
            try {
                $report = Report::create([
                    'product_id' => $id,
                    'max_index' => $validate['category'] == 'other' ? 3 : 2,
                ]);

                $report->reportProducts()->create([
                    'category' => $validate['category'],
                    'reason' => $validate['description'],
                    'user_id' => auth()->user()->id,
                ]);

                return ApiFormatter::sendResponse('success', 200, 'Report has been sent', $report);
            } catch (\Exception $e) {
                return ApiFormatter::sendResponse('error', 500, 'Failed to create report: ' . $e->getMessage());
            }
        }

        return ApiFormatter::sendResponse('success', 200, 'Report has been sent', $report);
    }

    /**
     * Display the specified resource.
     */
    public function show(ReportProduct $reportProduct)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReportProduct $reportProduct)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReportProduct $reportProduct)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReportProduct $reportProduct)
    {
        //
    }
}
