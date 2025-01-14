<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;

class GeocodeController extends Controller
{
    public function getGeocode(Request $request)
    {
        try {
            $lat = $request->query('lat', '3.683');
            $lng = $request->query('long', '98.6178');
            $apiKey = env('OPENCAGE_API_KEY', '03c48dae07364cabb7f121d8c1519492');

            $url = "https://api.opencagedata.com/geocode/v1/json";
            // $url = "https://nominatim.openstreetmap.org/reverse";

            Log::info("Calling OpenCage API: $url");

            $client = new Client();
            $response = $client->request('GET', $url, [
                'query' => [
                    'q' => "$lat+$lng",
                    'format' => 'json',
                    'accept-language' => 'id',
                    'key' => $apiKey,
                ],
                'verify' => true, // Enable SSL verification
                'headers' => [
                    'User-Agent' => 'DukungLokal/1.0',
                ],
            ]);

            return response()->json(json_decode($response->getBody()->getContents(), true), $response->getStatusCode());
        } catch (\Exception $e) {
            Log::error("Geocode Error: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}



// <?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Log;
// use GuzzleHttp\Client;

// class GeocodeController extends Controller
// {
//     public function getGeocode(Request $request)
//     {
//         try {
//             $lat = $request->query('lat', '3.683');
//             $lng = $request->query('long', '98.6178');

//             $url = "https://nominatim.openstreetmap.org/reverse";

//             Log::info("Calling OpenStreetMap API: $url");

//             $client = new Client();
//             $response = $client->request('GET', $url, [
//                 'query' => [
//                     'lat' => $lat,
//                     'lon' => $lng,
//                     'format' => 'json',
//                     'accept-language' => 'id',
//                 ],
//                 'verify' => true, // Enable SSL verification
//                 'headers' => [
//                     'User-Agent' => 'DukungLokal/1.0',
//                 ],
//             ]);

//             Log::info("Response Status: " . $response->getStatusCode());
//             Log::info("Response Body: " . $response->getBody()->getContents());

//             return response()->json(json_decode($response->getBody()->getContents(), true), $response->getStatusCode());
//         } catch (\Exception $e) {
//             Log::error("Geocode Error: " . $e->getMessage());
//             return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
//         }
//     }
// }