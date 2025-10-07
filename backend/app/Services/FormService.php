<?php

namespace App\Services;

use App\Models\Form;
use App\Models\Submission;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class FormService
{
    public function getAllForms(int $perPage = 15): LengthAwarePaginator
    {
        return Form::with('submissions')->paginate($perPage);
    }

    public function getAvailableForms(): Collection
    {
        return Form::available()->get();
    }

    public function createForm(array $data): Form
    {
        return Form::create($data);
    }

    public function updateForm(Form $form, array $data): bool
    {
        return $form->update($data);
    }

    public function deleteForm(Form $form): bool
    {
        return $form->delete();
    }

    public function submitForm(Form $form, int $userId, array $data): Submission
    {
        if (!$form->isAvailable()) {
            throw new \Exception('Form is not available for submission');
        }

        // Check if user already submitted this form
        $existingSubmission = Submission::where('user_id', $userId)
                                      ->where('form_id', $form->id)
                                      ->first();

        if ($existingSubmission) {
            throw new \Exception('You have already submitted this form');
        }

        return Submission::create([
            'user_id' => $userId,
            'form_id' => $form->id,
            'data' => $data,
            'status' => 'pending'
        ]);
    }

    public function getFormSubmissions(Form $form, int $perPage = 15): LengthAwarePaginator
    {
        return $form->submissions()
                   ->with(['user', 'payment'])
                   ->latest()
                   ->paginate($perPage);
    }
}
