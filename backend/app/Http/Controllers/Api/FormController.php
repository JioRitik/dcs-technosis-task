<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Services\FormService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FormController extends Controller
{
    public function __construct(private FormService $formService) {}

    public function index(): JsonResponse
    {
        $forms = $this->formService->getAvailableForms();

        return response()->json([
            'forms' => $forms
        ]);
    }

    public function show(Form $form): JsonResponse
    {
        if (!$form->isAvailable()) {
            return response()->json([
                'message' => 'Form is not available'
            ], 404);
        }

        return response()->json([
            'form' => $form
        ]);
    }

    public function submit(Request $request, Form $form): JsonResponse
    {
        try {
            // Dynamic validation based on form fields
            $rules = [];
            foreach ($form->fields as $field) {
                if ($field['required'] ?? false) {
                    $rules[$field['name']] = 'required';
                }

                // Add specific validation rules based on field type
                switch ($field['type']) {
                    case 'email':
                        $rules[$field['name']] = ($rules[$field['name']] ?? '') . '|email';
                        break;
                    case 'number':
                        $rules[$field['name']] = ($rules[$field['name']] ?? '') . '|numeric';
                        break;
                    case 'date':
                        $rules[$field['name']] = ($rules[$field['name']] ?? '') . '|date';
                        break;
                }
            }

            $request->validate($rules);

            $submission = $this->formService->submitForm(
                $form,
                $request->user()->id,
                $request->only(array_column($form->fields, 'name'))
            );

            return response()->json([
                'message' => 'Form submitted successfully',
                'submission' => $submission
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function userSubmissions(Request $request): JsonResponse
    {
        $submissions = $request->user()
            ->submissions()
            ->with(['form', 'payment'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'submissions' => $submissions
        ]);
    }
}
