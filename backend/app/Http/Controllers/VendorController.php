<?php

namespace App\Http\Controllers;

use App\Helpers\ApiFormatter;
use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vendors = Vendor::with(['products', 'products.positions'])->get();
        return ApiFormatter::sendResponse('success', 200, 'Vendor list', $vendors);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'contact' => 'required|array',
            'contact.email' => 'required|email',
            'contact.phone' => 'required|string',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vendor $vendor)
    {
        $vendor = $vendor->load(['products', 'products.positions']);
        return ApiFormatter::sendResponse('success', 200, 'Vendor detail', $vendor);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vendor $vendor)
    {
        $validate = $request->validate([
            'name' => 'required|string',
            'contact' => 'required|array',
            'contact.email' => 'required|email',
            'contact.phone' => 'required|string',
        ]);

        $vendor->update($validate);

        return ApiFormatter::sendResponse('success', 200, 'Vendor updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vendor $vendor)
    {
        $vendor->delete();
        return ApiFormatter::sendResponse('success', 200, 'Vendor deleted');
    }
}
