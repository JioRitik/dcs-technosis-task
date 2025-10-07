<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\User;
use App\Models\Payment;
use App\Services\FormService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;


class AdminController extends Controller
{
    public function __construct(private FormService $formService) {}

    public function dashboard(): JsonResponse
    {
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'total_forms' => Form::count(),
            'total_submissions' => \App\Models\Submission::count(),
            'total_revenue' => Payment::where('status', 'success')->sum('amount'),
            'recent_payments' => Payment::with(['user', 'submission.form'])
                ->where('status', 'success')
                ->latest()
                ->take(5)
                ->get()
        ];

        return response()->json($stats);
    }

    public function forms(): JsonResponse
    {
        $forms = $this->formService->getAllForms();

        return response()->json([
            'forms' => $forms
        ]);
    }

    public function createForm(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'fields' => 'required|array',
            'fields.*.name' => 'required|string',
            'fields.*.type' => 'required|string',
            'fields.*.label' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'max_submissions' => 'nullable|integer|min:1'
        ]);

        $form = $this->formService->createForm($request->all());

        return response()->json([
            'message' => 'Form created successfully',
            'form' => $form
        ], 201);
    }

    public function updateForm(Request $request, Form $form): JsonResponse
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'fields' => 'sometimes|required|array',
            'amount' => 'sometimes|required|numeric|min:0',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'max_submissions' => 'nullable|integer|min:1'
        ]);

        $this->formService->updateForm($form, $request->all());

        return response()->json([
            'message' => 'Form updated successfully',
            'form' => $form->fresh()
        ]);
    }

    public function deleteForm(Form $form): JsonResponse
    {
        $this->formService->deleteForm($form);

        return response()->json([
            'message' => 'Form deleted successfully'
        ]);
    }

    public function formSubmissions(Form $form): JsonResponse
    {
        $submissions = $this->formService->getFormSubmissions($form);

        return response()->json([
            'submissions' => $submissions
        ]);
    }
}
