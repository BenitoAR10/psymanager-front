import { fetcher } from "../utils/fetcher";

type CompleteExerciseRequestDto = {
  exerciseId: number;
};

export async function completeExercise(
  dto: CompleteExerciseRequestDto
): Promise<void> {
  await fetcher("/api/exercises/complete", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}
