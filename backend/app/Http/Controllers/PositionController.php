<?php

namespace App\Http\Controllers;

use App\Helpers\ApiFormatter;
use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $positions = Position::with(['product', 'product.vendor'])->get();
        return ApiFormatter::sendResponse('success', 200, 'Position list', $positions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'latitude' => 'required',
            'longitude' => 'required',
            'product_id' => 'required|exists:products,id',
        ]);

        $position = Position::create($validate);

        return ApiFormatter::sendResponse('success', 200, 'Position created', $position);
    }

    /**
     * Display the specified resource.
     */
    public function show(Position $position)
    {
        $position = $position->load(['product', 'product.vendor']);
        return ApiFormatter::sendResponse('success', 200, 'Position detail', $position);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Position $position)
    {
        $validate = $request->validate([
            'latitude' => 'required',
            'longitude' => 'required',
            'product_id' => 'required|exists:products,id',
        ]);

        $position->update($validate);

        return ApiFormatter::sendResponse('success', 200, 'Position updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Position $position)
    {
        $position->delete();
        return ApiFormatter::sendResponse('success', 200, 'Position deleted');
    }
}
